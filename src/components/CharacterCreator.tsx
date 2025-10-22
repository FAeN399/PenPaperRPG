import { useState } from 'react'
import Header from './layout/Header'
import Sidebar from './layout/Sidebar'
import Footer from './layout/Footer'
import StepIndicator from './layout/StepIndicator'
import Card from './shared/Card'
import { Character, createEmptyCharacter } from '@/types/character'
import { CharacterCreationStep, CREATION_STEPS } from '@/types/steps'

export default function CharacterCreator() {
  const [character] = useState<Character>(createEmptyCharacter())
  // setCharacter will be used in Phase 5 when implementing step content
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

            {/* Placeholder content for each step */}
            <Card className="p-8">
              <div className="text-center">
                <p className="text-lg text-pf-text mb-4">
                  {currentStep === CharacterCreationStep.Basics &&
                    'Enter your character\'s basic information'}
                  {currentStep === CharacterCreationStep.Ancestry &&
                    'Choose your character\'s ancestry and heritage'}
                  {currentStep === CharacterCreationStep.Background &&
                    'Select a background for your character'}
                  {currentStep === CharacterCreationStep.Class &&
                    'Choose your character\'s class'}
                  {currentStep === CharacterCreationStep.Abilities &&
                    'Assign ability score boosts'}
                  {currentStep === CharacterCreationStep.Skills &&
                    'Select skill proficiencies'}
                  {currentStep === CharacterCreationStep.Feats &&
                    'Choose your feats'}
                  {currentStep === CharacterCreationStep.Spells &&
                    'Select spells (if applicable)'}
                  {currentStep === CharacterCreationStep.Equipment &&
                    'Choose starting equipment'}
                  {currentStep === CharacterCreationStep.Review &&
                    'Review your character'}
                </p>
                <p className="text-sm text-pf-text-muted">
                  Step content will be implemented in Phase 5
                </p>
              </div>
            </Card>
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
