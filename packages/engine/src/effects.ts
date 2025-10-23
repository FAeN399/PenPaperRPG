import type {
  AbilityAdjustmentLogEntry,
  AbilityId,
  Character,
  ChoiceDefinition,
  Effect,
  ProficiencyRank,
  ProficiencySummary,
  SpeedType,
  ContentEntity,
} from "@pen-paper-rpg/schemas";
import {
  abilityIds,
  proficiencyRanks,
} from "@pen-paper-rpg/schemas";
import {
  createEffectApplicationContext,
  createCharacter,
  maxRank,
  type EffectApplicationContext,
  type CatalogLookup,
  type ChoiceResolution,
  type DerivedContext,
} from "./index";

/**
 * Result of applying effects from an entity.
 * Contains the accumulated changes and any choices that need to be made.
 */
export interface EffectApplicationResult {
  /** Ability score adjustments to apply */
  abilityAdjustments: AbilityAdjustmentLogEntry[];
  /** Proficiency updates to apply */
  proficiencyUpdates: Map<string, ProficiencyRank>;
  /** Languages granted */
  languages: Set<string>;
  /** Senses granted with optional ranges */
  senses: Map<string, number | null>;
  /** Speed modifications */
  speeds: Map<SpeedType, number>;
  /** Traits granted to the character */
  traits: Set<string>;
  /** Flags set on the character */
  flags: Set<string>;
  /** Choices that need to be resolved */
  choices: ChoiceDefinition[];
}


/**
 * Creates an empty effect application result.
 */
export function createEffectApplicationResult(): EffectApplicationResult {
  return {
    abilityAdjustments: [],
    proficiencyUpdates: new Map(),
    languages: new Set(),
    senses: new Map(),
    speeds: new Map(),
    traits: new Set(),
    flags: new Set(),
    choices: [],
  };
}

/**
 * Applies a single effect to the application context.
 */
export function applyEffect(
  effect: Effect,
  context: EffectApplicationContext,
  sourceLabel: string,
  result: EffectApplicationResult,
): void {
  switch (effect.kind) {
    case "abilityBoost": {
      const { mode } = effect;

      switch (mode.type) {
        case "fixed": {
          const adjustment: AbilityAdjustmentLogEntry = {
            type: "boost",
            abilities: mode.abilities,
            value: mode.value,
            source: sourceLabel,
          };
          result.abilityAdjustments.push(adjustment);
          context.abilityAdjustments.push(adjustment);
          break;
        }

        case "choice": {
          // For choice-based boosts, create a choice definition
          const choice: ChoiceDefinition = {
            id: `${sourceLabel}-ability-boost`,
            label: `Choose ${mode.count} ability boost${mode.count > 1 ? 's' : ''}`,
            count: mode.count,
            scope: "abilityBoost",
            filter: {
              type: "all",
              predicates: mode.options.map((ability) => ({
                type: "abilityAtLeast" as const,
                ability,
                score: 0, // Any score is valid for boost selection
              })),
            },
            allowDuplicates: false,
          };
          result.choices.push(choice);
          break;
        }

        case "any": {
          // For "any" boosts, all abilities are valid options
          const choice: ChoiceDefinition = {
            id: `${sourceLabel}-ability-boost-any`,
            label: `Choose ${mode.count} ability boost${mode.count > 1 ? 's' : ''} from any ability`,
            count: mode.count,
            scope: "abilityBoost",
            allowDuplicates: false,
          };
          result.choices.push(choice);
          break;
        }
      }
      break;
    }

    case "abilityFlaw": {
      const adjustment: AbilityAdjustmentLogEntry = {
        type: "flaw",
        abilities: effect.abilities,
        value: 2, // Standard flaw value
        source: sourceLabel,
      };
      result.abilityAdjustments.push(adjustment);
      context.abilityAdjustments.push(adjustment);
      break;
    }

    case "grantProficiency": {
      const current = context.proficiencySink.get(effect.target);
      const newRank = current ? maxRank(current, effect.rank) : effect.rank;
      context.proficiencySink.set(effect.target, newRank);
      result.proficiencyUpdates.set(effect.target, newRank);
      break;
    }

    case "setProficiency": {
      // Set proficiency explicitly, overriding any existing value
      context.proficiencySink.set(effect.target, effect.rank);
      result.proficiencyUpdates.set(effect.target, effect.rank);
      break;
    }

    case "grantTrait": {
      context.traitSink.add(effect.traitId);
      result.traits.add(effect.traitId);
      break;
    }

    case "grantLanguage": {
      context.languageSink.add(effect.languageId);
      result.languages.add(effect.languageId);
      break;
    }

    case "grantSense": {
      const range = effect.range ?? null;
      context.senseSink.set(effect.senseId, range);
      result.senses.set(effect.senseId, range);
      break;
    }

    case "addSpeed": {
      const current = context.speedSink.get(effect.speedType) ?? 0;
      const newSpeed = current + effect.value;
      context.speedSink.set(effect.speedType, newSpeed);
      result.speeds.set(effect.speedType, newSpeed);
      break;
    }

    case "grantFlag": {
      context.flags.add(effect.flag);
      result.flags.add(effect.flag);
      break;
    }

    case "removeFlag": {
      context.flags.delete(effect.flag);
      result.flags.delete(effect.flag);
      break;
    }

    case "grantChoice": {
      result.choices.push(effect.choice);
      break;
    }

    // TODO: Implement remaining effect types
    case "grantFeat":
    case "addModifier":
    case "grantSpell":
    case "grantSpellSlot":
    case "modifyResource":
      // These will be implemented in future iterations
      console.warn(`Effect type ${effect.kind} not yet implemented`);
      break;

    default:
      // Type guard to ensure we handle all effect types
      const _exhaustive: never = effect;
      console.warn(`Unknown effect type: ${(effect as any).kind}`);
      break;
  }
}

/**
 * Applies all effects from a content entity to a character.
 */
export function applyEntityEffects(
  entity: ContentEntity,
  character?: Character,
  catalog?: CatalogLookup,
): EffectApplicationResult {
  const context = createEffectApplicationContext();
  const result = createEffectApplicationResult();
  const sourceLabel = `${entity.type}:${entity.name}`;

  // Apply all effects from the entity
  for (const effect of entity.effects) {
    applyEffect(effect, context, sourceLabel, result);
  }

  // Handle legacy boost system for ancestry and background entities
  if (entity.type === "ancestry" || entity.type === "background") {
    const entityWithBoosts = entity as any;
    if (entityWithBoosts.boosts && Array.isArray(entityWithBoosts.boosts)) {
      for (const boost of entityWithBoosts.boosts) {
        const boostEffect = {
          kind: "abilityBoost" as const,
          mode: boost,
        };
        applyEffect(boostEffect, context, sourceLabel, result);
      }
    }
  }

  return result;
}

/**
 * Resolves a choice by applying the selected options.
 */
export function resolveChoice(
  choice: ChoiceDefinition,
  resolution: ChoiceResolution,
  sourceLabel: string,
): EffectApplicationResult {
  const result = createEffectApplicationResult();

  if (resolution.choiceId !== choice.id) {
    throw new Error(`Choice ID mismatch: expected ${choice.id}, got ${resolution.choiceId}`);
  }

  if (resolution.selectedIds.length !== choice.count) {
    throw new Error(
      `Invalid selection count: expected ${choice.count}, got ${resolution.selectedIds.length}`
    );
  }

  switch (choice.scope) {
    case "abilityBoost": {
      for (const abilityId of resolution.selectedIds) {
        if (!abilityIds.includes(abilityId as AbilityId)) {
          throw new Error(`Invalid ability ID: ${abilityId}`);
        }

        const adjustment: AbilityAdjustmentLogEntry = {
          type: "boost",
          abilities: [abilityId as AbilityId],
          value: 2, // Standard boost value
          source: sourceLabel,
        };
        result.abilityAdjustments.push(adjustment);
      }
      break;
    }

    case "skill": {
      for (const skillId of resolution.selectedIds) {
        result.proficiencyUpdates.set(skillId, "trained");
      }
      break;
    }

    case "proficiency": {
      for (const proficiencyId of resolution.selectedIds) {
        result.proficiencyUpdates.set(proficiencyId, "trained");
      }
      break;
    }

    case "language": {
      for (const languageId of resolution.selectedIds) {
        result.languages.add(languageId);
      }
      break;
    }

    // TODO: Implement other choice scopes
    case "skillFeat":
    case "classFeat":
    case "generalFeat":
    case "ancestryFeat":
    case "classFeature":
    case "spell":
      console.warn(`Choice scope ${choice.scope} not yet implemented`);
      break;

    default:
      const _exhaustive: never = choice.scope;
      throw new Error(`Unknown choice scope: ${(choice as any).scope}`);
  }

  return result;
}

/**
 * Character building mutations for the main selection functions.
 */

function mergeProficiencies(
  base: ProficiencySummary,
  updates: Map<string, ProficiencyRank>,
): ProficiencySummary {
  const next: ProficiencySummary = {
    perception: base.perception,
    saves: { ...base.saves },
    skills: { ...base.skills },
    lores: { ...base.lores },
    weapons: { ...base.weapons },
    armor: { ...base.armor },
    spellcasting: { ...base.spellcasting },
    classDC: base.classDC,
    perceptionModifiers: base.perceptionModifiers,
  };

  for (const [key, rank] of updates) {
    if (key === "perception") {
      next.perception = maxRank(next.perception, rank);
      continue;
    }
    if (key === "classDC") {
      next.classDC = maxRank(next.classDC, rank);
      continue;
    }
    if (key === "fortitude" || key === "reflex" || key === "will") {
      next.saves[key] = maxRank(next.saves[key], rank);
      continue;
    }
    if (key.startsWith("weapon:")) {
      const k = key.slice("weapon:".length);
      next.weapons[k] = maxRank(next.weapons[k] ?? "untrained", rank);
      continue;
    }
    if (key.startsWith("armor:")) {
      const k = key.slice("armor:".length);
      next.armor[k] = maxRank(next.armor[k] ?? "untrained", rank);
      continue;
    }
    // Heuristic: treat anything ending with "Lore" as a lore skill
    if (/lore$/i.test(key)) {
      next.lores[key] = maxRank(next.lores[key] ?? "untrained", rank);
      continue;
    }
    // Default fallthrough: assume skill ID
    next.skills[key] = maxRank(next.skills[key] ?? "untrained", rank);
  }

  return next;
}

function mergeLanguages(existing: string[], additions: Set<string>): string[] {
  if (additions.size === 0) return existing;
  const set = new Set(existing);
  for (const l of additions) set.add(l);
  return Array.from(set);
}

function mergeSenses(existing: string[], senses: Map<string, number | null>): string[] {
  if (senses.size === 0) return existing;
  const set = new Set(existing);
  for (const [sense, range] of senses) {
    set.add(typeof range === "number" ? `${sense} (${range} ft)` : sense);
  }
  return Array.from(set);
}

function mergeDerivedContextSpeeds(
  context: DerivedContext,
  speeds: Map<SpeedType, number>,
): DerivedContext {
  if (speeds.size === 0) return context;
  const next: DerivedContext = { ...context, speeds: { ...(context.speeds ?? {}) } };
  for (const [type, value] of speeds) {
    next.speeds![type] = value;
  }
  return next;
}

/**
 * Selects an ancestry for a character and applies its effects.
 */
export function selectAncestry(
  character: Character,
  ancestryId: string,
  catalog: CatalogLookup,
  arg4?: DerivedContext | ChoiceResolution[],
  arg5: ChoiceResolution[] = [],
): Character {
  // Back-compat: allow omitting derivedContext
  const DEFAULT_DERIVED_CONTEXT: DerivedContext = {
    ancestryHitPoints: 8,
    classHitPoints: 10,
    keyAbility: "STR",
    baseSpeed: 25,
  };
  const derivedContext: DerivedContext = Array.isArray(arg4)
    ? DEFAULT_DERIVED_CONTEXT
    : (arg4 ?? DEFAULT_DERIVED_CONTEXT);
  const choiceResolutions: ChoiceResolution[] = Array.isArray(arg4) ? arg4 : arg5;
  const ancestryEntry = catalog.byId.get(ancestryId);
  if (!ancestryEntry || ancestryEntry.entity.type !== "ancestry") {
    throw new Error(`Ancestry not found: ${ancestryId}`);
  }

  const ancestry = ancestryEntry.entity;
  const effectResult = applyEntityEffects(ancestry, character, catalog);

  // Apply choice resolutions
  for (const resolution of choiceResolutions) {
    const choice = effectResult.choices.find(c => c.id === resolution.choiceId);
    if (choice) {
      const choiceResult = resolveChoice(choice, resolution, `ancestry:${ancestry.name}`);
      // Merge choice results into main result
      effectResult.abilityAdjustments.push(...choiceResult.abilityAdjustments);
      for (const [key, value] of choiceResult.proficiencyUpdates) {
        effectResult.proficiencyUpdates.set(key, value);
      }
      for (const lang of choiceResult.languages) {
        effectResult.languages.add(lang);
      }
    }
  }

  // Merge all ability adjustments from ancestry effects and choices
  const allAdjustments = [...effectResult.abilityAdjustments];
  for (const resolution of choiceResolutions) {
    const choice = effectResult.choices.find(c => c.id === resolution.choiceId);
    if (choice) {
      const choiceResult = resolveChoice(choice, resolution, `ancestry:${ancestry.name}`);
      allAdjustments.push(...choiceResult.abilityAdjustments);
    }
  }

  const mergedProficiencies = mergeProficiencies(character.proficiencies, effectResult.proficiencyUpdates);
  const mergedLanguages = mergeLanguages(character.languages, effectResult.languages);
  const mergedSenses = mergeSenses(character.senses, effectResult.senses);
  const mergedContext = mergeDerivedContextSpeeds(derivedContext, effectResult.speeds);

  const nextIdentity = { ...character.identity, ancestryId };
  const boosts = [...character.abilityScores.boosts, ...allAdjustments];

  return createCharacter({
    metadata: { ...character.metadata, updatedAt: new Date().toISOString() },
    identity: nextIdentity,
    baseAbilities: character.abilityScores.base,
    abilityAdjustments: boosts,
    proficiencies: mergedProficiencies,
    languages: mergedLanguages,
    senses: mergedSenses,
    feats: character.feats,
    spellcasting: character.spellcasting,
    equipment: character.equipment,
    history: character.history,
    notes: character.notes,
    derivedContext: mergedContext,
  });
}

/**
 * Selects a background for a character and applies its effects.
 */
export function selectBackground(
  character: Character,
  backgroundId: string,
  catalog: CatalogLookup,
  arg4?: DerivedContext | ChoiceResolution[],
  arg5: ChoiceResolution[] = [],
): Character {
  const DEFAULT_DERIVED_CONTEXT: DerivedContext = {
    ancestryHitPoints: 8,
    classHitPoints: 10,
    keyAbility: "STR",
    baseSpeed: 25,
  };
  const derivedContext: DerivedContext = Array.isArray(arg4)
    ? DEFAULT_DERIVED_CONTEXT
    : (arg4 ?? DEFAULT_DERIVED_CONTEXT);
  const choiceResolutions: ChoiceResolution[] = Array.isArray(arg4) ? arg4 : arg5;
  const backgroundEntry = catalog.byId.get(backgroundId);
  if (!backgroundEntry || backgroundEntry.entity.type !== "background") {
    throw new Error(`Background not found: ${backgroundId}`);
  }

  const background = backgroundEntry.entity;
  const effectResult = applyEntityEffects(background, character, catalog);

  // Merge all ability adjustments from background effects and choices
  const allAdjustments = [...effectResult.abilityAdjustments];
  for (const resolution of choiceResolutions) {
    const choice = effectResult.choices.find(c => c.id === resolution.choiceId);
    if (choice) {
      const choiceResult = resolveChoice(choice, resolution, `background:${background.name}`);
      allAdjustments.push(...choiceResult.abilityAdjustments);
    }
  }

  const mergedProficiencies = mergeProficiencies(character.proficiencies, effectResult.proficiencyUpdates);
  const mergedLanguages = mergeLanguages(character.languages, effectResult.languages);
  const mergedSenses = mergeSenses(character.senses, effectResult.senses);
  const mergedContext = mergeDerivedContextSpeeds(derivedContext, effectResult.speeds);

  const nextIdentity = { ...character.identity, backgroundId };
  const boosts = [...character.abilityScores.boosts, ...allAdjustments];

  return createCharacter({
    metadata: { ...character.metadata, updatedAt: new Date().toISOString() },
    identity: nextIdentity,
    baseAbilities: character.abilityScores.base,
    abilityAdjustments: boosts,
    proficiencies: mergedProficiencies,
    languages: mergedLanguages,
    senses: mergedSenses,
    feats: character.feats,
    spellcasting: character.spellcasting,
    equipment: character.equipment,
    history: character.history,
    notes: character.notes,
    derivedContext: mergedContext,
  });
}

/**
 * Selects a class for a character and applies its effects.
 */
export function selectClass(
  character: Character,
  classId: string,
  catalog: CatalogLookup,
  arg4?: DerivedContext | ChoiceResolution[],
  arg5: ChoiceResolution[] = [],
): Character {
  const DEFAULT_DERIVED_CONTEXT: DerivedContext = {
    ancestryHitPoints: 8,
    classHitPoints: 10,
    keyAbility: "STR",
    baseSpeed: 25,
  };
  const derivedContext: DerivedContext = Array.isArray(arg4)
    ? DEFAULT_DERIVED_CONTEXT
    : (arg4 ?? DEFAULT_DERIVED_CONTEXT);
  const choiceResolutions: ChoiceResolution[] = Array.isArray(arg4) ? arg4 : arg5;
  const classEntry = catalog.byId.get(classId);
  if (!classEntry || classEntry.entity.type !== "class") {
    throw new Error(`Class not found: ${classId}`);
  }

  const classEntity = classEntry.entity;
  const effectResult = applyEntityEffects(classEntity, character, catalog);

  // Apply choice resolutions
  for (const resolution of choiceResolutions) {
    const choice = effectResult.choices.find(c => c.id === resolution.choiceId);
    if (choice) {
      const choiceResult = resolveChoice(choice, resolution, `class:${classEntity.name}`);
      // Merge choice results into main result
      effectResult.abilityAdjustments.push(...choiceResult.abilityAdjustments);
      for (const [key, value] of choiceResult.proficiencyUpdates) {
        effectResult.proficiencyUpdates.set(key, value);
      }
    }
  }

  const mergedProficiencies = mergeProficiencies(character.proficiencies, effectResult.proficiencyUpdates);
  const mergedLanguages = mergeLanguages(character.languages, effectResult.languages);
  const mergedSenses = mergeSenses(character.senses, effectResult.senses);
  const mergedContext = mergeDerivedContextSpeeds(derivedContext, effectResult.speeds);

  const nextIdentity = { ...character.identity, classId };
  const boosts = [...character.abilityScores.boosts, ...effectResult.abilityAdjustments];

  return createCharacter({
    metadata: { ...character.metadata, updatedAt: new Date().toISOString() },
    identity: nextIdentity,
    baseAbilities: character.abilityScores.base,
    abilityAdjustments: boosts,
    proficiencies: mergedProficiencies,
    languages: mergedLanguages,
    senses: mergedSenses,
    feats: character.feats,
    spellcasting: character.spellcasting,
    equipment: character.equipment,
    history: character.history,
    notes: character.notes,
    derivedContext: mergedContext,
  });
}
