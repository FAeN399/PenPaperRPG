import Link from "next/link";

const highlights = [
  "PF2e Remaster SRD content via YAML packs",
  "Rule-aware character builder and leveler",
  "Offline-ready web and desktop experiences",
];

export default function HomePage(): JSX.Element {
  return (
    <main style={{ padding: "2rem", maxWidth: "980px", margin: "0 auto" }}>
      <section>
        <h1 style={{ fontSize: "2.75rem", marginBottom: "1rem" }}>PenPaperRPG</h1>
        <p style={{ fontSize: "1.125rem", lineHeight: 1.5, maxWidth: "720px" }}>
          Build, validate, and level Pathfinder Second Edition Remaster characters with a local-first
          workflow. YAML packs hold SRD and homebrew data, while the rules engine keeps your sheet
          legal at every level.
        </p>
      </section>

      <section style={{ marginTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Roadmap Highlights</h2>
        <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", lineHeight: 1.7 }}>
          {highlights.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Getting Started</h2>
        <ol style={{ paddingLeft: "1.5rem", lineHeight: 1.7 }}>
          <li>Drop official or custom YAML packs into the <code>packs/</code> directory.</li>
          <li>Launch the desktop app or run <code>pnpm dev --filter web</code>.</li>
          <li>Create a character and level them up with rule-aware guidance.</li>
        </ol>
        <p style={{ marginTop: "1.5rem" }}>
          Explore the initial schemas and catalog loader in the monorepo packages, or open the
          documentation once it lands in the sidebar.
        </p>
        <Link href="https://github.com/" style={{ display: "inline-block", marginTop: "1rem" }}>
          View documentation (coming soon)
        </Link>
      </section>
    </main>
  );
}
