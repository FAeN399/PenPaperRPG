/**
 * TypeScript wrapper for Excel character sheet generation
 */

import { execAsync } from "./exec-async";
import { promises as fs } from "fs";
import path from "path";
import type { Character, CatalogLookup } from "@pen-paper-rpg/catalog";

export interface CharacterExcelData {
  character: Character;
  catalogLookup?: CatalogLookup;
  outputPath: string;
}

export async function generateCharacterExcel(data: CharacterExcelData): Promise<string> {
  const { character, catalogLookup, outputPath } = data;

  // Create temp directory for intermediate files
  const tempDir = path.join(process.cwd(), "temp", "excel-generation");
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
              byType: Array.from(catalogLookup.byType.entries()),
            }
          : null,
      },
      null,
      2
    ),
    "utf-8"
  );

  // Execute Python script
  const scriptPath = path.join(process.cwd(), "scripts", "generate-character-excel.py");
  const { stdout, stderr } = await execAsync(
    `python "${scriptPath}" "${characterDataPath}" "${outputPath}"`
  );

  if (stderr) {
    console.error("Excel generation stderr:", stderr);
  }

  if (stdout) {
    console.log("Excel generation stdout:", stdout);
  }

  return outputPath;
}
