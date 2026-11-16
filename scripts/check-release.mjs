// Checks what a release would publish: the bundle hacs.json names, the manifest
// the Marketplace reads, and the README the Marketplace page shows. It also
// notices a bundle that was not rebuilt after its sources changed, because the
// bundle in dist/ is committed and is what gets published.
//
//   GITHUB_DISTRIBUTION_REPOSITORY=psym88/ha_alarmo-card-feature node scripts/check-release.mjs
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.dirname(path.dirname(fs.realpathSync(import.meta.filename)));
const problems = [];
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const git = (args) => {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};

let manifest;
try {
  manifest = JSON.parse(read("hacs.json"));
} catch (error) {
  console.error(`hacs.json does not read as JSON: ${error.message}`);
  process.exit(1);
}

if (typeof manifest.name !== "string" || manifest.name.trim() === "") {
  problems.push("hacs.json has no name, the Marketplace would show an empty entry.");
}
const bundleName = manifest.filename;
if (typeof bundleName !== "string" || !bundleName.endsWith(".js")) {
  problems.push(`hacs.json has no filename ending in .js, it says ${JSON.stringify(bundleName)}.`);
}
if (manifest.homeassistant !== undefined && !/^\d{4}\.\d{1,2}\.\d+$/.test(String(manifest.homeassistant))) {
  problems.push(`homeassistant in hacs.json is ${JSON.stringify(manifest.homeassistant)}, expected 2026.5.0.`);
}

// Where the bundle sits beside hacs.json, under dist/ when it is built.
let bundle = "";
for (const candidate of [bundleName, `themes/${bundleName}`, `dist/${bundleName}`]) {
  if (typeof bundleName === "string" && exists(candidate)) {
    bundle = candidate;
    break;
  }
}
if (typeof bundleName === "string" && bundle === "") {
  problems.push(`hacs.json names ${bundleName}, which is in neither place a release looks in.`);
}

if (bundle !== "") {
  let parsed = "";
  try {
    execFileSync(process.execPath, ["--check", bundle], {
      cwd: root,
      stdio: ["ignore", "ignore", "pipe"],
    });
  } catch (error) {
    const firstLine = (error.stderr ?? "").toString().split("\n").find((line) => line.trim() !== "");
    parsed = firstLine ?? error.message;
  }
  if (parsed !== "") {
    problems.push(`${bundle} does not parse as JavaScript: ${parsed}`);
  }
  if (bundle.includes("dist/")) {
    // A committed bundle only says something about the sources when it was built
    // from them. The newer of the two commits is what was published last.
    const bundleCommit = git(["log", "-1", "--format=%ct", "--", bundle]);
    const sourceCommit = git(["log", "-1", "--format=%ct", "--", "src"]);
    if (bundleCommit !== "" && sourceCommit !== "" && Number(sourceCommit) > Number(bundleCommit)) {
      problems.push(
        `src/ changed after ${bundle} was last committed, so the published bundle is not what the sources build. Run npm run build and commit dist/.`,
      );
    }
  }
}

const readme = read("README.md");
const distribution = process.env.GITHUB_DISTRIBUTION_REPOSITORY;
if (!distribution) {
  console.error("GITHUB_DISTRIBUTION_REPOSITORY is not set, so the README link was not checked.");
  process.exit(1);
}
const [owner, repository] = distribution.split("/");
const badge = `https://my.home-assistant.io/redirect/hacs_repository/?owner=${owner}&repository=${repository}&category=plugin`;
if (!readme.includes(badge)) {
  problems.push(`README.md has no Marketplace badge for ${distribution}, it should carry ${badge}`);
}
for (const link of readme.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
  const target = link[1].trim();
  if (/^https?:/.test(target)) continue;
  if (!exists(target.split("#")[0])) {
    problems.push(`README.md shows ${target}, which is not in the repository.`);
  }
}

if (problems.length > 0) {
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(`${manifest.name} publishes ${bundle} to ${distribution}.`);
