import type { Project } from "@/data/types";

// GitHub GraphQL API endpoint
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

// GraphQL query to fetch pinned repositories
const PINNED_REPOS_QUERY = `
query($username: String!) {
  user(login: $username) {
    pinnedItems(first: 6, types: [REPOSITORY]) {
      nodes {
        ... on Repository {
          name
          description
          url
          homepageUrl
          primaryLanguage {
            name
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
          languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
            nodes {
              name
            }
          }
          stargazerCount
          createdAt
          updatedAt
        }
      }
    }
  }
}
`;

/** Raw repo data from GitHub GraphQL API */
export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  primaryLanguage: { name: string } | null;
  repositoryTopics: { nodes: { topic: { name: string } }[] };
  languages: { nodes: { name: string }[] };
  stargazerCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Error types for GitHub API calls */
export class GitHubApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public type?: "auth" | "not_found" | "rate_limit" | "network" | "unknown"
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

/**
 * Fetch pinned repositories for a GitHub user via GraphQL API.
 * Returns raw repo data for mapping to Project type.
 */
export async function fetchPinnedRepos(
  username: string,
  token: string
): Promise<GitHubRepo[]> {
  if (!username.trim()) {
    throw new GitHubApiError("GitHub username is required", undefined, "auth");
  }
  if (!token.trim()) {
    throw new GitHubApiError("GitHub token is required", undefined, "auth");
  }

  let res: Response;
  try {
    res = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: PINNED_REPOS_QUERY,
        variables: { username },
      }),
    });
  } catch {
    throw new GitHubApiError(
      "Network error: unable to reach GitHub API",
      undefined,
      "network"
    );
  }

  if (res.status === 401) {
    throw new GitHubApiError(
      "Invalid GitHub token. Please check your personal access token.",
      401,
      "auth"
    );
  }

  if (res.status === 403) {
    throw new GitHubApiError(
      "Rate limit exceeded or token lacks permissions.",
      403,
      "rate_limit"
    );
  }

  if (!res.ok) {
    throw new GitHubApiError(
      `GitHub API returned status ${res.status}`,
      res.status,
      "unknown"
    );
  }

  const json = await res.json();

  if (json.errors) {
    const msg = json.errors[0]?.message || "Unknown GraphQL error";
    if (msg.includes("Could not resolve to a User")) {
      throw new GitHubApiError(
        `GitHub user "${username}" not found.`,
        404,
        "not_found"
      );
    }
    throw new GitHubApiError(msg, undefined, "unknown");
  }

  const nodes = json.data?.user?.pinnedItems?.nodes;
  if (!nodes || nodes.length === 0) {
    return [];
  }

  return nodes as GitHubRepo[];
}

// --- Mapping helpers ---

/** Map common languages/topics to project categories */
const CATEGORY_MAP: Record<string, Project["category"]> = {
  // AI/ML
  python: "ai",
  jupyter: "ai",
  "machine-learning": "ai",
  "deep-learning": "ai",
  ai: "ai",
  llm: "ai",
  langchain: "ai",
  tensorflow: "ai",
  pytorch: "ai",
  // Mobile
  swift: "mobile",
  kotlin: "mobile",
  "react-native": "mobile",
  flutter: "mobile",
  ios: "mobile",
  android: "mobile",
  // Web (default)
  javascript: "web",
  typescript: "web",
  react: "web",
  nextjs: "web",
  vue: "web",
};

/** Map categories to default Lucide icon names */
const CATEGORY_ICON_MAP: Record<Project["category"], string> = {
  ai: "Brain",
  mobile: "Smartphone",
  web: "Globe",
};

/** Infer category from repo topics and languages */
function inferCategory(repo: GitHubRepo): Project["category"] {
  // Check topics first (more specific)
  const topics = repo.repositoryTopics.nodes.map((n) =>
    n.topic.name.toLowerCase()
  );
  for (const topic of topics) {
    if (CATEGORY_MAP[topic]) return CATEGORY_MAP[topic];
  }

  // Check primary language
  if (repo.primaryLanguage) {
    const lang = repo.primaryLanguage.name.toLowerCase();
    if (CATEGORY_MAP[lang]) return CATEGORY_MAP[lang];
  }

  // Check all languages
  for (const lang of repo.languages.nodes) {
    const key = lang.name.toLowerCase();
    if (CATEGORY_MAP[key]) return CATEGORY_MAP[key];
  }

  return "web";
}

/** Convert repo name to human-readable title (e.g., "my-cool-project" → "My Cool Project") */
function repoNameToTitle(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Build tech stack from languages and topics */
function buildTechStack(repo: GitHubRepo): string[] {
  const stack: string[] = [];

  // Add languages
  for (const lang of repo.languages.nodes) {
    stack.push(lang.name);
  }

  // Add well-known framework topics
  const frameworkTopics = [
    "react", "nextjs", "vue", "svelte", "angular", "django", "flask",
    "fastapi", "express", "nestjs", "tailwindcss", "docker", "kubernetes",
    "graphql", "postgresql", "mongodb", "redis", "aws", "langchain",
  ];
  for (const node of repo.repositoryTopics.nodes) {
    const topic = node.topic.name.toLowerCase();
    if (frameworkTopics.includes(topic) && !stack.some((s) => s.toLowerCase() === topic)) {
      // Capitalize framework names nicely
      stack.push(node.topic.name.charAt(0).toUpperCase() + node.topic.name.slice(1));
    }
  }

  return stack;
}

/**
 * Map a GitHub repo to the portfolio Project type.
 * Returns a Project with sensible defaults that can be edited before saving.
 */
export function mapRepoToProject(repo: GitHubRepo): Project {
  const category = inferCategory(repo);

  return {
    id: String(Date.now()) + "-" + repo.name.slice(0, 8),
    title: repoNameToTitle(repo.name),
    shortDescription: repo.description || "",
    fullDescription: repo.description || "",
    category,
    year: new Date(repo.createdAt).getFullYear(),
    thumbnail: CATEGORY_ICON_MAP[category],
    images: [],
    techStack: buildTechStack(repo),
    features: [],
    liveUrl: repo.homepageUrl || undefined,
    codeUrl: repo.url,
  };
}
