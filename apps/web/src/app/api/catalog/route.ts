import { NextResponse } from "next/server";
import path from "node:path";

import { buildCatalogIndex } from "@pen-paper-rpg/catalog";

export async function GET(): Promise<NextResponse> {
  const packsRoot = path.resolve(process.cwd(), "packs");
  const result = await buildCatalogIndex({ packRoots: [packsRoot] });

  return NextResponse.json(result.index, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
