/**
 * Build-time GitHub sync script.
 * Reads GitHub settings from content/settings.json,
 * fetches pinned repos, and merges with existing projects.
 *
 * Run: npx tsx scripts/sync-github.ts
 * Automatically runs as prebuild via package.json.
 *
 * Graceful skip: if no token, no settings, or any error → log warning, exit 0.
 * Build must NEVER fail due to this script.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { fetchPinnedRepos, mapRepoToProject } from "../lib/github";
import type { Project } from "../data/types";

const SETTINGS_PATH = path.join(process.cwd(), "content", "settings.json");
const PROJECTS_PATH = path.join(process.cwd(), "content", "projects.json");

function log(msg: string) {
  console.log(`[github-sync] ${msg}`);
}

function warn(msg: string) {
  console.warn(`[github-sync] ⚠ ${msg}`);
}

async function main() {
  // 1. Read settings
  if (!existsSync(SETTINGS_PATH)) {
    warn("No content/settings.json found. Skipping GitHub sync.");
    return;
  }

  let username: string;
  let token: string;
  try {
    const raw = readFileSync(SETTINGS_PATH, "utf-8");
    const settings = JSON.parse(raw);
    username = settings.github?.username || "";
    token = settings.github?.token || "";
  } catch {
    warn("Could not parse content/settings.json. Skipping GitHub sync.");
    return;
  }

  if (!username.trim() || !token.trim()) {
    log("GitHub username or token not configured. Skipping sync.");
    return;
  }

  // 2. Fetch pinned repos
  log(`Fetching pinned repos for ${username}...`);
  let repos;
  try {
    repos = await fetchPinnedRepos(username, token);
  } catch (err) {
    warn(`Failed to fetch repos: ${err instanceof Error ? err.message : err}. Skipping sync.`);
    return;
  }

  if (repos.length === 0) {
    log("No pinned repos found. Skipping sync.");
    return;
  }

  log(`Found ${repos.length} pinned repo(s).`);

  // 3. Read existing projects
  let existingProjects: Project[] = [];
  try {
    if (existsSync(PROJECTS_PATH)) {
      const raw = readFileSync(PROJECTS_PATH, "utf-8");
      existingProjects = JSON.parse(raw);
    }
  } catch {
    warn("Could not read existing projects.json. Starting fresh.");
  }

  // 4. Merge: add new repos that don't already exist (match by codeUrl)
  const existingCodeUrls = new Set(
    existingProjects
      .map((p) => p.codeUrl)
      .filter(Boolean)
      .map((url) => url!.toLowerCase())
  );

  const newProjects = repos
    .map(mapRepoToProject)
    .filter((p) => p.codeUrl && !existingCodeUrls.has(p.codeUrl.toLowerCase()));

  if (newProjects.length === 0) {
    log("All pinned repos already exist in projects. Nothing to add.");
    return;
  }

  // 5. Write merged projects
  const merged = [...existingProjects, ...newProjects];
  writeFileSync(PROJECTS_PATH, JSON.stringify(merged, null, 2) + "\n", "utf-8");
  log(`Added ${newProjects.length} new project(s). Total: ${merged.length}.`);
}

main().catch((err) => {
  warn(`Unexpected error: ${err instanceof Error ? err.message : err}. Skipping sync.`);
  // Exit 0 so build doesn't fail
  process.exit(0);
});
