import { useState } from 'react'
import Header from './layout/Header'
import Sidebar from './layout/Sidebar'
import Footer from './layout/Footer'
import StepIndicator from './layout/StepIndicator'
import Card from './shared/Card'
import Button from './shared/Button'
import Input from './shared/Input'
import StepAncestry from './character-creation/StepAncestry'
import StepBackground from './character-creation/StepBackground'
import StepClass from './character-creation/StepClass'
import { useCharacter } from '@/hooks/useCharacter'
import { CharacterCreationStep, CREATION_STEPS } from '@/types/steps'

export default function CharacterCreator() {
  const { character, updateBasics, updateAbilityScores } = useCharacter()
  const [currentStep, setCurrentStep] = useState<CharacterCreationStep>(
    CharacterCreationStep.Basics
  )

  const currentStepInfo = CREATION_STEPS.find((s) => s.id === currentStep)
  const currentStepIndex = CREATION_STEPS.findIndex((s) => s.id === currentStep)

  const handleNext = () => {
    if (currentStepIndex < CREATION_STEPS.length - 1) {
      setCurrentStep(CREATION_STEPS[currentStepIndex + 1].id)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(CREATION_STEPS[currentStepIndex - 1].id)
    }
  }

  const handleStepClick = (step: CharacterCreationStep) => {
    setCurrentStep(step)
  }

  const handleSave = () => {
    console.log('Saving character...', character)
    // TODO: Implement save functionality
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        characterName={character.basics.name}
        currentStep={currentStepInfo?.order.toString()}
        totalSteps={CREATION_STEPS.length}
      />

      <StepIndicator
        steps={CREATION_STEPS}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar character={character} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-pf-accent mb-2">
              {currentStepInfo?.label}
            </h2>
            <p className="text-pf-text-muted mb-6">{currentStepInfo?.description}</p>

            {/* Step content */}
            {currentStep === CharacterCreationStep.Basics && (
              <Card className="p-6">
                <div className="max-w-md mx-auto space-y-4">
                  <Input
                    label="Character Name"
                    value={character.basics.name}
                    onChange={(value) => updateBasics({ name: value })}
                    placeholder="Enter character name"
                    required
                  />
                  <Input
                    label="Player Name"
                    value={character.basics.playerName}
                    onChange={(value) => updateBasics({ playerName: value })}
                    placeholder="Enter player name"
                  />
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm text-pf-text-muted mb-2">
                      Level: {character.basics.level}
                    </p>
                    <p className="text-xs text-pf-text-muted">
                      Watch the sidebar update as you enter information!
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {currentStep === CharacterCreationStep.Abilities && (
              <Card className="p-6">
                <div className="text-center mb-6">
                  <p className="text-pf-text mb-4">
                    Test the live stat calculation system
                  </p>
                  <Button
                    onClick={() => {
                      // Randomize ability scores for demo
                      const randomScore = () => Math.floor(Math.random() * 9) + 10
                      updateAbilityScores({
                        strength: randomScore(),
                        dexterity: randomScore(),
                        constitution: randomScore(),
                        intelligence: randomScore(),
                        wisdom: randomScore(),
                        charisma: randomScore(),
                      })
                    }}
                  >
                    🎲 Randomize Ability Scores
                  </Button>
                  <p className="text-xs text-pf-text-muted mt-4">
                    Click to see HP, AC, and saves update automatically!
                  </p>
                </div>
              </Card>
            )}

            {currentStep === CharacterCreationStep.Ancestry && <StepAncestry />}

            {currentStep === CharacterCreationStep.Background && <StepBackground />}

            {currentStep === CharacterCreationStep.Class && <StepClass />}

            {currentStep !== CharacterCreationStep.Basics &&
              currentStep !== CharacterCreationStep.Abilities &&
              currentStep !== CharacterCreationStep.Ancestry &&
              currentStep !== CharacterCreationStep.Background &&
              currentStep !== CharacterCreationStep.Class && (
                <Card className="p-8">
                  <div className="text-center">
                    <p className="text-lg text-pf-text mb-4">
                      {currentStep === CharacterCreationStep.Skills &&
                        'Select skill proficiencies'}
                      {currentStep === CharacterCreationStep.Feats && 'Choose your feats'}
                      {currentStep === CharacterCreationStep.Spells &&
                        'Select spells (if applicable)'}
                      {currentStep === CharacterCreationStep.Equipment &&
                        'Choose starting equipment'}
                      {currentStep === CharacterCreationStep.Review &&
                        'Review your character'}
                    </p>
                    <p className="text-sm text-pf-text-muted">
                      Coming in future phases
                    </p>
                  </div>
                </Card>
              )}
          </div>
        </main>
      </div>

      <Footer
        onBack={handleBack}
        onNext={handleNext}
        onSave={handleSave}
        canGoBack={currentStepIndex > 0}
        canGoNext={currentStepIndex < CREATION_STEPS.length - 1}
        isFirstStep={currentStepIndex === 0}
        isLastStep={currentStepIndex === CREATION_STEPS.length - 1}
      />
    </div>
  )
}
