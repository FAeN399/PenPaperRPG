import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const schemasDist = path.join(repoRoot, "packages", "schemas", "dist");
const nodeModulesDir = path.join(repoRoot, "node_modules");
const targetDir = path.join(nodeModulesDir, "@pen-paper-rpg", "schemas");

async function main() {
  try {
    const stat = await fs.stat(schemasDist);
    if (!stat.isDirectory()) {
      console.error(`Expected dist directory at ${schemasDist}`);
      process.exitCode = 1;
      return;
    }
  } catch (error) {
    console.error(`Schemas dist directory missing. Have you run pnpm --dir packages/schemas run build?`);
    process.exitCode = 1;
    return;
  }

  await fs.mkdir(targetDir, { recursive: true });

  const pkg = {
    name: "@pen-paper-rpg/schemas",
    version: "0.1.0",
    type: "module",
    main: "./index.js",
    types: "./index.d.ts",
  };

  await fs.writeFile(path.join(targetDir, "package.json"), JSON.stringify(pkg, null, 2), "utf8");

  async function copyDistEntry(entry) {
    const source = path.join(schemasDist, entry);
    const dest = path.join(targetDir, entry);
    const entryStat = await fs.stat(source);
    if (entryStat.isDirectory()) {
      await fs.mkdir(dest, { recursive: true });
      const children = await fs.readdir(source);
      for (const child of children) {
        await copyDistEntry(path.join(entry, child));
      }
    } else {
      await fs.copyFile(source, dest);
    }
  }

  const distEntries = await fs.readdir(schemasDist);
  for (const entry of distEntries) {
    await copyDistEntry(entry);
  }

  console.log(`Synced schemas dist → ${targetDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
