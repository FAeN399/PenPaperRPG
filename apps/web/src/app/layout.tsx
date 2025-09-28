import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "PenPaperRPG",
  description: "PF2e Remaster character creation and leveling toolkit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
