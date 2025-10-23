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
  selectBackground: (id: string) => void;
  selectClass: (id: string) => void;
  resolveAbilityBoost: (choiceId: string, selectedAbilities: AbilityId[]) => void;
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

        // Determine which entity this choice came from
        let updatedCharacter: Character = character;
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

        nextCharacter = updatedCharacter;

        // Remove the resolved choice from pending
        const remainingChoices = current.pendingChoices.filter((c) => c.id !== choiceId);

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
  const selectBackground = useCallback((id: string) => selectEntity("background", id), [selectEntity]);
  const selectClass = useCallback((id: string) => selectEntity("class", id), [selectEntity]);

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
    selectBackground,
    selectClass,
    resolveAbilityBoost,
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


