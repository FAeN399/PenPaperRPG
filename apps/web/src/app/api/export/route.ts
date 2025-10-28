import { NextRequest, NextResponse } from "next/server";
import { exportCharacter } from "@/lib/character-export";
import type { Character } from "@pen-paper-rpg/schemas";
import path from "path";
import fs from "fs-extra";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { character, format, catalogLookup } = body;

    if (!character || !format) {
      return NextResponse.json(
        { error: "Missing required fields: character, format" },
        { status: 400 }
      );
    }

    if (!["pdf", "excel", "word"].includes(format)) {
      return NextResponse.json(
        { error: "Invalid format. Must be pdf, excel, or word" },
        { status: 400 }
      );
    }

    // Create exports directory in public folder for client access
    const exportsDir = path.join(process.cwd(), "public", "exports");
    await fs.ensureDir(exportsDir);

    // Generate character name for filename
    const characterName = character.metadata.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const timestamp = Date.now();
    const extension = format === "excel" ? "xlsx" : format === "word" ? "docx" : "pdf";
    const filename = `${characterName}_${timestamp}.${extension}`;
    const outputPath = path.join(exportsDir, filename);

    // Export the character
    const result = await exportCharacter({
      character: character as Character,
      catalogLookup,
      format: format as "pdf" | "excel" | "word",
      outputDir: exportsDir,
      filename,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Export failed" },
        { status: 500 }
      );
    }

    // Return the public URL for download
    const downloadUrl = `/exports/${filename}`;

    return NextResponse.json({
      success: true,
      downloadUrl,
      filename,
      format,
    });
  } catch (error) {
    console.error("Export API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
