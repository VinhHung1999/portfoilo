import { readFile } from "fs/promises";
import { list } from "@vercel/blob";
import path from "path";
import type { PersonalInfo, Experience, Project, SkillCategory, Achievement } from "@/data/types";

const RESOURCES = ["personal", "experience", "projects", "skills", "achievements"] as const;
type Resource = (typeof RESOURCES)[number];

/** Read a resource from Vercel Blob first, fallback to local content/*.json */
async function readResource(resource: Resource): Promise<unknown> {
  // Try Vercel Blob first
  try {
    const blobKey = `content/${resource}.json`;
    const { blobs } = await list({ prefix: blobKey });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { next: { revalidate: 0 } });
      if (res.ok) {
        return await res.json();
      }
    }
  } catch {
    // Blob not available (e.g. local dev without token), fall through
  }

  // Fallback to local filesystem
  const filePath = path.join(process.cwd(), "content", `${resource}.json`);
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content);
}

/** Fetch all portfolio content (server-side only) */
export async function getPortfolioContent() {
  const [personal, experience, projects, skills, achievements] = await Promise.all([
    readResource("personal") as Promise<PersonalInfo>,
    readResource("experience") as Promise<Experience[]>,
    readResource("projects") as Promise<Project[]>,
    readResource("skills") as Promise<SkillCategory[]>,
    readResource("achievements") as Promise<Achievement[]>,
  ]);

  return { personal, experience, projects, skills, achievements };
}
