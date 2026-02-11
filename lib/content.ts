import { readFile } from "fs/promises";
import path from "path";
import type { PersonalInfo, Experience, Project, SkillCategory, Achievement } from "@/data/types";

const RESOURCES = ["personal", "experience", "projects", "skills", "achievements"] as const;
type Resource = (typeof RESOURCES)[number];

/** Read a resource from local content/*.json */
async function readResource(resource: Resource): Promise<unknown> {
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
