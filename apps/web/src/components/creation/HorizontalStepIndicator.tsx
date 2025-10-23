"use client";

import type { CreationStep } from "./CreationWizard";

interface HorizontalStepIndicatorProps {
  steps: CreationStep[];
  activeStepId: string;
}

export function HorizontalStepIndicator({ steps, activeStepId }: HorizontalStepIndicatorProps): JSX.Element {
  const activeIndex = steps.findIndex((s) => s.id === activeStepId);

  return (
    <div
      style={{
        backgroundColor: "#2d2d2d",
        borderBottom: "1px solid #444",
        padding: "0.75rem 1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          const isCompleted = index < activeIndex;
          const showConnector = index < steps.length - 1;

          return (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
              }}
            >
              {/* Step Circle */}
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  border: `2px solid ${isActive ? "#daa520" : isCompleted ? "#daa520" : "#666"}`,
                  backgroundColor: isActive ? "#daa520" : "#1a1a1a",
                  color: isActive ? "white" : isCompleted ? "#daa520" : "#a0a0a0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {isCompleted ? "✓" : index + 1}
              </div>

              {/* Step Label */}
              <div
                style={{
                  marginLeft: "0.5rem",
                  fontSize: "0.75rem",
                  color: isActive ? "#daa520" : "#a0a0a0",
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {step.title}
              </div>

              {/* Connector */}
              {showConnector && (
                <div
                  style={{
                    flex: 1,
                    height: "2px",
                    backgroundColor: isCompleted ? "#daa520" : "#666",
                    margin: "0 0.5rem",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
