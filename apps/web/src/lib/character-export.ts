/**
 * Unified character sheet export service
 * Supports PDF, Excel, and Word document generation
 */

import path from "path";
import { promises as fs } from "fs";
import type { Character, CatalogLookup } from "@pen-paper-rpg/catalog";
import { generateCharacterPDF } from "./generate-character-pdf";
import { generateCharacterExcel } from "./generate-character-excel";
import { generateCharacterWord } from "./generate-character-word";

export type ExportFormat = "pdf" | "excel" | "word";

export interface CharacterExportOptions {
  character: Character;
  catalogLookup?: CatalogLookup;
  format: ExportFormat;
  outputDir?: string;
  filename?: string;
}

export interface CharacterExportResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

/**
 * Export a character sheet to the specified format
 */
export async function exportCharacter(
  options: CharacterExportOptions
): Promise<CharacterExportResult> {
  const { character, catalogLookup, format, outputDir, filename } = options;

  try {
    // Determine output directory and filename
    const baseDir = outputDir || path.join(process.cwd(), "exports");
    await fs.mkdir(baseDir, { recursive: true });

    const characterName = character.metadata.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const timestamp = new Date().toISOString().split("T")[0];

    let defaultFilename: string;
    let outputPath: string;

    switch (format) {
      case "pdf":
        defaultFilename = filename || `${characterName}_${timestamp}.pdf`;
        outputPath = path.join(baseDir, defaultFilename);
        await generateCharacterPDF({ character, catalogLookup, outputPath });
        break;

      case "excel":
        defaultFilename = filename || `${characterName}_${timestamp}.xlsx`;
        outputPath = path.join(baseDir, defaultFilename);
        await generateCharacterExcel({ character, catalogLookup, outputPath });
        break;

      case "word":
        defaultFilename = filename || `${characterName}_${timestamp}.docx`;
        outputPath = path.join(baseDir, defaultFilename);
        await generateCharacterWord({ character, catalogLookup, outputPath });
        break;

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    return {
      success: true,
      filePath: outputPath,
    };
  } catch (error) {
    console.error(`Failed to export character as ${format}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Export a character to multiple formats simultaneously
 */
export async function exportCharacterMultiple(
  character: Character,
  formats: ExportFormat[],
  catalogLookup?: CatalogLookup,
  outputDir?: string
): Promise<Record<ExportFormat, CharacterExportResult>> {
  const results: Partial<Record<ExportFormat, CharacterExportResult>> = {};

  await Promise.all(
    formats.map(async (format) => {
      const result = await exportCharacter({
        character,
        catalogLookup,
        format,
        outputDir,
      });
      results[format] = result;
    })
  );

  return results as Record<ExportFormat, CharacterExportResult>;
}

/**
 * Get the file extension for a given format
 */
export function getFileExtension(format: ExportFormat): string {
  switch (format) {
    case "pdf":
      return ".pdf";
    case "excel":
      return ".xlsx";
    case "word":
      return ".docx";
    default:
      return "";
  }
}

/**
 * Get a human-readable name for a format
 */
export function getFormatName(format: ExportFormat): string {
  switch (format) {
    case "pdf":
      return "PDF Document";
    case "excel":
      return "Excel Spreadsheet";
    case "word":
      return "Word Document";
    default:
      return "Unknown Format";
  }
}
