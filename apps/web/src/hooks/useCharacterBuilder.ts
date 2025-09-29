"use client";

import {
  buildCatalogLookup,
  createCharacter,
  selectAncestry as engineSelectAncestry,
  selectBackground as engineSelectBackground,
  selectClass as engineSelectClass,
  type CatalogLookup,
  type DerivedContext,
} from "@pen-paper-rpg/engine";
import type {
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
      const initial = createInitialCharacter(catalog);
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
  };
}

function createInitialCharacter(
  catalog: CatalogIndex,
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

  return {
    character,
    pendingChoices: [],
    derivedContext,
  };
}

function findFirstEntityId(catalog: CatalogIndex, type: string): string | undefined {
  const entry = catalog.entities.find((item) => item.entity.type === type);
  return entry?.entity.id;
}


