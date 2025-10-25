"use client";

import { useMemo, useState } from "react";

import { WizardHeader } from "./WizardHeader";
import { HorizontalStepIndicator } from "./HorizontalStepIndicator";
import { CharacterStatsSidebar } from "./CharacterStatsSidebar";
import { WizardViewport } from "./WizardViewport";
import { WizardFooter } from "./WizardFooter";

import { useCharacterBuilder } from "@/hooks/useCharacterBuilder";
import type { DesktopBridge } from "@/types/desktop";

export type CreationStep = {
  id: string;
  title: string;
  description: string;
};

const DEFAULT_STEPS: CreationStep[] = [
  {
    id: "ancestry",
    title: "Choose Ancestry",
    description: "Pick a core ancestry from the available catalog packs.",
  },
  {
    id: "heritage",
    title: "Choose Heritage",
    description: "Select a heritage that represents your lineage and grants unique abilities.",
  },
  {
    id: "background",
    title: "Select Background",
    description: "Pick a background to grant boosts, skills, and feats.",
  },
  {
    id: "class",
    title: "Select Class",
    description: "Choose a class to determine progression, key ability scores, and proficiencies.",
  },
  {
    id: "abilities",
    title: "Assign Ability Boosts",
    description: "Distribute boosts and flaws from ancestry, background, and level 1 choices.",
  },
  {
    id: "proficiencies",
    title: "Train Skills & Proficiencies",
    description: "Train starting skills and verify weapon/armor proficiencies based on class.",
  },
  {
    id: "starting-feats",
    title: "Pick Starting Feats",
    description: "Select initial feats (ancestry, class, skill) that satisfy prerequisites.",
  },
  {
    id: "equipment",
    title: "Choose Starting Equipment",
    description: "Equip basic gear and calculate carry capacity and bulk.",
  },
  {
    id: "review",
    title: "Review & Save",
    description: "Review derived statistics, adjust notes, and save the character sheet.",
  },
];

export function CreationWizard(): JSX.Element {
  const steps = useMemo(() => DEFAULT_STEPS, []);
  const [activeStepId, setActiveStepId] = useState<string>(steps[0]?.id ?? "ancestry");
  const activeStep = steps.find((step) => step.id === activeStepId) ?? steps[0];
  const activeStepIndex = steps.findIndex((s) => s.id === activeStepId);

  const {
    state: builderState,
    status,
    error,
    refresh,
    selectAncestry,
    selectHeritage,
    selectBackground,
    selectClass,
    resolveAbilityBoost,
    trainSkills,
    learnSpells,
    selectFeats,
    resetCharacter,
  } = useCharacterBuilder();

  const isLoading = status === "idle" || status === "loading";
  const hasError = status === "error";

  const handleNext = (): void => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepId(steps[activeStepIndex + 1].id);
    }
  };

  const handleBack = (): void => {
    if (activeStepIndex > 0) {
      setActiveStepId(steps[activeStepIndex - 1].id);
    }
  };

  const handleNewCharacter = (): void => {
    resetCharacter();
    setActiveStepId(steps[0]?.id ?? "ancestry");
  };

  const characterName = builderState?.character.metadata.name || "Unnamed Character";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <WizardHeader
        characterName={characterName}
        currentStepNum={activeStepIndex + 1}
        totalSteps={steps.length}
        onNewCharacter={handleNewCharacter}
      />

      {/* Step Indicator */}
      <HorizontalStepIndicator steps={steps} activeStepId={activeStepId} />

      {/* Main Container */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Sidebar - Character Stats */}
        {status === "ready" && builderState ? (
          <CharacterStatsSidebar builderState={builderState} />
        ) : null}

        {/* Main Content */}
        <main style={{ flex: 1, padding: "1.5rem", overflowY: "auto" }}>
          <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
            {isLoading && (
              <div style={{ textAlign: "center", color: "#a0a0a0", padding: "2rem" }}>
                Loading catalog...
              </div>
            )}

            {hasError && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  padding: "2rem",
                  backgroundColor: "#2d2d2d",
                  borderRadius: "0.5rem",
                  border: "1px solid #444",
                }}
              >
                <p role="alert" style={{ color: "#ff6b6b" }}>
                  Failed to load catalog data. {error?.message ?? "Unknown error"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    void refresh();
                  }}
                  style={{
                    alignSelf: "start",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#8b0000",
                    color: "white",
                    border: "none",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {status === "ready" && builderState ? (
              <WizardViewport
                step={activeStep}
                builderState={builderState}
                onSelectAncestry={selectAncestry}
                onSelectHeritage={selectHeritage}
                onSelectBackground={selectBackground}
                onSelectClass={selectClass}
                onResolveAbilityBoost={resolveAbilityBoost}
                onTrainSkills={trainSkills}
                onLearnSpells={learnSpells}
                onSelectFeats={selectFeats}
              />
            ) : null}
          </div>
        </main>
      </div>

      {/* Footer */}
      <WizardFooter
        canGoBack={activeStepIndex > 0}
        canGoNext={activeStepIndex < steps.length - 1}
        isLastStep={activeStepIndex === steps.length - 1}
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  );
}

function getDesktopBridge(): DesktopBridge | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  return window.penPaperRpg;
}

