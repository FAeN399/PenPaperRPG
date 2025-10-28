/**
 * Generate a Pathfinder 2e Character Sheet PDF
 *
 * This module exports character data to a beautifully formatted PDF
 * using Python's reportlab library via a Node.js bridge.
 */

import type { Character } from "@pen-paper-rpg/schemas";
import type { CatalogLookup } from "@pen-paper-rpg/engine";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

interface CharacterPDFData {
  character: Character;
  catalogLookup?: CatalogLookup;
  outputPath: string;
}

/**
 * Generate a PDF character sheet
 */
export async function generateCharacterPDF(data: CharacterPDFData): Promise<string> {
  const { character, catalogLookup, outputPath } = data;

  // Create temp directory for intermediate files
  const tempDir = path.join(process.cwd(), "temp", "pdf-generation");
  await fs.mkdir(tempDir, { recursive: true });

  // Write character data to temp JSON file
  const characterDataPath = path.join(tempDir, "character-data.json");
  await fs.writeFile(
    characterDataPath,
    JSON.stringify({
      character,
      catalogLookup: catalogLookup ? {
        byId: Array.from(catalogLookup.byId.entries()),
      } : null,
    }),
    "utf-8"
  );

  // Path to Python script
  const scriptPath = path.join(process.cwd(), "scripts", "generate-character-sheet.py");

  // Execute Python script
  try {
    const { stdout, stderr } = await execAsync(
      `python "${scriptPath}" "${characterDataPath}" "${outputPath}"`
    );

    if (stderr) {
      console.error("PDF Generation stderr:", stderr);
    }

    console.log("PDF Generated:", stdout);

    // Clean up temp files
    await fs.unlink(characterDataPath);

    return outputPath;
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
