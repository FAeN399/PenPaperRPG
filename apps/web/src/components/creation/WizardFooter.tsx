"use client";

interface WizardFooterProps {
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function WizardFooter({ canGoBack, canGoNext, isLastStep, onBack, onNext }: WizardFooterProps): JSX.Element {
  return (
    <footer
      style={{
        backgroundColor: "#2d2d2d",
        borderTop: "1px solid #444",
        padding: "1rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <button
          type="button"
          disabled={!canGoBack}
          onClick={onBack}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0.25rem",
            fontWeight: 500,
            fontSize: "0.875rem",
            backgroundColor: "#444",
            color: "white",
            cursor: canGoBack ? "pointer" : "not-allowed",
            opacity: canGoBack ? 1 : 0.5,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (canGoBack) {
              e.currentTarget.style.backgroundColor = "#555";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#444";
          }}
        >
          ← Back
        </button>
      </div>
      <div>
        <button
          type="button"
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #666",
            borderRadius: "0.25rem",
            fontWeight: 500,
            fontSize: "0.875rem",
            backgroundColor: "transparent",
            color: "#e0e0e0",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          💾 Save Draft
        </button>
      </div>
      <div>
        <button
          type="button"
          disabled={!canGoNext}
          onClick={onNext}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0.25rem",
            fontWeight: 500,
            fontSize: "0.875rem",
            backgroundColor: "#8b0000",
            color: "white",
            cursor: canGoNext ? "pointer" : "not-allowed",
            opacity: canGoNext ? 1 : 0.5,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (canGoNext) {
              e.currentTarget.style.backgroundColor = "#5e0000";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#8b0000";
          }}
        >
          {isLastStep ? "✓ Finish" : "Next →"}
        </button>
      </div>
    </footer>
  );
}
