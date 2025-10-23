interface ErrorFallbackProps {
  title: string;
  message: string;
}

export function ErrorFallback({ title, message }: ErrorFallbackProps): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          padding: "2rem",
          border: "1px solid #fca5a5",
          borderRadius: "0.5rem",
          backgroundColor: "#fef2f2",
        }}
      >
        <h2 style={{ margin: "0 0 1rem 0", color: "#dc2626", fontSize: "1.5rem" }}>{title}</h2>
        <p style={{ margin: 0, color: "#991b1b", lineHeight: 1.5 }}>{message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0.375rem",
            backgroundColor: "#dc2626",
            color: "#ffffff",
            fontSize: "0.875rem",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
