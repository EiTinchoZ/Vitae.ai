import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules/three/examples/jsm/libs/draco/gltf");
const target = join(root, "public/draco");

mkdirSync(target, { recursive: true });
for (const entry of readdirSync(source, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  copyFileSync(join(source, entry.name), join(target, entry.name));
  console.log(`Copied public/draco/${entry.name}`);
}
