"use client";

import {
  buildCatalogLookup,
  createCharacter,
  selectAncestry as engineSelectAncestry,
  selectBackground as engineSelectBackground,
  selectClass as engineSelectClass,
  applyEntityEffects,
  type CatalogLookup,
  type DerivedContext,
  type ChoiceResolution,
} from "@pen-paper-rpg/engine";
import type {
  AbilityId,
  AbilityScoreBlock,
  CatalogIndex,
  Character,
  CharacterIdentity,
  ChoiceDefinition,
  ProficiencySummary,
} from "@pen-paper-rpg/schemas";
import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchCatalogIndex } from "@/lib/catalog-client";
import type { DesktopBridge, SelectPacksResult } from "@/types/desktop";

export type CharacterBuilderStatus = "idle" | "loading" | "ready" | "error";

type SelectableEntityType = "ancestry" | "background" | "class";

const CHARACTER_STORAGE_KEY = "penPaperRpg.characterBuilder.character";

const DEFAULT_DERIVED_CONTEXT: DerivedContext = {
  ancestryHitPoints: 8,
  classHitPoints: 10,
  keyAbility: "STR",
  baseSpeed: 25,
};

export interface CharacterBuilderState {
  catalog: CatalogIndex;
  catalogLookup: CatalogLookup;
  character: Character;
  pendingChoices: ChoiceDefinition[];
  derivedContext: DerivedContext;
}

interface BuilderHookResult {
  status: CharacterBuilderStatus;
  state: CharacterBuilderState | null;
  error: Error | null;
  refresh: () => Promise<void>;
  selectAncestry: (id: string) => void;
  selectHeritage: (id: string) => void;
  selectBackground: (id: string) => void;
  selectClass: (id: string) => void;
  resolveAbilityBoost: (choiceId: string, selectedAbilities: AbilityId[]) => void;
  trainSkills: (skillIds: string[]) => void;
  learnSpells: (cantrips: string[], rank1Spells: string[]) => void;
  selectFeats: (selections: Array<{ slotIndex: number; featId: string; grantedBy: string }>) => void;
  updateEquipment: (equipment: any[], wealthRemaining: number) => void;
  resetCharacter: () => void;
}

function getDesktopBridge(): DesktopBridge | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  return window.penPaperRpg;
}

function cloneDerivedContext(): DerivedContext {
  return { ...DEFAULT_DERIVED_CONTEXT };
}

function persistCharacterState(character: Character): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(character));
    }
  } catch {
    // ignore persistence failures
  }
}

function loadPersistedCharacterState(): Character | null {
  try {
    if (typeof window === "undefined") {
      return null;
    }
    const stored = localStorage.getItem(CHARACTER_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as Character;
  } catch {
    return null;
  }
}

function isValidCharacterForCatalog(character: Character, catalog: CatalogIndex): boolean {
  const { ancestryId, backgroundId, classId } = character.identity;
  const entityIds = catalog.entities.map((entry) => entry.entity.id);

  return (
    (!ancestryId || entityIds.includes(ancestryId)) &&
    (!backgroundId || entityIds.includes(backgroundId)) &&
    (!classId || entityIds.includes(classId))
  );
}

export function useCharacterBuilder(): BuilderHookResult {
  const [status, setStatus] = useState<CharacterBuilderStatus>("idle");
  const [state, setState] = useState<CharacterBuilderState | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const applyCatalog = useCallback((catalog: CatalogIndex) => {
    const catalogLookup = buildCatalogLookup(catalog.entities);
    const persistedCharacter = loadPersistedCharacterState();

    let character: Character;
    let pendingChoices: ChoiceDefinition[];
    let derivedContext: DerivedContext;

    if (persistedCharacter && isValidCharacterForCatalog(persistedCharacter, catalog)) {
      character = persistedCharacter;
      pendingChoices = [];
      derivedContext = cloneDerivedContext();
    } else {
      const initial = createInitialCharacter(catalog, catalogLookup);
      character = initial.character;
      pendingChoices = initial.pendingChoices;
      derivedContext = initial.derivedContext;
    }

    setState({
      catalog,
      catalogLookup,
      character,
      pendingChoices,
      derivedContext,
    });
    setStatus("ready");
  }, []);

  const loadCatalog = useMemo(() => async () => {
    setStatus("loading");
    setError(null);
    try {
      const catalog = await fetchCatalogIndex();
      applyCatalog(catalog);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setStatus("error");
    }
  }, [applyCatalog]);

  useEffect(() => {
    const bridge = getDesktopBridge();
    if (bridge) {
      setStatus("loading");
      setError(null);
      const unsubscribe = bridge.onCatalogLoaded((incoming: CatalogIndex) => {
        try {
          applyCatalog(incoming);
        } catch (e) {
          setError(e instanceof Error ? e : new Error("Catalog event error"));
          setStatus("error");
        }
      });
      return () => {
        try {
          unsubscribe?.();
        } catch {
          // ignore
        }
      };
    }

    void loadCatalog();
  }, []);

  const selectEntity = useCallback(
    (entityType: SelectableEntityType, entityId: string) => {
      let nextCharacter: Character | null = null;

      setState((current) => {
        if (!current) {
          return current;
        }

        const entityExists = current.catalog.entities.some(
          (entry) => entry.entity.id === entityId && entry.entity.type === entityType,
        );

        if (!entityExists) {
          return current;
        }

        const identityKey = `${entityType}Id` as keyof CharacterIdentity;
        if (current.character.identity[identityKey] === entityId) {
          return current;
        }

        const { character, catalogLookup, derivedContext } = current;

        // Get the entity to check for pending choices
        const entityEntry = catalogLookup.byId.get(entityId);
        if (!entityEntry) {
          return current;
        }

        // Apply entity effects to get pending choices
        const effectResult = applyEntityEffects(entityEntry.entity, character, catalogLookup);

        // Apply the selection (without resolving choices yet)
        let updatedCharacter: Character = character;

        if (entityType === "ancestry") {
          updatedCharacter = engineSelectAncestry(character, entityId, catalogLookup, derivedContext);
        } else if (entityType === "background") {
          updatedCharacter = engineSelectBackground(character, entityId, catalogLookup, derivedContext);
        } else {
          updatedCharacter = engineSelectClass(character, entityId, catalogLookup, derivedContext);
        }

        nextCharacter = updatedCharacter;

        return {
          ...current,
          character: updatedCharacter,
          pendingChoices: effectResult.choices.filter((choice) => choice.scope === "abilityBoost"),
          derivedContext: {
            ...current.derivedContext,
            speeds: { ...updatedCharacter.derived.speeds },
          },
        };
      });

      if (nextCharacter) {
        persistCharacterState(nextCharacter);
      }
    },
    [],
  );

  const resolveAbilityBoost = useCallback(
    (choiceId: string, selectedAbilities: AbilityId[]) => {
      let nextCharacter: Character | null = null;

      setState((current) => {
        if (!current) {
          return current;
        }

        // Find the choice being resolved
        const choice = current.pendingChoices.find((c) => c.id === choiceId);
        if (!choice) {
          console.warn(`Choice ${choiceId} not found in pending choices`);
          return current;
        }

        // Validate selection count
        if (selectedAbilities.length !== choice.count) {
          console.error(`Invalid selection: expected ${choice.count}, got ${selectedAbilities.length}`);
          return current;
        }

        const { character, catalogLookup, derivedContext } = current;
        const { identity } = character;

        let updatedCharacter: Character = character;

        // Check if this is a final boost (level 1 free boosts)
        if (choice.id.startsWith("level1:final-boost-")) {
          // Apply final boost directly to character's ability scores
          const newAdjustments = [...character.abilityAdjustments];

          for (const abilityId of selectedAbilities) {
            newAdjustments.push({
              type: "boost",
              abilities: [abilityId],
              value: 2,
              source: "Level 1 Free Boost",
              level: 1,
            });
          }

          // Create updated character with new adjustments
          updatedCharacter = createCharacter({
            metadata: character.metadata,
            identity: character.identity,
            baseAbilities: character.abilityScores.base,
            abilityAdjustments: newAdjustments,
            proficiencies: character.proficiencies,
            derivedContext,
          });
        } else {
          // Handle entity-based boosts
          const resolution: ChoiceResolution = {
            choiceId,
            selectedIds: selectedAbilities,
          };

          // Re-apply the entity selection with the choice resolution
          if (choice.id.includes("ancestry:") && identity.ancestryId) {
            updatedCharacter = engineSelectAncestry(
              character,
              identity.ancestryId,
              catalogLookup,
              derivedContext,
              [resolution],
            );
          } else if (choice.id.includes("background:") && identity.backgroundId) {
            updatedCharacter = engineSelectBackground(
              character,
              identity.backgroundId,
              catalogLookup,
              derivedContext,
              [resolution],
            );
          } else if (choice.id.includes("class:") && identity.classId) {
            updatedCharacter = engineSelectClass(
              character,
              identity.classId,
              catalogLookup,
              derivedContext,
              [resolution],
            );
          }
        }

        nextCharacter = updatedCharacter;

        // Remove the resolved choice from pending
        let remainingChoices = current.pendingChoices.filter((c) => c.id !== choiceId);

        // Check if we should add final boosts
        // Add them if: all entity boosts resolved, character is level 1, and final boosts not already added
        if (
          identity.level === 1 &&
          hasResolvedAllEntityBoosts(remainingChoices) &&
          !hasFinalBoosts(remainingChoices)
        ) {
          const finalBoosts = createFinalAbilityBoosts();
          remainingChoices = [...remainingChoices, ...finalBoosts];
        }

        return {
          ...current,
          character: updatedCharacter,
          pendingChoices: remainingChoices,
        };
      });

      if (nextCharacter) {
        persistCharacterState(nextCharacter);
      }
    },
    [],
  );

  const selectAncestry = useCallback((id: string) => selectEntity("ancestry", id), [selectEntity]);

  const selectHeritage = useCallback((id: string) => {
    let nextCharacter: Character | null = null;

    setState((current) => {
      if (!current) return current;

      const { character } = current;

      // Simply update the heritageId in character identity
      const updatedCharacter = {
        ...character,
        identity: {
          ...character.identity,
          heritageId: id,
        },
      };

      nextCharacter = updatedCharacter;
      return { ...current, character: updatedCharacter };
    });

    if (nextCharacter) {
      persistCharacterState(nextCharacter);
    }
  }, []);

  const selectBackground = useCallback((id: string) => selectEntity("background", id), [selectEntity]);
  const selectClass = useCallback((id: string) => selectEntity("class", id), [selectEntity]);

  const resetCharacter = useCallback(() => {
    setState((current) => {
      if (!current) {
        return current;
      }

      // Clear localStorage
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem(CHARACTER_STORAGE_KEY);
        }
      } catch {
        // ignore
      }

      // Create fresh initial character
      const initial = createInitialCharacter(current.catalog, current.catalogLookup);

      return {
        ...current,
        character: initial.character,
        pendingChoices: initial.pendingChoices,
        derivedContext: initial.derivedContext,
      };
    });
  }, []);

  const trainSkills = useCallback((skillIds: string[]) => {
    let nextCharacter: Character | null = null;

    setState((current) => {
      if (!current) {
        return current;
      }

      const { character } = current;

      // Update proficiencies with trained skills
      const updatedProficiencies: ProficiencySummary = {
        ...character.proficiencies,
        skills: {
          ...character.proficiencies.skills,
        },
      };

      // Add each skill as trained
      for (const skillId of skillIds) {
        updatedProficiencies.skills[skillId] = "trained";
      }

      // Create updated character preserving all existing properties
      const updatedCharacter = {
        ...character,
        proficiencies: updatedProficiencies,
      };

      nextCharacter = updatedCharacter;

      return {
        ...current,
        character: updatedCharacter,
      };
    });

    if (nextCharacter) {
      persistCharacterState(nextCharacter);
    }
  }, []);

  const learnSpells = useCallback((cantrips: string[], rank1Spells: string[]) => {
    let nextCharacter: Character | null = null;

    setState((current) => {
      if (!current) {
        return current;
      }

      const { character, catalogLookup } = current;

      // Get class entity to determine spell tradition and casting type
      const classEntity = character.identity.classId
        ? catalogLookup.byId.get(character.identity.classId)?.entity
        : null;

      if (!classEntity || classEntity.type !== "class") {
        return current;
      }

      // Map class to spellcasting details
      const spellcastingConfig: Record<string, { tradition: string; castingType: string; ability: AbilityId }> = {
        "pf2e.class.wizard": { tradition: "arcane", castingType: "prepared", ability: "INT" },
        "pf2e.class.cleric": { tradition: "divine", castingType: "prepared", ability: "WIS" },
        "pf2e.class.druid": { tradition: "primal", castingType: "prepared", ability: "WIS" },
        "pf2e.class.sorcerer": { tradition: "arcane", castingType: "spontaneous", ability: "CHA" }, // Default to arcane, should be based on bloodline
        "pf2e.class.bard": { tradition: "occult", castingType: "spontaneous", ability: "CHA" },
      };

      const config = spellcastingConfig[classEntity.id];
      if (!config) {
        // Not a spellcasting class
        return current;
      }

      // Create spells array
      const spells: Array<{ id: string; rank: number; prepared: boolean; slots: number }> = [
        ...cantrips.map((id) => ({ id, rank: 0, prepared: false, slots: 0 })),
        ...rank1Spells.map((id) => ({ id, rank: 1, prepared: false, slots: 0 })),
      ];

      // Create spellcasting entry
      const spellcastingEntry = {
        id: `${classEntity.id}-spellcasting`,
        tradition: config.tradition as any,
        castingType: config.castingType as any,
        ability: config.ability,
        focusPoints: 0,
        maxFocusPoints: 0,
        slots: {
          "0": 5, // 5 cantrip slots at level 1
          "1": 2, // 2 rank-1 slots at level 1
        },
        spells,
      };

      // Create updated character with spellcasting
      const updatedCharacter = {
        ...character,
        spellcasting: [spellcastingEntry],
      };

      nextCharacter = updatedCharacter;

      return {
        ...current,
        character: updatedCharacter,
      };
    });

    if (nextCharacter) {
      persistCharacterState(nextCharacter);
    }
  }, []);

  const selectFeats = useCallback((selections: Array<{ slotIndex: number; featId: string; grantedBy: string }>) => {
    let nextCharacter: Character | null = null;

    setState((current) => {
      if (!current) return current;
      const { character } = current;

      // Convert selections to CharacterFeatSelection format
      const featSelections = selections.map((selection, index) => ({
        id: selection.featId,
        grantedBy: selection.grantedBy,
        level: 1, // All level 1 feats at character creation
        replaced: false,
        choices: {},
      }));

      // Create updated character with feat selections
      const updatedCharacter = {
        ...character,
        feats: featSelections,
      };

      nextCharacter = updatedCharacter;
      return { ...current, character: updatedCharacter };
    });

    if (nextCharacter) {
      persistCharacterState(nextCharacter);
    }
  }, []);
  const updateEquipment = useCallback((equipment: any[], wealthRemaining: number) => {
    let nextCharacter: Character | null = null;

    setState((current) => {
      if (!current) return current;

      const { character } = current;

      const updatedCharacter = {
        ...character,
        equipment,
      };

      nextCharacter = updatedCharacter;
      return { ...current, character: updatedCharacter };
    });

    if (nextCharacter) {
      persistCharacterState(nextCharacter);
    }
  }, []);

 

  return {
    status,
    state,
    error,
    refresh: async () => {
      const bridge = getDesktopBridge();
      if (bridge) {
        try {
          const res: SelectPacksResult = await bridge.selectPacksDirectory();
          if (!res.canceled && res.catalog) {
            applyCatalog(res.catalog);
          }
        } catch (e) {
          setError(e instanceof Error ? e : new Error("Select packs failed"));
        }
        return;
      }
      await loadCatalog();
    },
    selectAncestry,
    selectHeritage,
    selectBackground,
    selectClass,
    resolveAbilityBoost,
    trainSkills,
    learnSpells,
    selectFeats,
    updateEquipment,
    resetCharacter,
  };
}

function createInitialCharacter(
  catalog: CatalogIndex,
  catalogLookup: CatalogLookup,
): {
  character: Character;
  pendingChoices: ChoiceDefinition[];
  derivedContext: DerivedContext;
} {
  const abilityScores: AbilityScoreBlock = {
    STR: 10,
    DEX: 10,
    CON: 10,
    INT: 10,
    WIS: 10,
    CHA: 10,
  };

  const proficiencies: ProficiencySummary = {
    perception: "trained",
    saves: {
      fortitude: "trained",
      reflex: "trained",
      will: "trained",
    },
    skills: {},
    lores: {},
    weapons: {},
    armor: {},
    spellcasting: {},
    classDC: "trained",
    perceptionModifiers: [],
  };

  const ancestryId = findFirstEntityId(catalog, "ancestry") ?? "pf2e.ancestry.human";
  const backgroundId = findFirstEntityId(catalog, "background") ?? "pf2e.background.blacksmith";
  const classId = findFirstEntityId(catalog, "class") ?? "pf2e.class.fighter";

  const derivedContext = cloneDerivedContext();

  const character = createCharacter({
    metadata: {
      id: "builder-initial",
      name: "New Character",
      schemaVersion: "0.1.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sources: [],
    },
    identity: {
      level: 1,
      ancestryId,
      backgroundId,
      classId,
      archetypeIds: [],
    },
    baseAbilities: abilityScores,
    abilityAdjustments: [],
    proficiencies,
    derivedContext,
  });

  // Collect pending choices from initial selections
  const ancestryChoices = ancestryId ? extractChoicesFromEntity(ancestryId, catalogLookup) : [];
  const backgroundChoices = backgroundId ? extractChoicesFromEntity(backgroundId, catalogLookup) : [];
  const classChoices = classId ? extractChoicesFromEntity(classId, catalogLookup) : [];

  const allChoices = [...ancestryChoices, ...backgroundChoices, ...classChoices].filter(
    (choice) => choice.scope === "abilityBoost",
  );

  return {
    character,
    pendingChoices: allChoices,
    derivedContext,
  };
}

function extractChoicesFromEntity(entityId: string, catalogLookup: CatalogLookup): ChoiceDefinition[] {
  const entry = catalogLookup.byId.get(entityId);
  if (!entry) {
    return [];
  }

  const effectResult = applyEntityEffects(entry.entity);
  return effectResult.choices;
}

function findFirstEntityId(catalog: CatalogIndex, type: string): string | undefined {
  const entry = catalog.entities.find((item) => item.entity.type === type);
  return entry?.entity.id;
}

/**
 * Creates the 4 final free ability boosts that all level 1 characters receive.
 * These are granted after ancestry, background, and class boosts are resolved.
 */
function createFinalAbilityBoosts(): ChoiceDefinition[] {
  return [
    {
      id: "level1:final-boost-1",
      label: "Final Ability Boost 1 of 4",
      count: 1,
      scope: "abilityBoost",
      allowDuplicates: false,
    },
    {
      id: "level1:final-boost-2",
      label: "Final Ability Boost 2 of 4",
      count: 1,
      scope: "abilityBoost",
      allowDuplicates: false,
    },
    {
      id: "level1:final-boost-3",
      label: "Final Ability Boost 3 of 4",
      count: 1,
      scope: "abilityBoost",
      allowDuplicates: false,
    },
    {
      id: "level1:final-boost-4",
      label: "Final Ability Boost 4 of 4",
      count: 1,
      scope: "abilityBoost",
      allowDuplicates: false,
    },
  ];
}

/**
 * Checks if all entity-based ability boost choices have been resolved.
 * Returns true if there are no pending choices with ancestry/background/class prefixes.
 */
function hasResolvedAllEntityBoosts(pendingChoices: ChoiceDefinition[]): boolean {
  return !pendingChoices.some(
    (choice) =>
      choice.scope === "abilityBoost" &&
      (choice.id.includes("ancestry:") || choice.id.includes("background:") || choice.id.includes("class:")),
  );
}

/**
 * Checks if final boosts have already been added to pending choices.
 */
function hasFinalBoosts(pendingChoices: ChoiceDefinition[]): boolean {
  return pendingChoices.some((choice) => choice.id.startsWith("level1:final-boost-"));
}


