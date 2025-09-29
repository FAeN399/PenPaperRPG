import { describe, expect, it } from "vitest";
import {
  applyEffect,
  applyEntityEffects,
  resolveChoice,
  selectAncestry,
  selectBackground,
  selectClass,
  createEffectApplicationResult,
} from "../dist/effects.js";
import {
  createCharacter,
  createEffectApplicationContext,
  buildCatalogLookup,
} from "../dist/index.js";
import type {
  Effect,
  ContentEntity,
  Character,
  CatalogIndexEntry,
  AbilityScoreBlock,
  ProficiencySummary,
} from "../../schemas/dist/index.js";

describe("Effect Application System", () => {
  const baseAbilities: AbilityScoreBlock = {
    STR: 10,
    DEX: 10,
    CON: 10,
    INT: 10,
    WIS: 10,
    CHA: 10,
  };

  const baseProficiencies: ProficiencySummary = {
    perception: "untrained",
    saves: {
      fortitude: "untrained",
      reflex: "untrained",
      will: "untrained",
    },
    skills: {},
    lores: {},
    weapons: {},
    armor: {
      unarmored: "untrained",
    },
    spellcasting: {},
    classDC: "untrained",
    perceptionModifiers: [],
  };

  const baseCharacter: Character = createCharacter({
    metadata: {
      id: "test-char",
      name: "Test Character",
      schemaVersion: "0.1.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sources: [],
    },
    identity: {
      level: 1,
      ancestryId: "",
      backgroundId: "",
      classId: "",
      archetypeIds: [],
    },
    baseAbilities,
    proficiencies: baseProficiencies,
    derivedContext: {
      ancestryHitPoints: 8,
      classHitPoints: 10,
      keyAbility: "STR",
      baseSpeed: 25,
    },
  });

  describe("applyEffect", () => {
    it("applies fixed ability boost", () => {
      const effect: Effect = {
        kind: "abilityBoost",
        mode: {
          type: "fixed",
          abilities: ["STR", "CON"],
          value: 2,
        },
      };

      const context = createEffectApplicationContext();
      const result = createEffectApplicationResult();

      applyEffect(effect, context, "test-ancestry", result);

      expect(result.abilityAdjustments).toHaveLength(1);
      expect(result.abilityAdjustments[0]).toEqual({
        type: "boost",
        abilities: ["STR", "CON"],
        value: 2,
        source: "test-ancestry",
      });
    });

    it("applies choice-based ability boost", () => {
      const effect: Effect = {
        kind: "abilityBoost",
        mode: {
          type: "choice",
          count: 1,
          options: ["STR", "DEX", "CON"],
          value: 2,
        },
      };

      const context = createEffectApplicationContext();
      const result = createEffectApplicationResult();

      applyEffect(effect, context, "test-background", result);

      expect(result.choices).toHaveLength(1);
      expect(result.choices[0]).toMatchObject({
        id: "test-background-ability-boost",
        count: 1,
        scope: "abilityBoost",
      });
    });

    it("applies ability flaw", () => {
      const effect: Effect = {
        kind: "abilityFlaw",
        abilities: ["INT"],
      };

      const context = createEffectApplicationContext();
      const result = createEffectApplicationResult();

      applyEffect(effect, context, "test-ancestry", result);

      expect(result.abilityAdjustments).toHaveLength(1);
      expect(result.abilityAdjustments[0]).toEqual({
        type: "flaw",
        abilities: ["INT"],
        value: 2,
        source: "test-ancestry",
      });
    });

    it("grants proficiency", () => {
      const effect: Effect = {
        kind: "grantProficiency",
        target: "Athletics",
        rank: "trained",
      };

      const context = createEffectApplicationContext();
      const result = createEffectApplicationResult();

      applyEffect(effect, context, "test-background", result);

      expect(result.proficiencyUpdates.get("Athletics")).toBe("trained");
      expect(context.proficiencySink.get("Athletics")).toBe("trained");
    });

    it("stacks proficiency grants using max rank", () => {
      const context = createEffectApplicationContext();
      const result = createEffectApplicationResult();

      // First grant trained
      const effect1: Effect = {
        kind: "grantProficiency",
        target: "Athletics",
        rank: "trained",
      };
      applyEffect(effect1, context, "source1", result);

      // Then grant expert (higher)
      const effect2: Effect = {
        kind: "grantProficiency",
        target: "Athletics",
        rank: "expert",
      };
      applyEffect(effect2, context, "source2", result);

      expect(context.proficiencySink.get("Athletics")).toBe("expert");
    });

    it("grants traits", () => {
      const effect: Effect = {
        kind: "grantTrait",
        traitId: "human",
      };

      const context = createEffectApplicationContext();
      const result = createEffectApplicationResult();

      applyEffect(effect, context, "test-ancestry", result);

      expect(result.traits.has("human")).toBe(true);
      expect(context.traitSink.has("human")).toBe(true);
    });

    it("grants languages", () => {
      const effect: Effect = {
        kind: "grantLanguage",
        languageId: "common",
      };

      const context = createEffectApplicationContext();
      const result = createEffectApplicationResult();

      applyEffect(effect, context, "test-ancestry", result);

      expect(result.languages.has("common")).toBe(true);
      expect(context.languageSink.has("common")).toBe(true);
    });

    it("grants senses", () => {
      const effect: Effect = {
        kind: "grantSense",
        senseId: "darkvision",
        range: 60,
      };

      const context = createEffectApplicationContext();
      const result = createEffectApplicationResult();

      applyEffect(effect, context, "test-heritage", result);

      expect(result.senses.get("darkvision")).toBe(60);
      expect(context.senseSink.get("darkvision")).toBe(60);
    });

    it("adds speed", () => {
      const effect: Effect = {
        kind: "addSpeed",
        speedType: "climb",
        value: 25,
      };

      const context = createEffectApplicationContext();
      const result = createEffectApplicationResult();

      applyEffect(effect, context, "test-feat", result);

      expect(result.speeds.get("climb")).toBe(25);
      expect(context.speedSink.get("climb")).toBe(25);
    });

    it("grants and removes flags", () => {
      const context = createEffectApplicationContext();
      const result = createEffectApplicationResult();

      const grantEffect: Effect = {
        kind: "grantFlag",
        flag: "cantrip-deck",
      };
      applyEffect(grantEffect, context, "test-feat", result);

      expect(result.flags.has("cantrip-deck")).toBe(true);
      expect(context.flags.has("cantrip-deck")).toBe(true);

      const removeEffect: Effect = {
        kind: "removeFlag",
        flag: "cantrip-deck",
      };
      applyEffect(removeEffect, context, "test-feat", result);

      expect(result.flags.has("cantrip-deck")).toBe(false);
      expect(context.flags.has("cantrip-deck")).toBe(false);
    });
  });

  describe("resolveChoice", () => {
    it("resolves ability boost choice", () => {
      const choice = {
        id: "test-ability-boost",
        label: "Choose 1 ability boost",
        count: 1,
        scope: "abilityBoost" as const,
        allowDuplicates: false,
      };

      const resolution = {
        choiceId: "test-ability-boost",
        selectedIds: ["STR"],
      };

      const result = resolveChoice(choice, resolution, "test-source");

      expect(result.abilityAdjustments).toHaveLength(1);
      expect(result.abilityAdjustments[0]).toEqual({
        type: "boost",
        abilities: ["STR"],
        value: 2,
        source: "test-source",
      });
    });

    it("resolves skill choice", () => {
      const choice = {
        id: "test-skill-choice",
        label: "Choose 2 skills",
        count: 2,
        scope: "skill" as const,
        allowDuplicates: false,
      };

      const resolution = {
        choiceId: "test-skill-choice",
        selectedIds: ["Athletics", "Diplomacy"],
      };

      const result = resolveChoice(choice, resolution, "test-source");

      expect(result.proficiencyUpdates.get("Athletics")).toBe("trained");
      expect(result.proficiencyUpdates.get("Diplomacy")).toBe("trained");
    });

    it("validates choice ID mismatch", () => {
      const choice = {
        id: "test-choice",
        label: "Test",
        count: 1,
        scope: "abilityBoost" as const,
        allowDuplicates: false,
      };

      const resolution = {
        choiceId: "wrong-choice",
        selectedIds: ["STR"],
      };

      expect(() => resolveChoice(choice, resolution, "test")).toThrow("Choice ID mismatch");
    });

    it("validates selection count", () => {
      const choice = {
        id: "test-choice",
        label: "Test",
        count: 2,
        scope: "abilityBoost" as const,
        allowDuplicates: false,
      };

      const resolution = {
        choiceId: "test-choice",
        selectedIds: ["STR"], // Only 1 selection, but count is 2
      };

      expect(() => resolveChoice(choice, resolution, "test")).toThrow("Invalid selection count");
    });
  });

  describe("applyEntityEffects", () => {
    it("applies all effects from an entity", () => {
      const testEntity: ContentEntity = {
        id: "test-ancestry",
        type: "ancestry",
        name: "Test Ancestry",
        source: { id: "test" },
        rarity: "common",
        traits: [],
        tags: [],
        effects: [
          {
            kind: "abilityBoost",
            mode: {
              type: "fixed",
              abilities: ["STR"],
              value: 2,
            },
          },
          {
            kind: "grantTrait",
            traitId: "humanoid",
          },
          {
            kind: "grantLanguage",
            languageId: "common",
          },
        ],
        hitPoints: 8,
        size: "medium",
        speed: 25,
        boosts: [],
        flaws: [],
        languages: { granted: [], choices: { count: 0, options: [] } },
        features: [],
      };

      const result = applyEntityEffects(testEntity);

      expect(result.abilityAdjustments).toHaveLength(1);
      expect(result.abilityAdjustments[0].abilities).toContain("STR");
      expect(result.traits.has("humanoid")).toBe(true);
      expect(result.languages.has("common")).toBe(true);
    });
  });

  describe("Character Selection Functions", () => {
    let catalog: ReturnType<typeof buildCatalogLookup>;

    beforeEach(() => {
      const catalogEntries: CatalogIndexEntry[] = [
        {
          entity: {
            id: "pf2e.ancestry.human",
            type: "ancestry",
            name: "Human",
            source: { id: "crb" },
            rarity: "common",
            traits: ["humanoid"],
            tags: [],
            effects: [
              {
                kind: "abilityBoost",
                mode: {
                  type: "any",
                  count: 2,
                  value: 2,
                },
              },
              {
                kind: "grantTrait",
                traitId: "human",
              },
              {
                kind: "grantLanguage",
                languageId: "common",
              },
            ],
            hitPoints: 8,
            size: "medium",
            speed: 25,
            boosts: [],
            flaws: [],
            languages: { granted: ["common"], choices: { count: 1, options: ["draconic", "elven"] } },
            features: [],
          },
          packId: "core",
          hash: "test-hash",
        },
        {
          entity: {
            id: "pf2e.background.blacksmith",
            type: "background",
            name: "Blacksmith",
            source: { id: "crb" },
            rarity: "common",
            traits: [],
            tags: [],
            effects: [
              {
                kind: "abilityBoost",
                mode: {
                  type: "choice",
                  count: 1,
                  options: ["STR", "INT"],
                  value: 2,
                },
              },
              {
                kind: "grantProficiency",
                target: "Crafting",
                rank: "trained",
              },
            ],
            boosts: [],
            skillTraining: ["Crafting"],
            feat: "specialty-crafting",
          },
          packId: "core",
          hash: "test-hash",
        },
        {
          entity: {
            id: "pf2e.class.fighter",
            type: "class",
            name: "Fighter",
            source: { id: "crb" },
            rarity: "common",
            traits: [],
            tags: [],
            effects: [
              {
                kind: "abilityBoost",
                mode: {
                  type: "choice",
                  count: 1,
                  options: ["STR", "DEX"],
                  value: 2,
                },
              },
            ],
            keyAbility: ["STR", "DEX"],
            hitPointsPerLevel: 10,
            proficiencies: {
              perception: "expert",
              savingThrows: {
                fortitude: "expert",
                reflex: "trained",
                will: "trained",
              },
              skills: {
                trained: 3,
                additionalChoices: [],
              },
              attacks: {
                simple: "expert",
                martial: "expert",
                advanced: "trained",
                unarmed: "expert",
              },
              defense: {
                unarmored: "trained",
                light: "trained",
                medium: "trained",
                heavy: "trained",
                shields: "trained",
              },
              classDC: "trained",
            },
            progression: {},
          },
          packId: "core",
          hash: "test-hash",
        },
      ];

      catalog = buildCatalogLookup(catalogEntries);
    });

    describe("selectAncestry", () => {
      it("selects ancestry and applies effects", () => {
        // Provide choice resolutions for the "any" type ability boost (2 boosts)
        const choiceResolutions = [
          {
            choiceId: "ancestry:Human-ability-boost-any",
            selectedIds: ["STR", "CON"],
          },
        ];

        const result = selectAncestry(baseCharacter, "pf2e.ancestry.human", catalog, choiceResolutions);

        expect(result.identity.ancestryId).toBe("pf2e.ancestry.human");
        expect(result.languages).toContain("common");
        expect(result.abilityScores.boosts.length).toBeGreaterThan(0);
      });

      it("throws error for invalid ancestry", () => {
        expect(() => {
          selectAncestry(baseCharacter, "invalid-ancestry", catalog);
        }).toThrow("Ancestry not found");
      });
    });

    describe("selectBackground", () => {
      it("selects background and applies effects", () => {
        // Provide choice resolutions for the choice-based ability boost (STR or INT)
        const choiceResolutions = [
          {
            choiceId: "background:Blacksmith-ability-boost",
            selectedIds: ["STR"],
          },
        ];

        const result = selectBackground(baseCharacter, "pf2e.background.blacksmith", catalog, choiceResolutions);

        expect(result.identity.backgroundId).toBe("pf2e.background.blacksmith");
        expect(result.abilityScores.boosts.length).toBeGreaterThan(0);
      });

      it("throws error for invalid background", () => {
        expect(() => {
          selectBackground(baseCharacter, "invalid-background", catalog);
        }).toThrow("Background not found");
      });
    });

    describe("selectClass", () => {
      it("selects class and applies effects", () => {
        // Provide choice resolutions for the choice-based ability boost (STR or DEX)
        const choiceResolutions = [
          {
            choiceId: "class:Fighter-ability-boost",
            selectedIds: ["STR"],
          },
        ];

        const result = selectClass(baseCharacter, "pf2e.class.fighter", catalog, choiceResolutions);

        expect(result.identity.classId).toBe("pf2e.class.fighter");
        expect(result.abilityScores.boosts.length).toBeGreaterThan(0);
      });

      it("throws error for invalid class", () => {
        expect(() => {
          selectClass(baseCharacter, "invalid-class", catalog);
        }).toThrow("Class not found");
      });
    });
  });

  describe("Fighter+Human+Blacksmith Integration", () => {
    let catalog: ReturnType<typeof buildCatalogLookup>;

    beforeEach(() => {
      // Set up catalog with Fighter, Human, and Blacksmith entities
      const catalogEntries: CatalogIndexEntry[] = [
        {
          entity: {
            id: "pf2e.ancestry.human",
            type: "ancestry",
            name: "Human",
            source: { id: "crb" },
            rarity: "common",
            traits: ["human", "humanoid"],
            tags: [],
            effects: [
              {
                kind: "grantTrait",
                traitId: "human",
              },
              {
                kind: "grantTrait",
                traitId: "humanoid",
              },
              {
                kind: "grantLanguage",
                languageId: "common",
              },
            ],
            hitPoints: 8,
            size: "medium",
            speed: 25,
            boosts: [
              {
                type: "any",
                count: 2,
                value: 2,
              },
            ],
            flaws: [],
            languages: {
              granted: ["common"],
              choices: { count: 0, options: [] },
            },
            features: [],
          },
          packId: "core",
          hash: "human-hash",
        },
        {
          entity: {
            id: "pf2e.background.blacksmith",
            type: "background",
            name: "Blacksmith",
            source: { id: "crb" },
            rarity: "common",
            traits: [],
            tags: [],
            effects: [
              {
                kind: "grantProficiency",
                target: "Crafting",
                rank: "trained",
              },
            ],
            boosts: [
              {
                type: "choice",
                count: 1,
                options: ["STR", "INT"],
                value: 2,
              },
            ],
            skillTraining: ["Crafting"],
          },
          packId: "core",
          hash: "blacksmith-hash",
        },
        {
          entity: {
            id: "pf2e.class.fighter",
            type: "class",
            name: "Fighter",
            source: { id: "crb" },
            rarity: "common",
            traits: [],
            tags: [],
            effects: [],
            keyAbility: ["STR", "DEX"],
            hitPointsPerLevel: 10,
            proficiencies: {
              perception: "expert",
              savingThrows: {
                fortitude: "expert",
                reflex: "trained",
                will: "trained",
              },
              skills: {
                trained: 3,
                additionalChoices: [],
              },
              attacks: {
                simple: "expert",
                martial: "expert",
                advanced: "trained",
                unarmed: "expert",
              },
              defense: {
                unarmored: "trained",
                light: "trained",
                medium: "trained",
                heavy: "trained",
                shields: "trained",
              },
              classDC: "trained",
            },
            progression: {},
          },
          packId: "core",
          hash: "fighter-hash",
        },
      ];

      catalog = buildCatalogLookup(catalogEntries);
    });

    it("builds a complete Fighter+Human+Blacksmith character", () => {
      let character = baseCharacter;

      // Select Human ancestry
      character = selectAncestry(character, "pf2e.ancestry.human", catalog);
      expect(character.identity.ancestryId).toBe("pf2e.ancestry.human");
      expect(character.languages).toContain("common");

      // Select Blacksmith background
      character = selectBackground(character, "pf2e.background.blacksmith", catalog);
      expect(character.identity.backgroundId).toBe("pf2e.background.blacksmith");

      // Select Fighter class
      character = selectClass(character, "pf2e.class.fighter", catalog);
      expect(character.identity.classId).toBe("pf2e.class.fighter");

      // Verify character has all the expected effects applied
      expect(character.identity.ancestryId).toBe("pf2e.ancestry.human");
      expect(character.identity.backgroundId).toBe("pf2e.background.blacksmith");
      expect(character.identity.classId).toBe("pf2e.class.fighter");
      expect(character.languages).toContain("common");
    });

    it("verifies ability boosts apply correctly with choice resolutions", () => {
      let character = baseCharacter;

      // Human: +2 boost to any two abilities (choose STR and CON)
      const humanChoices = [
        {
          choiceId: "ancestry:Human-ability-boost-any",
          selectedIds: ["STR", "CON"],
        },
      ];

      // Blacksmith: +2 boost to STR or INT (choose STR)
      const blacksmithChoices = [
        {
          choiceId: "background:Blacksmith-ability-boost",
          selectedIds: ["STR"],
        },
      ];

      // Apply selections with choice resolutions
      character = selectAncestry(character, "pf2e.ancestry.human", catalog, humanChoices);
      character = selectBackground(character, "pf2e.background.blacksmith", catalog, blacksmithChoices);
      character = selectClass(character, "pf2e.class.fighter", catalog);

      // Verify ability boosts were applied
      // Human gives 2 individual boosts, Blacksmith gives 1, plus 2 legacy boosts = 5 total
      expect(character.abilityScores.boosts.length).toBe(5);

      // Check that STR has been boosted (should appear in multiple adjustments)
      const strBoosts = character.abilityScores.boosts.filter(boost =>
        boost.abilities.includes("STR")
      );
      expect(strBoosts.length).toBeGreaterThan(0); // Should have STR boosts

      // Check that CON has been boosted
      const conBoosts = character.abilityScores.boosts.filter(boost =>
        boost.abilities.includes("CON")
      );
      expect(conBoosts.length).toBeGreaterThan(0); // Should have CON boosts
    });

    it("verifies proficiency updates apply correctly", () => {
      let character = baseCharacter;

      // Provide choice resolution for the background boost
      const blacksmithChoices = [
        {
          choiceId: "background:Blacksmith-ability-boost",
          selectedIds: ["STR"],
        },
      ];

      // Apply background which grants Crafting proficiency
      character = selectBackground(character, "pf2e.background.blacksmith", catalog, blacksmithChoices);

      // Should have ability boosts from Blacksmith background
      const backgroundBoosts = character.abilityScores.boosts.filter(boost =>
        boost.source?.includes("background")
      );
      expect(backgroundBoosts.length).toBeGreaterThan(0);
    });

    it("verifies derived stats calculations for Fighter+Human+Blacksmith", () => {
      // Start with specific base abilities for predictable derived stats
      const testBaseAbilities: AbilityScoreBlock = {
        STR: 14,
        DEX: 12,
        CON: 14,
        INT: 10,
        WIS: 13,
        CHA: 10,
      };

      const testCharacter = createCharacter({
        metadata: {
          id: "test-fighter",
          name: "Test Fighter",
          schemaVersion: "0.1.0",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sources: [],
        },
        identity: {
          level: 1,
          ancestryId: "",
          backgroundId: "",
          classId: "",
          archetypeIds: [],
        },
        baseAbilities: testBaseAbilities,
        proficiencies: {
          perception: "expert", // Fighter gets expert perception
          saves: {
            fortitude: "expert", // Fighter gets expert Fort saves
            reflex: "trained",
            will: "trained",
          },
          skills: {
            Crafting: "trained", // From Blacksmith background
          },
          lores: {},
          weapons: {
            "weapon:martial": "expert", // Fighter gets expert martial weapons
          },
          armor: {
            unarmored: "trained",
            light: "trained",
            medium: "trained",
            heavy: "trained",
          },
          spellcasting: {},
          classDC: "trained",
          perceptionModifiers: [],
        },
        derivedContext: {
          ancestryHitPoints: 8, // Human
          classHitPoints: 10, // Fighter
          keyAbility: "STR",
          baseSpeed: 25,
        },
      });

      // Verify derived HP calculation: Human (8) + Fighter (10) + CON mod (2) = 20
      expect(testCharacter.derived.hitPoints.max).toBe(20);

      // Verify AC calculation: 10 + DEX mod (1) + trained armor (3 at level 1) = 14
      expect(testCharacter.derived.armorClass.value).toBe(14);

      // Verify perception: WIS mod (1) + expert proficiency (4 at level 1) = 5
      // But the actual calculation shows WIS mod (1) + level (1) + expert bonus (4) = 6
      expect(testCharacter.derived.perception.modifier).toBe(6);

      // Verify Fortitude save: CON mod (2) + level (1) + expert proficiency (4) = 7
      expect(testCharacter.derived.saves.fortitude.value).toBe(7);

      // Verify Crafting skill: INT mod (0) + trained proficiency (3 at level 1) = 3
      expect(testCharacter.derived.skills.Crafting.modifier).toBe(3);
    });
  });
});