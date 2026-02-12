#!/usr/bin/env node

import { execSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectName = process.argv[2];

if (!projectName) {
  console.error("Usage: create-square-app <project-name>");
  process.exit(1);
}

const targetDir = resolve(process.cwd(), projectName);

if (existsSync(targetDir)) {
  console.error(`Error: Directory "${projectName}" already exists.`);
  process.exit(1);
}

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const templateDir = join(__dirname, "..", "template");

// 1. Copy template to target directory
console.log(`Creating project in ${targetDir}...`);
cpSync(templateDir, targetDir, { recursive: true });

// 2. Rename gitignore -> .gitignore
const gitignoreSrc = join(targetDir, "gitignore");
const gitignoreDest = join(targetDir, ".gitignore");
if (existsSync(gitignoreSrc)) {
  renameSync(gitignoreSrc, gitignoreDest);
}

// 3. Update package.json name
const pkgPath = join(targetDir, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
pkg.name = basename(projectName);
delete pkg.private;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

// 4. Install dependencies
console.log("Installing dependencies...");
try {
  execSync("pnpm install", { cwd: targetDir, stdio: "inherit" });
} catch {
  console.warn("pnpm install failed. You can run it manually later.");
}

// 5. Initialize git
console.log("Initializing git repository...");
try {
  execSync("git init", { cwd: targetDir, stdio: "inherit" });
  execSync("git add -A", { cwd: targetDir, stdio: "inherit" });
  execSync('git commit -m "init :: create-square-app"', { cwd: targetDir, stdio: "inherit" });
} catch {
  console.warn("git init failed. You can initialize git manually.");
}

console.log(`
Done! Your project is ready.

  cd ${projectName}
  pnpm dev
`);
