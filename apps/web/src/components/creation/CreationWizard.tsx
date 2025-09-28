'use client';
import { useMemo, useState } from "react";

import { StepList } from "./StepList";
import { WizardViewport } from "./WizardViewport";
import { useCharacterBuilder } from "@/hooks/useCharacterBuilder";

export type CreationStep = {
  id: string;
  title: string;
  description: string;
};

const DEFAULT_STEPS: CreationStep[] = [
  {
    id: "ancestry",
    title: "Choose Ancestry",
    description: "Pick a core ancestry or heritage from the available catalog packs.",
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
    const isDesktop = typeof window !== "undefined" && !!window.penPaperRpg;
  const isLoading = status === "idle" || status === "loading";
  const hasError = status === "error";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem", padding: "2rem" }}>
      <aside>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Create Your Character</h1>
        <StepList
          steps={steps}
          activeStepId={activeStepId}
          onStepSelect={setActiveStepId}
        />
      </aside>
      <main>
        {builderState && (
          <section style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 1rem", marginBottom: "1rem", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fafafa" }}>
            <span style={{ fontWeight: 600 }}>Catalog</span>
            <span style={{ color: "#4b5563" }}>
              Entities: {builderState.catalog.entities.length}
            </span>
            <span style={{ color: "#4b5563" }}>
              Packs: {Object.keys(builderState.catalog.packs ?? {}).length}
            </span>
            {isDesktop && (
              <>
                <span style={{ marginLeft: "auto", fontStyle: "italic", color: "#065f46" }}>Desktop mode</span>
                <button type="button" onClick={() => window.penPaperRpg?.openPacksDirectory()} style={{ padding: "0.25rem 0.5rem" }}>
                  Open Packs
                </button>
                <button type="button" onClick={() => window.penPaperRpg?.selectPacksDirectory()} style={{ padding: "0.25rem 0.5rem" }}>
                  Change Packs...
                </button>
              </>
            )}
          </section>
        )}        {isLoading && <p>Loading catalog�</p>}
        {hasError && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p role="alert" style={{ color: "#b91c1c" }}>
              Failed to load catalog data. {error?.message ?? "Unknown error"}
            </p>
            <button type="button" onClick={() => refresh()} style={{ alignSelf: "start" }}>
              Retry
            </button>
          </div>
        )}
        {status === "ready" && builderState && (
          <WizardViewport
            step={activeStep}
            builderState={builderState}
          />
        )}
      </main>
    </div>
  );
}


