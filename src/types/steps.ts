// Character creation step definitions
export enum CharacterCreationStep {
  Basics = 'basics',
  Ancestry = 'ancestry',
  Background = 'background',
  Class = 'class',
  Abilities = 'abilities',
  Skills = 'skills',
  Feats = 'feats',
  Spells = 'spells',
  Equipment = 'equipment',
  Review = 'review',
}

export interface StepInfo {
  id: CharacterCreationStep
  label: string
  description: string
  order: number
}

export const CREATION_STEPS: StepInfo[] = [
  {
    id: CharacterCreationStep.Basics,
    label: 'Character Basics',
    description: 'Name and basic information',
    order: 1,
  },
  {
    id: CharacterCreationStep.Ancestry,
    label: 'Ancestry',
    description: 'Choose your ancestry and heritage',
    order: 2,
  },
  {
    id: CharacterCreationStep.Background,
    label: 'Background',
    description: 'Choose your background',
    order: 3,
  },
  {
    id: CharacterCreationStep.Class,
    label: 'Class',
    description: 'Choose your class',
    order: 4,
  },
  {
    id: CharacterCreationStep.Abilities,
    label: 'Ability Scores',
    description: 'Assign ability boosts',
    order: 5,
  },
  {
    id: CharacterCreationStep.Skills,
    label: 'Skills',
    description: 'Select skill proficiencies',
    order: 6,
  },
  {
    id: CharacterCreationStep.Feats,
    label: 'Feats',
    description: 'Choose your feats',
    order: 7,
  },
  {
    id: CharacterCreationStep.Spells,
    label: 'Spells',
    description: 'Select spells (if applicable)',
    order: 8,
  },
  {
    id: CharacterCreationStep.Equipment,
    label: 'Equipment',
    description: 'Choose starting equipment',
    order: 9,
  },
  {
    id: CharacterCreationStep.Review,
    label: 'Review',
    description: 'Review and finalize',
    order: 10,
  },
]
