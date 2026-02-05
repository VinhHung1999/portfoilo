import { Project } from "./types";

export const projects: Project[] = [
  {
    id: "1",
    title: "AI Multi-Agent System",
    description: "Built a multi-agent system using LangChain where AI agents collaborate autonomously. Features include task delegation, inter-agent communication, and real-time progress tracking.",
    thumbnail: "Bot",
    tags: ["Python", "LangChain", "FastAPI", "React", "TypeScript"],
    link: "https://example.com",
    github: "https://github.com/hungson175/ai-multi-agent",
  },
  {
    id: "2",
    title: "Portfolio Website",
    description: "Interactive portfolio website built with Next.js 14, featuring scroll-snap pagination, progressive reveal animations, and a sophisticated Deep Space Violet design system.",
    thumbnail: "Palette",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    id: "3",
    title: "E-Commerce Platform",
    description: "Complete e-commerce solution with product catalog, shopping cart, secure checkout, and payment processing. Admin dashboard for inventory management.",
    thumbnail: "ShoppingBag",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
    link: "https://example.com",
  },
];
