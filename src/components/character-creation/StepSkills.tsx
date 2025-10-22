import { useState, useEffect } from 'react'
import { useCharacter } from '@/hooks/useCharacter'
import { useGameData } from '@/hooks/useGameData'
import Card from '../shared/Card'
import { ProficiencyLevel } from '@/types/character'
import { calculateSkillModifier } from '@/services/calculations'
import { getProficiencyName } from '@/utils/proficiency'
import { formatModifier, getAbilityModifier } from '@/utils/modifiers'

export default function StepSkills() {
  const { character, updateSkill } = useCharacter()
  const { skills, backgrounds, classes, getSkillByName } = useGameData()

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  // Calculate how many skills the character can train
  const intMod = getAbilityModifier(character.abilityScores.intelligence)
  const additionalSkills = Math.max(1, intMod) // Minimum 1, even if Int is negative

  // Get background skill
  const background = backgrounds.find((b) => b.name === character.background)
  const backgroundSkill = background?.skillTraining || null

  // Get class skills
  const classData = classes.find((c) => c.name === character.class?.class)
  const classSkillCount = classData?.initialProficiencies.skills.trained || 0

  // Total skills available to train
  const totalSkillsAvailable = classSkillCount + additionalSkills

  // Apply background skill automatically
  useEffect(() => {
    if (backgroundSkill) {
      const skill = getSkillByName(backgroundSkill)
      if (skill && character.skills[skill.id] !== ProficiencyLevel.Trained) {
        updateSkill(skill.id, ProficiencyLevel.Trained)
      }
    }
  }, [backgroundSkill, character.skills, getSkillByName, updateSkill])

  const handleSkillToggle = (skillId: string) => {
    const isBackgroundSkill = backgroundSkill && getSkillByName(backgroundSkill)?.id === skillId
    if (isBackgroundSkill) {
      return // Can't untrain background skill
    }

    const currentProficiency = character.skills[skillId] || ProficiencyLevel.Untrained
    const isCurrentlyTrained = currentProficiency >= ProficiencyLevel.Trained

    if (isCurrentlyTrained) {
      // Untrain this skill
      updateSkill(skillId, ProficiencyLevel.Untrained)
      setSelectedSkills(selectedSkills.filter((s) => s !== skillId))
    } else {
      // Train this skill if we have available slots
      if (selectedSkills.length < totalSkillsAvailable) {
        updateSkill(skillId, ProficiencyLevel.Trained)
        setSelectedSkills([...selectedSkills, skillId])
      } else {
        alert(`You can only train ${totalSkillsAvailable} skills from your class and Intelligence.`)
      }
    }
  }

  const skillsRemaining = totalSkillsAvailable - selectedSkills.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-pf-accent mb-2">Skill Training</h2>
        <p className="text-gray-300">
          Select which skills your character is trained in. Training increases your proficiency
          bonus and improves your chances of success.
        </p>
      </div>

      <div className="bg-pf-bg-card p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-300">Background skill:</span>
          <span className="text-blue-400 font-semibold">
            {backgroundSkill || 'None'} (automatic)
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Class skills:</span>
          <span className="text-purple-400 font-semibold">{classSkillCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Intelligence bonus:</span>
          <span className="text-green-400 font-semibold">
            +{additionalSkills} {intMod < 0 && '(minimum 1)'}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-600 pt-2 mt-2">
          <span className="text-gray-200 font-semibold">Skills remaining:</span>
          <span className="text-pf-accent font-bold text-lg">
            {skillsRemaining} / {totalSkillsAvailable}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => {
          const proficiency = character.skills[skill.id] || ProficiencyLevel.Untrained
          const isTrained = proficiency >= ProficiencyLevel.Trained
          const skillBonus = calculateSkillModifier(character, skill.id, skill.ability)
          const abilityMod = getAbilityModifier(character.abilityScores[skill.ability])
          const isBackgroundSkill = backgroundSkill && getSkillByName(backgroundSkill)?.id === skill.id

          return (
            <Card
              key={skill.id}
              hoverable={!isBackgroundSkill}
              selected={isTrained}
              onClick={() => handleSkillToggle(skill.id)}
              className={`cursor-pointer ${isBackgroundSkill ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-pf-accent">{skill.name}</h3>
                  <p className="text-xs text-gray-400 uppercase">
                    {skill.ability.toUpperCase()}
                  </p>
                  {isBackgroundSkill && (
                    <span className="text-xs text-blue-400 font-semibold">
                      (Background)
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {formatModifier(skillBonus)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {getProficiencyName(proficiency)}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-3">{skill.description}</p>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Ability modifier:</span>
                  <span>{formatModifier(abilityMod)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Proficiency:</span>
                  <span>
                    {proficiency === ProficiencyLevel.Untrained
                      ? formatModifier(0)
                      : formatModifier(character.basics.level + proficiency)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300 font-semibold border-t border-gray-600 pt-1">
                  <span>Total:</span>
                  <span>{formatModifier(skillBonus)}</span>
                </div>
              </div>

              {isTrained && !isBackgroundSkill && (
                <div className="mt-3 pt-3 border-t border-pf-accent">
                  <p className="text-xs text-pf-accent text-center font-semibold">
                    ✓ Trained
                  </p>
                </div>
              )}

              {!isTrained && skillsRemaining > 0 && !isBackgroundSkill && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-400 text-center">
                    Click to train
                  </p>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {skillsRemaining === 0 && (
        <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
          <p className="text-green-400 font-semibold">
            ✓ All skills assigned! You can now proceed to the next step.
          </p>
        </div>
      )}

      <div className="bg-pf-bg-card p-4 rounded-lg">
        <h4 className="text-md font-semibold text-gray-300 mb-2">How Skills Work</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Skill checks: d20 + ability modifier + proficiency bonus</li>
          <li>• Untrained: +0 proficiency bonus</li>
          <li>• Trained: +{character.basics.level + 2} at level {character.basics.level}</li>
          <li>• Your background automatically trains you in one skill</li>
          <li>• Your class grants {classSkillCount} trained skills</li>
          <li>
            • Your Intelligence modifier grants {additionalSkills} additional skill
            {additionalSkills !== 1 ? 's' : ''} (minimum 1)
          </li>
        </ul>
      </div>
    </div>
  )
}
