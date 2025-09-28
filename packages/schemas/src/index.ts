import { z } from "zod";

export const abilityIds = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;
export const proficiencyRanks = ["untrained", "trained", "expert", "master", "legendary"] as const;
export const rarities = ["common", "uncommon", "rare", "unique"] as const;
export const sizes = ["tiny", "small", "medium", "large", "huge", "gargantuan"] as const;
export const speedTypes = ["land", "burrow", "climb", "fly", "swim"] as const;
export const spellTraditions = ["arcane", "divine", "occult", "primal", "focus"] as const;
export const spellcastingTypes = ["prepared", "spontaneous", "focus", "innate"] as const;
export const modifierTypes = ["status", "item", "circumstance", "untyped"] as const;

export const abilityIdSchema = z.enum(abilityIds);
export type AbilityId = z.infer<typeof abilityIdSchema>;

export const proficiencyRankSchema = z.enum(proficiencyRanks);
export type ProficiencyRank = z.infer<typeof proficiencyRankSchema>;

export const raritySchema = z.enum(rarities);
export type Rarity = z.infer<typeof raritySchema>;

export const sizeSchema = z.enum(sizes);
export type Size = z.infer<typeof sizeSchema>;

export const speedTypeSchema = z.enum(speedTypes);
export type SpeedType = z.infer<typeof speedTypeSchema>;

export const spellTraditionSchema = z.enum(spellTraditions);
export type SpellTradition = z.infer<typeof spellTraditionSchema>;

export const spellcastingTypeSchema = z.enum(spellcastingTypes);
export type SpellcastingType = z.infer<typeof spellcastingTypeSchema>;

export const modifierTypeSchema = z.enum(modifierTypes);
export type ModifierType = z.infer<typeof modifierTypeSchema>;

export const standardSkillIds = [
  "Acrobatics",
  "Arcana",
  "Athletics",
  "Crafting",
  "Deception",
  "Diplomacy",
  "Intimidation",
  "Medicine",
  "Nature",
  "Occultism",
  "Performance",
  "Religion",
  "Society",
  "Stealth",
  "Survival",
  "Thievery",
] as const;

export const skillIdSchema = z.string().min(1);
export type SkillId = z.infer<typeof skillIdSchema>;

export const sourceReferenceSchema = z.object({
  id: z.string().min(1),
  page: z.number().int().positive().optional(),
  license: z.string().min(1).optional(),
});
export type SourceReference = z.infer<typeof sourceReferenceSchema>;

export const versionSchema = z.object({
  major: z.number().int().min(0).default(1),
  minor: z.number().int().min(0).default(0),
  patch: z.number().int().min(0).default(0),
});
export type VersionInfo = z.infer<typeof versionSchema>;

const abilityScoreBlockSchema = z.object({
  STR: z.number().int(),
  DEX: z.number().int(),
  CON: z.number().int(),
  INT: z.number().int(),
  WIS: z.number().int(),
  CHA: z.number().int(),
});
export type AbilityScoreBlock = z.infer<typeof abilityScoreBlockSchema>;

const abilityAdjustmentLogSchema = z.object({
  type: z.enum(["boost", "flaw"]),
  abilities: z.array(abilityIdSchema).min(1),
  value: z.number().int(),
  source: z.string().min(1),
  level: z.number().int().min(0).max(20).optional(),
});
export type AbilityAdjustmentLogEntry = z.infer<typeof abilityAdjustmentLogSchema>;

const modifierBreakdownSchema = z.object({
  type: modifierTypeSchema,
  label: z.string().min(1),
  value: z.number(),
  source: z.string().min(1),
});
export type ModifierBreakdown = z.infer<typeof modifierBreakdownSchema>;

export const predicateSchema: z.ZodType<any> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("all"),
      predicates: z.array(predicateSchema).min(1),
    }),
    z.object({
      type: z.literal("any"),
      predicates: z.array(predicateSchema).min(1),
    }),
    z.object({
      type: z.literal("not"),
      predicate: predicateSchema,
    }),
    z.object({
      type: z.literal("minLevel"),
      level: z.number().int().min(1).max(20),
    }),
    z.object({
      type: z.literal("hasTrait"),
      trait: z.string().min(1),
    }),
    z.object({
      type: z.literal("hasFeat"),
      featId: z.string().min(1),
    }),
    z.object({
      type: z.literal("hasAncestry"),
      ancestryId: z.string().min(1),
    }),
    z.object({
      type: z.literal("hasHeritage"),
      heritageId: z.string().min(1),
    }),
    z.object({
      type: z.literal("hasBackground"),
      backgroundId: z.string().min(1),
    }),
    z.object({
      type: z.literal("hasClass"),
      classId: z.string().min(1),
    }),
    z.object({
      type: z.literal("hasArchetype"),
      archetypeId: z.string().min(1),
    }),
    z.object({
      type: z.literal("hasSkillRank"),
      skillId: z.string().min(1),
      rank: proficiencyRankSchema,
    }),
    z.object({
      type: z.literal("proficiencyAtLeast"),
      target: z.string().min(1),
      rank: proficiencyRankSchema,
    }),
    z.object({
      type: z.literal("hasSpell"),
      spellId: z.string().min(1),
    }),
    z.object({
      type: z.literal("hasFlag"),
      flag: z.string().min(1),
    }),
    z.object({
      type: z.literal("abilityAtLeast"),
      ability: abilityIdSchema,
      score: z.number().int(),
    }),
  ])
);
export type PredicateNode = z.infer<typeof predicateSchema>;

const abilityBoostModeSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("fixed"),
    abilities: z.array(abilityIdSchema).min(1),
    value: z.number().int().default(2),
  }),
  z.object({
    type: z.literal("choice"),
    count: z.number().int().min(1),
    options: z.array(abilityIdSchema).min(1),
    value: z.number().int().default(2),
  }),
  z.object({
    type: z.literal("any"),
    count: z.number().int().min(1),
    value: z.number().int().default(2),
  }),
]);
export type AbilityBoostMode = z.infer<typeof abilityBoostModeSchema>;

const choiceScopeSchema = z.enum([
  "skill",
  "skillFeat",
  "classFeat",
  "generalFeat",
  "ancestryFeat",
  "classFeature",
  "spell",
  "abilityBoost",
  "proficiency",
  "language",
]);
export type ChoiceScope = z.infer<typeof choiceScopeSchema>;

const choiceDefinitionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  count: z.number().int().positive().default(1),
  scope: choiceScopeSchema,
  filter: predicateSchema.optional(),
  allowDuplicates: z.boolean().default(false),
});
export type ChoiceDefinition = z.infer<typeof choiceDefinitionSchema>;

export const effectSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("grantFeat"),
    featId: z.string().min(1),
    level: z.number().int().min(1).max(20).optional(),
    required: z.boolean().default(false),
  }),
  z.object({
    kind: z.literal("grantProficiency"),
    target: z.string().min(1),
    rank: proficiencyRankSchema,
  }),
  z.object({
    kind: z.literal("setProficiency"),
    target: z.string().min(1),
    rank: proficiencyRankSchema,
  }),
  z.object({
    kind: z.literal("abilityBoost"),
    mode: abilityBoostModeSchema,
  }),
  z.object({
    kind: z.literal("abilityFlaw"),
    abilities: z.array(abilityIdSchema).min(1),
  }),
  z.object({
    kind: z.literal("addModifier"),
    target: z.string().min(1),
    modifierType: modifierTypeSchema,
    value: z.number(),
    label: z.string().min(1),
    stacking: z.enum(["max", "stack"]).default("max"),
  }),
  z.object({
    kind: z.literal("grantTrait"),
    traitId: z.string().min(1),
  }),
  z.object({
    kind: z.literal("grantLanguage"),
    languageId: z.string().min(1),
  }),
  z.object({
    kind: z.literal("grantSense"),
    senseId: z.string().min(1),
    range: z.number().int().positive().optional(),
  }),
  z.object({
    kind: z.literal("grantChoice"),
    choice: choiceDefinitionSchema,
  }),
  z.object({
    kind: z.literal("addSpeed"),
    speedType: speedTypeSchema,
    value: z.number().int().positive(),
  }),
  z.object({
    kind: z.literal("grantSpell"),
    spellId: z.string().min(1),
    tradition: spellTraditionSchema.optional(),
    rank: z.number().int().min(0).max(10).optional(),
  }),
  z.object({
    kind: z.literal("grantSpellSlot"),
    rank: z.number().int().min(0).max(10),
    count: z.number().int().positive(),
  }),
  z.object({
    kind: z.literal("modifyResource"),
    resource: z.enum(["focusPoints", "hitPoints", "resolve", "classDc", "heroPoints"]),
    value: z.number().int(),
  }),
  z.object({
    kind: z.literal("grantFlag"),
    flag: z.string().min(1),
  }),
  z.object({
    kind: z.literal("removeFlag"),
    flag: z.string().min(1),
  }),
]);
export type Effect = z.infer<typeof effectSchema>;

const entityBaseSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  slug: z.string().min(1).optional(),
  name: z.string().min(1),
  summary: z.string().optional(),
  description: z.string().optional(),
  source: sourceReferenceSchema,
  version: versionSchema.optional(),
  rarity: raritySchema.default("common"),
  traits: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).default([]),
  prerequisites: predicateSchema.optional(),
  effects: z.array(effectSchema).default([]),
});
export type EntityBase = z.infer<typeof entityBaseSchema>;

const abilityBoostSetSchema = z.array(abilityBoostModeSchema).default([]);

export const ancestrySchema = entityBaseSchema.extend({
  type: z.literal("ancestry"),
  hitPoints: z.number().int().positive(),
  size: sizeSchema,
  speed: z.number().int().positive(),
  boosts: abilityBoostSetSchema,
  flaws: z.array(abilityIdSchema).default([]),
  languages: z.object({
    granted: z.array(z.string().min(1)).default([]),
    choices: z.object({
      count: z.number().int().min(0).default(0),
      options: z.array(z.string().min(1)).default([]),
    }).default({ count: 0, options: [] }),
  }).default({ granted: [], choices: { count: 0, options: [] } }),
  features: z.array(z.string().min(1)).default([]),
});
export type Ancestry = z.infer<typeof ancestrySchema>;

export const heritageSchema = entityBaseSchema.extend({
  type: z.literal("heritage"),
  ancestryId: z.string().min(1),
});
export type Heritage = z.infer<typeof heritageSchema>;

export const backgroundSchema = entityBaseSchema.extend({
  type: z.literal("background"),
  boosts: abilityBoostSetSchema,
  skillTraining: z.array(skillIdSchema).max(2).default([]),
  feat: z.string().min(1).optional(),
});
export type Background = z.infer<typeof backgroundSchema>;

const classProficiencySchema = z.object({
  perception: proficiencyRankSchema,
  savingThrows: z.object({
    fortitude: proficiencyRankSchema,
    reflex: proficiencyRankSchema,
    will: proficiencyRankSchema,
  }),
  skills: z.object({
    trained: z.number().int().min(0).default(0),
    additionalChoices: z.array(skillIdSchema).default([]),
  }),
  attacks: z.object({
    simple: proficiencyRankSchema.optional(),
    martial: proficiencyRankSchema.optional(),
    advanced: proficiencyRankSchema.optional(),
    unarmed: proficiencyRankSchema.optional(),
  }).default({}),
  defense: z.object({
    unarmored: proficiencyRankSchema.optional(),
    light: proficiencyRankSchema.optional(),
    medium: proficiencyRankSchema.optional(),
    heavy: proficiencyRankSchema.optional(),
    shields: proficiencyRankSchema.optional(),
  }).default({}),
  classDC: proficiencyRankSchema.optional(),
});
export type ClassProficiencies = z.infer<typeof classProficiencySchema>;

const proficiencyBumpSchema = z.object({
  target: z.string().min(1),
  rank: proficiencyRankSchema,
});

const classLevelSchema = z.object({
  grants: z.array(effectSchema).default([]),
  choices: z.array(choiceDefinitionSchema).default([]),
  proficiencyBumps: z.array(proficiencyBumpSchema).default([]),
  featureRefs: z.array(z.string().min(1)).default([]),
});

const levelKeySchema = z
  .string()
  .regex(/^(?:[1-9]|1[0-9]|20)$/);

const classProgressionSchema = z.record(levelKeySchema, classLevelSchema);
export type ClassProgression = z.infer<typeof classProgressionSchema>;

export const classSchema = entityBaseSchema.extend({
  type: z.literal("class"),
  keyAbility: z.array(abilityIdSchema).min(1),
  hitPointsPerLevel: z.number().int().positive(),
  proficiencies: classProficiencySchema,
  progression: classProgressionSchema,
  spellcasting: z
    .object({
      tradition: spellTraditionSchema.optional(),
      type: spellcastingTypeSchema.optional(),
    })
    .optional(),
});
export type ClassEntity = z.infer<typeof classSchema>;

export const archetypeSchema = entityBaseSchema.extend({
  type: z.literal("archetype"),
  dedicationFeatId: z.string().min(1),
});
export type Archetype = z.infer<typeof archetypeSchema>;

export const featCategorySchema = z.enum([
  "ancestry",
  "class",
  "skill",
  "general",
  "archetype",
]);
export type FeatCategory = z.infer<typeof featCategorySchema>;

export const actionCostSchema = z.object({
  type: z.enum(["one", "two", "three", "free", "reaction", "varies"]).optional(),
  trait: z.string().min(1).optional(),
});

export const featSchema = entityBaseSchema.extend({
  type: z.literal("feat"),
  level: z.number().int().min(1).max(20),
  category: featCategorySchema,
  actionCost: actionCostSchema.optional(),
});
export type Feat = z.infer<typeof featSchema>;

export const spellSchema = entityBaseSchema.extend({
  type: z.literal("spell"),
  rank: z.number().int().min(0).max(10),
  traditions: z.array(spellTraditionSchema).default([]),
  traits: z.array(z.string().min(1)).default([]),
  duration: z.string().optional(),
  range: z.string().optional(),
  targets: z.string().optional(),
  savingThrow: z.string().optional(),
});
export type Spell = z.infer<typeof spellSchema>;

export const itemSchema = entityBaseSchema.extend({
  type: z.literal("item"),
  level: z.number().int().min(0).max(20),
  price: z.string().optional(),
  bulk: z.string().optional(),
  traits: z.array(z.string().min(1)).default([]),
});
export type Item = z.infer<typeof itemSchema>;

export const conditionSchema = entityBaseSchema.extend({
  type: z.literal("condition"),
  levels: z.array(z.number().int().min(1)).default([]),
});
export type Condition = z.infer<typeof conditionSchema>;

export const rulesEntrySchema = entityBaseSchema.extend({
  type: z.literal("rule"),
  category: z.string().min(1),
});
export type RuleEntry = z.infer<typeof rulesEntrySchema>;

export const contentEntitySchema = z.discriminatedUnion("type", [
  ancestrySchema,
  heritageSchema,
  backgroundSchema,
  classSchema,
  archetypeSchema,
  featSchema,
  spellSchema,
  itemSchema,
  conditionSchema,
  rulesEntrySchema,
]);
export type ContentEntity = z.infer<typeof contentEntitySchema>;

const proficiencySummarySchema = z.object({
  perception: proficiencyRankSchema,
  saves: z.object({
    fortitude: proficiencyRankSchema,
    reflex: proficiencyRankSchema,
    will: proficiencyRankSchema,
  }),
  skills: z.record(z.string().min(1), proficiencyRankSchema),
  lores: z.record(z.string().min(1), proficiencyRankSchema).default({}),
  weapons: z.record(z.string().min(1), proficiencyRankSchema),
  armor: z.record(z.string().min(1), proficiencyRankSchema),
  spellcasting: z.record(z.string().min(1), proficiencyRankSchema).default({}),
  classDC: proficiencyRankSchema,
  perceptionModifiers: z.array(modifierBreakdownSchema).default([]),
});
export type ProficiencySummary = z.infer<typeof proficiencySummarySchema>;

const characterFeatSelectionSchema = z.object({
  id: z.string().min(1),
  grantedBy: z.string().min(1),
  level: z.number().int().min(1).max(20),
  replaced: z.boolean().default(false),
  choices: z.record(z.string().min(1), z.unknown()).default({}),
});
export type CharacterFeatSelection = z.infer<typeof characterFeatSelectionSchema>;

const characterSpellSchema = z.object({
  id: z.string().min(1),
  rank: z.number().int().min(0).max(10),
  prepared: z.boolean().default(false),
  slots: z.number().int().min(0).default(0),
});
export type CharacterSpell = z.infer<typeof characterSpellSchema>;

const spellSlotMapSchema = z.record(
  z.string().regex(/^([0-9]|10)$/),
  z.number().int().min(0)
);

const characterSpellcastingEntrySchema = z.object({
  id: z.string().min(1),
  tradition: spellTraditionSchema,
  castingType: spellcastingTypeSchema,
  ability: abilityIdSchema,
  focusPoints: z.number().int().min(0).default(0),
  maxFocusPoints: z.number().int().min(0).default(0),
  dc: z.number().int().min(0).optional(),
  attack: z.number().int().optional(),
  slots: spellSlotMapSchema.default({}),
  spells: z.array(characterSpellSchema).default([]),
});
export type CharacterSpellcastingEntry = z.infer<typeof characterSpellcastingEntrySchema>;

const characterItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  sourceId: z.string().min(1).optional(),
  quantity: z.number().int().min(0).default(1),
  bulk: z.union([z.string(), z.number()]).optional(),
  invested: z.boolean().optional(),
  notes: z.string().optional(),
  runes: z.array(z.string().min(1)).default([]),
  containerId: z.string().min(1).optional(),
  metadata: z.record(z.string().min(1), z.unknown()).default({}),
});
export type CharacterItem = z.infer<typeof characterItemSchema>;

const defenseStatsSchema = z.object({
  value: z.number().int().min(0),
  breakdown: z.array(modifierBreakdownSchema).default([]),
});

const skillStatsSchema = z.object({
  modifier: z.number().int(),
  rank: proficiencyRankSchema,
  breakdown: z.array(modifierBreakdownSchema).default([]),
});

const attackProfileSchema = z.object({
  label: z.string().min(1),
  weaponId: z.string().min(1).optional(),
  attackBonus: z.number().int(),
  damage: z.string().min(1),
  traits: z.array(z.string().min(1)).default([]),
});

const resistanceSchema = z.object({
  type: z.string().min(1),
  value: z.number().int().min(0),
  notes: z.string().optional(),
});

const derivedStatsSchema = z.object({
  hitPoints: z.object({
    max: z.number().int().min(0),
    current: z.number().int().min(0),
    temporary: z.number().int().min(0).default(0),
  }),
  armorClass: defenseStatsSchema,
  classDC: defenseStatsSchema.optional(),
  perception: z.object({
    modifier: z.number().int(),
    rank: proficiencyRankSchema,
    breakdown: z.array(modifierBreakdownSchema).default([]),
  }),
  saves: z.object({
    fortitude: defenseStatsSchema,
    reflex: defenseStatsSchema,
    will: defenseStatsSchema,
  }),
  skills: z.record(z.string().min(1), skillStatsSchema),
  speeds: z.record(speedTypeSchema, z.number().int().min(0)).default({}),
  attacks: z.array(attackProfileSchema).default([]),
  resistances: z.array(resistanceSchema).default([]),
  weaknesses: z.array(resistanceSchema).default([]),
  immunities: z.array(z.string().min(1)).default([]),
});
export type DerivedStats = z.infer<typeof derivedStatsSchema>;

const historyOperationSchema = z.object({
  type: z.string().min(1),
  payload: z.record(z.string().min(1), z.unknown()).default({}),
});

const historyEntrySchema = z.object({
  id: z.string().min(1),
  level: z.number().int().min(0).max(20),
  timestamp: z.string().datetime(),
  description: z.string().min(1),
  operations: z.array(historyOperationSchema).default([]),
});
export type HistoryEntry = z.infer<typeof historyEntrySchema>;

const characterMetadataSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  player: z.string().optional(),
  campaign: z.string().optional(),
  schemaVersion: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  sources: z
    .array(
      z.object({
        id: z.string().min(1),
        hash: z.string().min(1),
      })
    )
    .default([]),
});
export type CharacterMetadata = z.infer<typeof characterMetadataSchema>;

const characterIdentitySchema = z.object({
  level: z.number().int().min(1).max(20),
  ancestryId: z.string().min(1),
  heritageId: z.string().min(1).optional(),
  backgroundId: z.string().min(1),
  classId: z.string().min(1),
  archetypeIds: z.array(z.string().min(1)).default([]),
  deityId: z.string().min(1).optional(),
  alignment: z.string().optional(),
});
export type CharacterIdentity = z.infer<typeof characterIdentitySchema>;

const characterNotesSchema = z.object({
  appearance: z.string().optional(),
  backstory: z.string().optional(),
  allies: z.string().optional(),
  campaigns: z.string().optional(),
});
export type CharacterNotes = z.infer<typeof characterNotesSchema>;

export const characterSchema = z.object({
  metadata: characterMetadataSchema,
  identity: characterIdentitySchema,
  abilityScores: z.object({
    base: abilityScoreBlockSchema,
    boosts: z.array(abilityAdjustmentLogSchema).default([]),
    final: abilityScoreBlockSchema,
  }),
  proficiencies: proficiencySummarySchema,
  languages: z.array(z.string().min(1)).default([]),
  senses: z.array(z.string().min(1)).default([]),
  feats: z.array(characterFeatSelectionSchema).default([]),
  spellcasting: z.array(characterSpellcastingEntrySchema).default([]),
  equipment: z.array(characterItemSchema).default([]),
  derived: derivedStatsSchema,
  notes: characterNotesSchema.optional(),
  history: z.array(historyEntrySchema).default([]),
});
export type Character = z.infer<typeof characterSchema>;

export const catalogPackSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: versionSchema.optional(),
  license: z.string().min(1).optional(),
  description: z.string().optional(),
  includes: z.array(z.string().min(1)).default([]),
});
export type CatalogPackManifest = z.infer<typeof catalogPackSchema>;

export const catalogIndexEntrySchema = z.object({
  entity: contentEntitySchema,
  packId: z.string().min(1),
  hash: z.string().min(1),
});
export type CatalogIndexEntry = z.infer<typeof catalogIndexEntrySchema>;

export const catalogIndexSchema = z.object({
  packs: z.record(z.string().min(1), catalogPackSchema).default({}),
  entities: z.array(catalogIndexEntrySchema),
  createdAt: z.string().datetime(),
});
export type CatalogIndex = z.infer<typeof catalogIndexSchema>;

