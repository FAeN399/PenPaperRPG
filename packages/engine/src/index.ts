import type {
  AbilityAdjustmentLogEntry,
  AbilityId,
  AbilityScoreBlock,
  CatalogIndexEntry,
  Character,
  CharacterFeatSelection,
  CharacterIdentity,
  CharacterItem,
  CharacterMetadata,
  CharacterNotes,
  CharacterSpellcastingEntry,
  DerivedStats,
  HistoryEntry,
  ModifierBreakdown,
  PredicateNode,
  ProficiencySummary,
  ProficiencyRank,
  SpeedType,
} from "@pen-paper-rpg/schemas";
import {
  abilityIds,
  predicateSchema,
  proficiencyRanks,
  speedTypes,
} from "@pen-paper-rpg/schemas";

const proficiencyRankOrder: Record<ProficiencyRank, number> = {
  untrained: 0,
  trained: 1,
  expert: 2,
  master: 3,
  legendary: 4,
};

const proficiencyBonusBase: Record<ProficiencyRank, number> = {
  untrained: 0,
  trained: 2,
  expert: 4,
  master: 6,
  legendary: 8,
};

const skillAbilityMap: Record<string, AbilityId> = {
  Acrobatics: "DEX",
  Arcana: "INT",
  Athletics: "STR",
  Crafting: "INT",
  Deception: "CHA",
  Diplomacy: "CHA",
  Intimidation: "CHA",
  Medicine: "WIS",
  Nature: "WIS",
  Occultism: "INT",
  Performance: "CHA",
  Religion: "WIS",
  Society: "INT",
  Stealth: "DEX",
  Survival: "WIS",
  Thievery: "DEX",
};

const saveAbilityMap: Record<"fortitude" | "reflex" | "will", AbilityId> = {
  fortitude: "CON",
  reflex: "DEX",
  will: "WIS",
};

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function proficiencyBonus(level: number, rank: ProficiencyRank): number {
  return proficiencyBonusBase[rank] + (rank === "untrained" ? 0 : level);
}

export function maxRank(a: ProficiencyRank, b: ProficiencyRank): ProficiencyRank {
  return proficiencyRankOrder[a] >= proficiencyRankOrder[b] ? a : b;
}

export function applyAbilityAdjustments(
  base: AbilityScoreBlock,
  adjustments: AbilityAdjustmentLogEntry[],
): AbilityScoreBlock {
  const result: AbilityScoreBlock = { ...base };
  for (const adjustment of adjustments) {
    const value = Math.abs(adjustment.value);
    for (const ability of adjustment.abilities) {
      if (!(ability in result)) continue;
      const delta = adjustment.type === "boost" ? value : -value;
      result[ability as AbilityId] += delta;
    }
  }
  return result;
}

export interface PredicateContext {
  level: number;
  ancestryId?: string;
  heritageId?: string;
  backgroundId?: string;
  classId?: string;
  archetypeIds: Set<string>;
  traitIds: Set<string>;
  featIds: Set<string>;
  flags: Set<string>;
  skills: Record<string, ProficiencyRank>;
  proficiencies: Map<string, ProficiencyRank>;
  spells: Set<string>;
  abilityScores: AbilityScoreBlock;
}

export function buildPredicateContext(character: Character): PredicateContext {
  const featIds = new Set(character.feats.map((feat) => feat.id));
  const archetypeIds = new Set<string>(character.identity.archetypeIds);
  const spells = new Set(
    character.spellcasting.flatMap((entry: CharacterSpellcastingEntry) => entry.spells.map((spell) => spell.id)),
  );

  return {
    level: character.identity.level,
    ancestryId: character.identity.ancestryId,
    heritageId: character.identity.heritageId,
    backgroundId: character.identity.backgroundId,
    classId: character.identity.classId,
    archetypeIds,
    traitIds: new Set<string>(),
    featIds,
    flags: new Set<string>(),
    skills: character.proficiencies.skills,
    proficiencies: new Map([
      ...Object.entries(character.proficiencies.weapons),
      ...Object.entries(character.proficiencies.armor),
      ["perception", character.proficiencies.perception],
      ["classDC", character.proficiencies.classDC],
    ]),
    spells,
    abilityScores: character.abilityScores.final,
  };
}

export function evaluatePredicate(predicate: PredicateNode, context: PredicateContext): boolean {
  predicateSchema.parse(predicate);
  switch (predicate.type) {
    case "all":
      return predicate.predicates.every((child: PredicateNode) => evaluatePredicate(child, context));
    case "any":
      return predicate.predicates.some((child: PredicateNode) => evaluatePredicate(child, context));
    case "not":
      return !evaluatePredicate(predicate.predicate, context);
    case "minLevel":
      return context.level >= predicate.level;
    case "hasTrait":
      return context.traitIds.has(predicate.trait);
    case "hasFeat":
      return context.featIds.has(predicate.featId);
    case "hasAncestry":
      return context.ancestryId === predicate.ancestryId;
    case "hasHeritage":
      return context.heritageId === predicate.heritageId;
    case "hasBackground":
      return context.backgroundId === predicate.backgroundId;
    case "hasClass":
      return context.classId === predicate.classId;
    case "hasArchetype":
      return context.archetypeIds.has(predicate.archetypeId);
    case "hasSkillRank": {
      const skillPredicate = predicate as Extract<PredicateNode, { type: "hasSkillRank" }>;
      const current = context.skills[skillPredicate.skillId];
      if (!current) return false;
      return proficiencyRankOrder[current as ProficiencyRank] >= proficiencyRankOrder[skillPredicate.rank as ProficiencyRank];
    }
    case "proficiencyAtLeast": {
      const proficiencyPredicate = predicate as Extract<PredicateNode, { type: "proficiencyAtLeast" }>;
      const current = context.proficiencies.get(proficiencyPredicate.target);
      if (!current) return false;
      return proficiencyRankOrder[current as ProficiencyRank] >= proficiencyRankOrder[proficiencyPredicate.rank as ProficiencyRank];
    }

    case "hasSpell":
      return context.spells.has(predicate.spellId);
    case "hasFlag":
      return context.flags.has(predicate.flag);
    case "abilityAtLeast":
      return context.abilityScores[predicate.ability as AbilityId] >= predicate.score;
    default:
      return false;
  }
}

export interface DerivedModifiersInput {
  armorClass?: ModifierBreakdown[];
  classDC?: ModifierBreakdown[];
  perception?: ModifierBreakdown[];
  saves?: Partial<Record<"fortitude" | "reflex" | "will", ModifierBreakdown[]>>;
  skills?: Record<string, ModifierBreakdown[]>;
}

export interface DerivedContext {
  ancestryHitPoints: number;
  classHitPoints: number;
  keyAbility: AbilityId;
  baseSpeed: number;
  additionalHitPoints?: number;
  temporaryHitPoints?: number;
  equippedArmorCategory?: "unarmored" | "light" | "medium" | "heavy";
  modifiers?: DerivedModifiersInput;
  speeds?: Partial<Record<SpeedType, number>>;
}

export interface DerivedInput {
  level: number;
  abilityScores: AbilityScoreBlock;
  proficiencies: ProficiencySummary;
  context: DerivedContext;
}

function sumModifiers(modifiers?: ModifierBreakdown[]): number {
  if (!modifiers || modifiers.length === 0) return 0;
  return modifiers.reduce((total, mod) => total + mod.value, 0);
}

function resolveSkillAbility(skillId: string): AbilityId {
  if (skillAbilityMap[skillId]) return skillAbilityMap[skillId];
  if (skillId.toLowerCase().endsWith("lore")) return "INT";
  return "STR";
}

export function computeDerivedStats(input: DerivedInput): DerivedStats {
  const { level, abilityScores, proficiencies, context } = input;
  const abilityMods: Record<AbilityId, number> = abilityIds.reduce<Record<AbilityId, number>>(
    (acc, ability) => {
      acc[ability] = abilityModifier(abilityScores[ability]);
      return acc;
    },
    {} as Record<AbilityId, number>,
  );

  const hpBonus = abilityMods.CON * level;
  const additionalHp = context.additionalHitPoints ?? 0;
  const maxHitPoints =
    context.ancestryHitPoints + context.classHitPoints * level + hpBonus + additionalHp;
  const temporaryHitPoints = context.temporaryHitPoints ?? 0;

  const perceptionBonus =
    abilityMods.WIS +
    proficiencyBonus(level, proficiencies.perception) +
    sumModifiers(context.modifiers?.perception);

  const perception = {
    modifier: perceptionBonus,
    rank: proficiencies.perception,
    breakdown: context.modifiers?.perception ?? [],
  };

  const savesEntries = (Object.keys(saveAbilityMap) as Array<"fortitude" | "reflex" | "will">).map(
    (saveKey) => {
      const ability = saveAbilityMap[saveKey];
      const rank = proficiencies.saves[saveKey];
      const modifiers = context.modifiers?.saves?.[saveKey] ?? [];
      const modifier = abilityMods[ability] + proficiencyBonus(level, rank) + sumModifiers(modifiers);
      return [saveKey, { value: modifier, breakdown: modifiers }] as const;
    },
  );

  const skills: Record<string, { modifier: number; rank: ProficiencyRank; breakdown: ModifierBreakdown[] }> = {};
  for (const [skillId, rank] of Object.entries(proficiencies.skills)) {
    const ability = resolveSkillAbility(skillId);
    const skillModifiers = context.modifiers?.skills?.[skillId] ?? [];
    const modifier =
      abilityMods[ability] + proficiencyBonus(level, rank) + sumModifiers(skillModifiers);
    skills[skillId] = {
      modifier,
      rank,
      breakdown: skillModifiers,
    };
  }

  const armorCategory = context.equippedArmorCategory ?? "unarmored";
  const armorRank =
    proficiencies.armor[armorCategory] ?? proficiencies.armor.unarmored ?? "untrained";
  const armorClassValue =
    10 + abilityMods.DEX + proficiencyBonus(level, armorRank) + sumModifiers(context.modifiers?.armorClass);

  const classDcRank = proficiencies.classDC;
  const classDcValue =
    10 + abilityMods[context.keyAbility] + proficiencyBonus(level, classDcRank) + sumModifiers(context.modifiers?.classDC);

  const speedEntries: Array<[SpeedType, number]> = [];
  for (const type of speedTypes) {
    if (type === "land") {
      const value = typeof context.speeds?.land === "number" ? context.speeds.land : context.baseSpeed;
      speedEntries.push([type, value]);
    } else {
      const value = context.speeds?.[type];
      if (typeof value === "number") {
        speedEntries.push([type, value]);
      }
    }
  }

  return {
    hitPoints: {
      max: Math.max(0, maxHitPoints),
      current: Math.max(0, maxHitPoints),
      temporary: temporaryHitPoints,
    },
    armorClass: {
      value: armorClassValue,
      breakdown: context.modifiers?.armorClass ?? [],
    },
    classDC: {
      value: classDcValue,
      breakdown: context.modifiers?.classDC ?? [],
    },
    perception,
    saves: Object.fromEntries(savesEntries) as DerivedStats["saves"],
    skills,
    speeds: Object.fromEntries(speedEntries) as DerivedStats["speeds"],
    attacks: [],
    resistances: [],
    weaknesses: [],
    immunities: [],
  };
}

export type CreateCharacterOptions = {
  metadata: CharacterMetadata;
  identity: CharacterIdentity;
  baseAbilities: AbilityScoreBlock;
  abilityAdjustments?: AbilityAdjustmentLogEntry[];
  proficiencies: ProficiencySummary;
  languages?: string[];
  senses?: string[];
  feats?: CharacterFeatSelection[];
  spellcasting?: CharacterSpellcastingEntry[];
  equipment?: CharacterItem[];
  history?: HistoryEntry[];
  notes?: CharacterNotes;
  derivedContext: DerivedContext;
};

export function createCharacter(options: CreateCharacterOptions): Character {
  const boosts = options.abilityAdjustments ?? [];
  const finalAbilities = applyAbilityAdjustments(options.baseAbilities, boosts);
  const derived = computeDerivedStats({
    level: options.identity.level,
    abilityScores: finalAbilities,
    proficiencies: options.proficiencies,
    context: options.derivedContext,
  });

  return {
    metadata: options.metadata,
    identity: options.identity,
    abilityScores: {
      base: options.baseAbilities,
      boosts,
      final: finalAbilities,
    },
    proficiencies: options.proficiencies,
    languages: options.languages ?? [],
    senses: options.senses ?? [],
    feats: options.feats ?? [],
    spellcasting: options.spellcasting ?? [],
    equipment: options.equipment ?? [],
    derived,
    notes: options.notes,
    history: options.history ?? [],
  };
}

export interface ChoiceResolution {
  choiceId: string;
  selectedIds: string[];
}

export interface EffectApplicationContext {
  traitSink: Set<string>;
  languageSink: Set<string>;
  senseSink: Map<string, number | null>;
  speedSink: Map<SpeedType, number>;
  proficiencySink: Map<string, ProficiencyRank>;
  abilityAdjustments: AbilityAdjustmentLogEntry[];
  flags: Set<string>;
}

export function createEffectApplicationContext(): EffectApplicationContext {
  return {
    traitSink: new Set(),
    languageSink: new Set(),
    senseSink: new Map(),
    speedSink: new Map(),
    proficiencySink: new Map(),
    abilityAdjustments: [],
    flags: new Set<string>(),
  };
}

export interface CatalogLookup {
  byId: Map<string, CatalogIndexEntry>;
}

export function buildCatalogLookup(entries: CatalogIndexEntry[]): CatalogLookup {
  const byId = new Map<string, CatalogIndexEntry>();
  for (const entry of entries) {
    byId.set(entry.entity.id, entry);
  }
  return { byId };
}

// Re-export effect system from effects module
export {
  applyEffect,
  applyEntityEffects,
  resolveChoice,
  selectAncestry,
  selectBackground,
  selectClass,
  createEffectApplicationResult,
  type EffectApplicationResult,
} from "./effects.js";

















