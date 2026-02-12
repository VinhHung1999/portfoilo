import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { fetchPinnedRepos, mapRepoToProject, GitHubApiError } from "@/lib/github";

const SETTINGS_PATH = path.join(process.cwd(), "content", "settings.json");

function checkAuth(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const cookieToken = request.cookies.get("admin_token")?.value;
  if (cookieToken === adminPassword) return true;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ") && authHeader.slice(7) === adminPassword)
    return true;

  return false;
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Read GitHub settings from content/settings.json
  let username: string;
  let token: string;
  try {
    const content = await readFile(SETTINGS_PATH, "utf-8");
    const settings = JSON.parse(content);
    username = settings.github?.username || "";
    token = settings.github?.token || "";
  } catch {
    return NextResponse.json(
      { error: "GitHub settings not found. Please configure in Admin → GitHub." },
      { status: 400 }
    );
  }

  if (!username.trim()) {
    return NextResponse.json(
      { error: "GitHub username not configured. Go to Admin → GitHub to set it up." },
      { status: 400 }
    );
  }

  if (!token.trim()) {
    return NextResponse.json(
      { error: "GitHub token not configured. Go to Admin → GitHub to add your personal access token." },
      { status: 400 }
    );
  }

  // Fetch pinned repos and map to projects
  try {
    const repos = await fetchPinnedRepos(username, token);

    if (repos.length === 0) {
      return NextResponse.json(
        { error: `No pinned repositories found for "${username}". Pin some repos on your GitHub profile first.` },
        { status: 404 }
      );
    }

    const projects = repos.map(mapRepoToProject);
    return NextResponse.json({ projects, count: projects.length });
  } catch (err) {
    if (err instanceof GitHubApiError) {
      const status =
        err.type === "auth" ? 401 :
        err.type === "not_found" ? 404 :
        err.type === "rate_limit" ? 429 :
        500;
      return NextResponse.json({ error: err.message }, { status });
    }
    return NextResponse.json(
      { error: "Unexpected error syncing GitHub repos." },
      { status: 500 }
    );
  }
}
