/**
 * TypeScript wrapper for Word character sheet generation
 */

import { execAsync } from "./exec-async";
import { promises as fs } from "fs";
import path from "path";
import type { Character } from "@pen-paper-rpg/schemas";
import type { CatalogLookup } from "@pen-paper-rpg/engine";

export interface CharacterWordData {
  character: Character;
  catalogLookup?: CatalogLookup;
  outputPath: string;
}

export async function generateCharacterWord(data: CharacterWordData): Promise<string> {
  const { character, catalogLookup, outputPath } = data;

  // Create temp directory for intermediate files
  const tempDir = path.join(process.cwd(), "temp", "word-generation");
  await fs.mkdir(tempDir, { recursive: true });

  // Write character data to temp JSON file
  const characterDataPath = path.join(tempDir, "character-data.json");
  await fs.writeFile(
    characterDataPath,
    JSON.stringify(
      {
        character,
        catalogLookup: catalogLookup
          ? {
              byId: Array.from(catalogLookup.byId.entries()),
            }
          : null,
      },
      null,
      2
    ),
    "utf-8"
  );

  // Execute Node.js script (not Python - uses docx library)
  const scriptPath = path.join(process.cwd(), "scripts", "generate-character-word.js");
  const { stdout, stderr } = await execAsync(
    `node "${scriptPath}" "${characterDataPath}" "${outputPath}"`
  );

  if (stderr) {
    console.error("Word generation stderr:", stderr);
  }

  if (stdout) {
    console.log("Word generation stdout:", stdout);
  }

  return outputPath;
}
