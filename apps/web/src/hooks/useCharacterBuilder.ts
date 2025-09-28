"use client";

import { useEffect, useMemo, useState } from "react";

import type { CatalogIndex, Character } from "@pen-paper-rpg/schemas";
import { buildCatalogLookup, createCharacter } from "@pen-paper-rpg/engine";
import type { CatalogLookup } from "@pen-paper-rpg/engine";
import { fetchCatalogIndex } from "@/lib/catalog-client";
import type {
  AbilityScoreBlock,
  ChoiceDefinition,
  ProficiencySummary,
} from "@pen-paper-rpg/schemas";

export type CharacterBuilderStatus = "idle" | "loading" | "ready" | "error";

export interface CharacterBuilderState {
  catalog: CatalogIndex;
  catalogLookup: CatalogLookup;
  character: Character;
  pendingChoices: ChoiceDefinition[];
}

interface BuilderHookResult {
  status: CharacterBuilderStatus;
  state: CharacterBuilderState | null;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useCharacterBuilder(): BuilderHookResult {
  const [status, setStatus] = useState<CharacterBuilderStatus>("idle");
  const [state, setState] = useState<CharacterBuilderState | null>(null);
  const [error, setError] = useState<Error | null>(null);

  function applyCatalog(catalog: CatalogIndex): void {
    const catalogLookup = buildCatalogLookup(catalog.entities);
    const { character, pendingChoices } = createInitialCharacter(catalog);

    setState({
      catalog,
      catalogLookup,
      character,
      pendingChoices,
    });
    setStatus("ready");
  }

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
  }, []);

  useEffect(() => {
    // Desktop bridge present? Subscribe to catalog events instead of fetching.
    const bridge = typeof window !== "undefined" ? window.penPaperRpg : undefined;
    if (bridge) {
      setStatus("loading");
      setError(null);
      const unsubscribe = bridge.onCatalogLoaded((incoming) => {
        try {
          applyCatalog(incoming as CatalogIndex);
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

    // Fallback to HTTP fetch in web mode
    void loadCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    status,
    state,
    error,
    refresh: async () => {
      const bridge = typeof window !== "undefined" ? window.penPaperRpg : undefined;
      if (bridge) {
        // Let the user reselect packs; main process returns a catalog and we rely on the event for updates.
        try {
          await bridge.selectPacksDirectory();
        } catch (e) {
          // surface as error but do not crash
          setError(e instanceof Error ? e : new Error("Select packs failed"));
        }
        return;
      }
      await loadCatalog();
    },
  };
}

function createInitialCharacter(
  catalog: CatalogIndex,
): { character: Character; pendingChoices: ChoiceDefinition[] } {
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
    derivedContext: {
      ancestryHitPoints: 8,
      classHitPoints: 10,
      keyAbility: "STR",
      baseSpeed: 25,
    },
  });

  return {
    character,
    pendingChoices: [],
  };
}

function findFirstEntityId(catalog: CatalogIndex, type: string): string | undefined {
  const entry = catalog.entities.find((item) => item.entity.type === type);
  return entry?.entity.id;
}
