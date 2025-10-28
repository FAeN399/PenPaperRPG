"use client";

interface WizardHeaderProps {
  characterName: string;
  currentStepNum: number;
  totalSteps: number;
  onNewCharacter: () => void;
}

export function WizardHeader({ characterName, currentStepNum, totalSteps, onNewCharacter }: WizardHeaderProps): JSX.Element {
  return (
    <header
      style={{
        backgroundColor: "#2d2d2d",
        borderBottom: "1px solid #444",
        padding: "1rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h1
          style={{
            color: "#daa520",
            fontSize: "1.5rem",
            marginBottom: "0.25rem",
          }}
        >
          PenPaperRPG
        </h1>
        <p
          style={{
            color: "#a0a0a0",
            fontSize: "0.75rem",
          }}
        >
          Pathfinder 2e Character Creator
        </p>
      </div>
      <div style={{ textAlign: "center" }}>
        <h2
          style={{
            fontSize: "1.125rem",
            color: "#e0e0e0",
          }}
        >
          {characterName}
        </h2>
        <p
          style={{
            fontSize: "0.75rem",
            color: "#a0a0a0",
          }}
        >
          Step {currentStepNum} of {totalSteps}
        </p>
      </div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          type="button"
          onClick={onNewCharacter}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#8b0000",
            color: "#e0e0e0",
            border: "none",
            borderRadius: "0.25rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#5e0000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#8b0000";
          }}
        >
          ✨ New Character
        </button>
        <button
          type="button"
          style={{
            background: "transparent",
            border: "none",
            color: "#a0a0a0",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#e0e0e0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#a0a0a0";
          }}
        >
          💾 Save
        </button>
        <button
          type="button"
          style={{
            background: "transparent",
            border: "none",
            color: "#a0a0a0",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#e0e0e0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#a0a0a0";
          }}
        >
          ❓ Help
        </button>
      </div>
    </header>
  );
}
