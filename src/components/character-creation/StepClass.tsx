import { useState } from 'react'
import Card from '../shared/Card'
import Button from '../shared/Button'
import { useCharacter } from '@/hooks/useCharacter'
import { useGameData } from '@/hooks/useGameData'
import { Class } from '@/types/gameData'
import { getProficiencyName } from '@/utils/proficiency'

export default function StepClass() {
  const { character, updateClass, updateAbilityScores } = useCharacter()
  const { classes } = useGameData()
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)

  const handleClassSelect = (classData: Class) => {
    setSelectedClass(classData)
  }

  const handleConfirm = () => {
    if (selectedClass) {
      updateClass({
        class: selectedClass.name,
        subclass: null,
        classFeat: null,
      })

      // Apply class key ability boost (simplified)
      const newScores = { ...character.abilityScores }
      if (selectedClass.keyAbility.length > 0) {
        const keyAbility = selectedClass.keyAbility[0]
        newScores[keyAbility] += 2
      }
      updateAbilityScores(newScores)
    }
  }

  return (
    <div className="space-y-6">
      {/* Class Selection */}
      <div>
        <h3 className="text-lg font-semibold text-pf-accent mb-4">Choose Your Class</h3>
        <p className="text-sm text-pf-text-muted mb-4">
          Your class determines your role in combat and your special abilities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classData) => (
            <Card
              key={classData.id}
              hoverable
              selected={selectedClass?.id === classData.id}
              onClick={() => handleClassSelect(classData)}
              className="cursor-pointer"
            >
              <h4 className="text-pf-accent font-semibold mb-2">{classData.name}</h4>
              <p className="text-sm text-pf-text-muted mb-3">{classData.description}</p>
              <div className="text-xs text-pf-text space-y-1 border-t border-gray-700 pt-2">
                <div>
                  <strong>HP per Level:</strong> {classData.hitPoints}
                </div>
                <div>
                  <strong>Key Ability:</strong>{' '}
                  {classData.keyAbility.map((a) => a.toUpperCase().slice(0, 3)).join(' or ')}
                </div>
                {classData.spellcasting && (
                  <div className="text-pf-accent">
                    ✨ Spellcaster ({classData.spellcasting.tradition})
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Class Details */}
      {selectedClass && (
        <div className="bg-pf-bg-dark p-4 rounded border border-gray-700">
          <h4 className="text-pf-accent font-semibold mb-3">{selectedClass.name} - Details</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-pf-text">
            {/* Basic Stats */}
            <div>
              <h5 className="font-semibold text-pf-accent text-xs mb-2">BASIC STATS</h5>
              <ul className="space-y-1">
                <li>HP per Level: {selectedClass.hitPoints}</li>
                <li>
                  Key Ability: {selectedClass.keyAbility.map((a) => a.charAt(0).toUpperCase() + a.slice(1)).join(' or ')}
                </li>
                <li>
                  Perception: {getProficiencyName(selectedClass.initialProficiencies.perception)}
                </li>
              </ul>
            </div>

            {/* Saves */}
            <div>
              <h5 className="font-semibold text-pf-accent text-xs mb-2">SAVING THROWS</h5>
              <ul className="space-y-1">
                <li>
                  Fortitude: {getProficiencyName(selectedClass.initialProficiencies.fortitude)}
                </li>
                <li>
                  Reflex: {getProficiencyName(selectedClass.initialProficiencies.reflex)}
                </li>
                <li>Will: {getProficiencyName(selectedClass.initialProficiencies.will)}</li>
              </ul>
            </div>

            {/* Skills */}
            <div>
              <h5 className="font-semibold text-pf-accent text-xs mb-2">SKILLS</h5>
              <p>Trained in {selectedClass.initialProficiencies.skills.trained} skills</p>
            </div>

            {/* Attacks */}
            <div>
              <h5 className="font-semibold text-pf-accent text-xs mb-2">ATTACKS</h5>
              <ul className="space-y-1">
                <li>
                  Simple: {getProficiencyName(selectedClass.initialProficiencies.attacks.simple)}
                </li>
                <li>
                  Martial:{' '}
                  {getProficiencyName(selectedClass.initialProficiencies.attacks.martial)}
                </li>
                <li>
                  Unarmed:{' '}
                  {getProficiencyName(selectedClass.initialProficiencies.attacks.unarmed)}
                </li>
              </ul>
            </div>

            {/* Defenses */}
            <div>
              <h5 className="font-semibold text-pf-accent text-xs mb-2">DEFENSES</h5>
              <ul className="space-y-1">
                <li>
                  Unarmored:{' '}
                  {getProficiencyName(selectedClass.initialProficiencies.defenses.unarmored)}
                </li>
                <li>
                  Light: {getProficiencyName(selectedClass.initialProficiencies.defenses.light)}
                </li>
                <li>
                  Medium:{' '}
                  {getProficiencyName(selectedClass.initialProficiencies.defenses.medium)}
                </li>
                <li>
                  Heavy: {getProficiencyName(selectedClass.initialProficiencies.defenses.heavy)}
                </li>
              </ul>
            </div>

            {/* Spellcasting */}
            {selectedClass.spellcasting && (
              <div>
                <h5 className="font-semibold text-pf-accent text-xs mb-2">SPELLCASTING</h5>
                <ul className="space-y-1">
                  <li>
                    Tradition:{' '}
                    {selectedClass.spellcasting.tradition.charAt(0).toUpperCase() +
                      selectedClass.spellcasting.tradition.slice(1)}
                  </li>
                  <li>
                    Type:{' '}
                    {selectedClass.spellcasting.type.charAt(0).toUpperCase() +
                      selectedClass.spellcasting.type.slice(1)}
                  </li>
                  <li>
                    Key Ability:{' '}
                    {selectedClass.spellcasting.keyAbility.charAt(0).toUpperCase() +
                      selectedClass.spellcasting.keyAbility.slice(1)}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Button */}
      {selectedClass && (
        <div className="pt-4">
          <Button onClick={handleConfirm} variant="primary">
            Confirm Selection
          </Button>
          {character.class && (
            <p className="text-sm text-green-500 mt-2">✓ {character.class.class} selected</p>
          )}
        </div>
      )}
    </div>
  )
}
