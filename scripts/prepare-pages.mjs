import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "out");
const target = path.join(root, "docs");
await readdir(output); // Fail before changing the previous export if build output is missing.
await mkdir(target, { recursive: true });
for (const entry of await readdir(target)) {
  if (entry !== "design.md") await rm(path.join(target, entry), { recursive: true, force: true });
}
await cp(output, target, { recursive: true });
await writeFile(path.join(target, ".nojekyll"), "");
await writeFile(path.join(target, "CNAME"), "www.ivanmanchev.com\n");
console.log("GitHub Pages export prepared in docs/.");
