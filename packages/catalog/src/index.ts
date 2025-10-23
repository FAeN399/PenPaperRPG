import crypto from "node:crypto";
import path from "node:path";
import fg from "fast-glob";
import fs from "fs-extra";
import YAML from "yaml";
import {
  catalogIndexSchema,
  catalogPackSchema,
  contentEntitySchema,
  type CatalogIndex,
  type CatalogPackManifest,
  type ContentEntity,
} from "@pen-paper-rpg/schemas";

export type CatalogLoadError = {
  file: string;
  message: string;
  detail?: unknown;
};

export type CatalogLoadWarning = {
  file: string;
  message: string;
};

export interface BuildCatalogOptions {
  /** Absolute paths to pack root directories. */
  packRoots: string[];
  /** Optional override for the generated timestamp. */
  timestamp?: string;
}

export interface CatalogBuildResult {
  index: CatalogIndex;
  errors: CatalogLoadError[];
  warnings: CatalogLoadWarning[];
}

interface RawEntityDocument {
  document: unknown;
  file: string;
  packId: string;
  hash: string;
}

async function readPackManifest(packDir: string, packId: string): Promise<CatalogPackManifest> {
  const manifestPath = path.join(packDir, "pack.yaml");
  if (!(await fs.pathExists(manifestPath))) {
    return catalogPackSchema.parse({
      id: packId,
      name: packId,
    });
  }

  const raw = await fs.readFile(manifestPath, "utf8");
  const manifestDoc = YAML.parse(raw) ?? {};
  manifestDoc.id ??= packId;
  return catalogPackSchema.parse(manifestDoc);
}

async function loadRawDocuments(packDir: string, packId: string): Promise<RawEntityDocument[]> {
  const pattern = path.join(packDir, "**/*.yaml").replace(/\\/g, "/");
  const entries = await fg(pattern, { dot: false, onlyFiles: true });
  const documents: RawEntityDocument[] = [];

  for (const filePath of entries) {
    if (path.basename(filePath).toLowerCase() === "pack.yaml") {
      continue;
    }

    const raw = await fs.readFile(filePath, "utf8");
    const parsed = YAML.parseAllDocuments(raw).map((doc) => doc.toJSON());
    const relative = path.relative(packDir, filePath);
    const hash = hashContent(raw);

    if (parsed.length === 0) {
      documents.push({ document: {}, file: relative, packId, hash });
    }

    for (const doc of parsed) {
      documents.push({ document: doc, file: relative, packId, hash });
    }
  }

  return documents;
}

function hashContent(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function validateEntity(doc: RawEntityDocument): { entity?: ContentEntity; error?: CatalogLoadError } {
  const parsed = contentEntitySchema.safeParse(doc.document);
  if (!parsed.success) {
    return {
      error: {
        file: `${doc.packId}/${doc.file}`,
        message: "Failed to validate entity",
        detail: parsed.error.format(),
      },
    };
  }

  return {
    entity: parsed.data,
  };
}

function dedupeEntities(
  entities: Array<{ entity: ContentEntity; packId: string; hash: string; file: string }>,
  errors: CatalogLoadError[],
): Array<{ entity: ContentEntity; packId: string; hash: string; file: string }> {
  const seen = new Map<string, string>();
  const results: typeof entities = [];

  for (const entry of entities) {
    const existing = seen.get(entry.entity.id);
    if (existing) {
      errors.push({
        file: entry.file,
        message: `Duplicate entity id '${entry.entity.id}' also defined in ${existing}`,
      });
      continue;
    }

    seen.set(entry.entity.id, entry.file);
    results.push(entry);
  }

  return results;
}

export async function buildCatalogIndex(options: BuildCatalogOptions): Promise<CatalogBuildResult> {
  const errors: CatalogLoadError[] = [];
  const warnings: CatalogLoadWarning[] = [];
  const packMap = new Map<string, CatalogPackManifest>();
  const entityEntries: Array<{ entity: ContentEntity; packId: string; hash: string; file: string }> = [];

  for (const root of options.packRoots) {
    const resolvedRoot = path.resolve(root);
    if (!(await fs.pathExists(resolvedRoot))) {
      warnings.push({
        file: resolvedRoot,
        message: "Pack root missing, skipping",
      });
      continue;
    }

    const children = await fs.readdir(resolvedRoot, { withFileTypes: true });
    for (const entry of children) {
      if (!entry.isDirectory()) {
        continue;
      }
      const packId = entry.name;
      const packDir = path.join(resolvedRoot, packId);

      try {
        const manifest = await readPackManifest(packDir, packId);
        packMap.set(manifest.id, manifest);
      } catch (error) {
        errors.push({
          file: `${packId}/pack.yaml`,
          message: "Failed to parse pack manifest",
          detail: error,
        });
        continue;
      }

      const rawDocs = await loadRawDocuments(packDir, packId);
      for (const doc of rawDocs) {
        const { entity, error } = validateEntity(doc);
        if (error) {
          errors.push(error);
          continue;
        }
        if (!entity) {
          continue;
        }
        entityEntries.push({
          entity,
          packId,
          hash: doc.hash,
          file: `${packId}/${doc.file}`,
        });
      }
    }
  }

  const deduped = dedupeEntities(entityEntries, errors);
  const index: CatalogIndex = catalogIndexSchema.parse({
    packs: Object.fromEntries(packMap),
    entities: deduped.map(({ entity, packId, hash }) => ({ entity, packId, hash })),
    createdAt: options.timestamp ?? new Date().toISOString(),
  });

  return { index, errors, warnings };
}

export async function saveCatalogIndex(targetPath: string, result: CatalogBuildResult): Promise<void> {
  const payload = JSON.stringify(result.index, null, 2);
  await fs.ensureDir(path.dirname(targetPath));
  await fs.writeFile(targetPath, payload, "utf8");
}

