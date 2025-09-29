"use client";

import type { CreationStep } from "./CreationWizard";

interface StepListProps {
  steps: CreationStep[];
  activeStepId: string;
  onStepSelect: (stepId: string) => void;
}

export function StepList({ steps, activeStepId, onStepSelect }: StepListProps): JSX.Element {
  return (
    <nav aria-label="Character creation steps">
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          const background = isActive ? "#eff6ff" : "#ffffff";
          const borderColor = isActive ? "#2563eb" : "#e5e7eb";

          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onStepSelect(step.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  borderRadius: 8,
                  border: `1px solid ${borderColor}`,
                  background,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                  cursor: "pointer",
                  transition: "background 0.2s ease, border-color 0.2s ease",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#6b7280",
                  }}
                >
                  Step {index + 1}
                </span>
                <span style={{ fontWeight: 600, color: "#111827" }}>{step.title}</span>
                <span style={{ fontSize: "0.875rem", lineHeight: 1.4, color: "#4b5563" }}>
                  {step.description}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
