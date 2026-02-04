"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { sectionVariants, itemVariants, cardHoverVariants, viewportConfig } from "@/lib/animations";

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: "web" | "mobile" | "ai";
  year: number;
  thumbnail: string;
  images: string[];
  techStack: string[];
  features: string[];
  liveUrl?: string;
  codeUrl?: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "AI Multi-Agent System",
    shortDescription: "Collaborative AI agents working together to solve complex tasks",
    fullDescription:
      "Built a multi-agent system using LangChain where AI agents collaborate autonomously. Features include task delegation, inter-agent communication, and real-time progress tracking.",
    category: "ai",
    year: 2024,
    thumbnail: "🤖",
    images: ["🤖"],
    techStack: ["Python", "LangChain", "FastAPI", "React", "TypeScript"],
    features: [
      "Autonomous agent collaboration with role-based task distribution",
      "Real-time progress monitoring and agent communication logs",
      "Scalable architecture supporting multiple concurrent agent teams",
    ],
    liveUrl: "https://example.com",
    codeUrl: "https://github.com",
  },
  {
    id: "2",
    title: "Portfolio Website",
    shortDescription: "Modern portfolio with Deep Space Violet theme and smooth animations",
    fullDescription:
      "Interactive portfolio website built with Next.js 14, featuring scroll-snap pagination, progressive reveal animations, and a sophisticated Deep Space Violet design system.",
    category: "web",
    year: 2024,
    thumbnail: "🎨",
    images: ["🎨"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    features: [
      "Pagination scroll with 100vh snap sections",
      "Progressive reveal animations with blur effects",
      "Professional motion design with refined easing",
    ],
  },
  {
    id: "3",
    title: "E-Commerce Platform",
    shortDescription: "Full-stack e-commerce with payment integration",
    fullDescription:
      "Complete e-commerce solution with product catalog, shopping cart, secure checkout, and payment processing. Admin dashboard for inventory management.",
    category: "web",
    year: 2023,
    thumbnail: "🛍️",
    images: ["🛍️"],
    techStack: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
    features: [
      "Secure payment processing with Stripe integration",
      "Real-time inventory management and order tracking",
      "Responsive design optimized for mobile shopping",
    ],
    liveUrl: "https://example.com",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportConfig);

  const [activeFilter, setActiveFilter] = useState<"all" | "web" | "mobile" | "ai">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  // Custom card variants with index-based delay
  const cardVariantsWithDelay = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <>
      <section
        id="projects"
        className="h-full flex items-center justify-center px-6 md:px-12 overflow-hidden"
      >
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl w-full"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Projects
            </h2>
            <p className="text-base" style={{ color: "var(--text-muted)" }}>
              Selected work I&apos;m proud of
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div
              className="inline-flex gap-2 p-2 rounded-full"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              {(["all", "web", "mobile", "ai"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="px-6 py-2 rounded-full text-sm font-medium transition-all capitalize"
                  style={{
                    backgroundColor:
                      activeFilter === filter ? "#7B337D" : "transparent",
                    color:
                      activeFilter === filter
                        ? "#ffffff"
                        : "var(--text-secondary)",
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Project Grid */}
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  custom={index}
                  variants={cardVariantsWithDelay}
                  initial="hidden"
                  animate="visible"
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 40px rgba(123, 51, 125, 0.2)",
                    transition: { duration: 0.3 },
                  }}
                  onClick={() => setSelectedProject(project)}
                  className="rounded-2xl border cursor-pointer overflow-hidden"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--bg-tertiary)",
                  }}
                >
                  {/* Image */}
                  <div
                    className="aspect-video flex items-center justify-center text-6xl rounded-lg overflow-hidden"
                    style={{ backgroundColor: "var(--bg-tertiary)" }}
                  >
                    {project.thumbnail}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="text-sm mb-4 line-clamp-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {project.shortDescription}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: "var(--bg-tertiary)",
                            color: "#7B337D",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      className="text-sm font-medium"
                      style={{ color: "#7B337D" }}
                    >
                      View Project →
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(8px)",
              }}
              onClick={() => setSelectedProject(null)}
            >
              {/* Modal */}
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={(e) => e.stopPropagation()}
                className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                {/* Close Button */}
                <div className="sticky top-0 z-10 p-6 flex justify-end"
                  style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-2xl"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ✕
                  </button>
                </div>

                <div className="px-8 pb-8">
                  {/* Image */}
                  <div
                    className="aspect-video flex items-center justify-center text-8xl rounded-xl mb-6"
                    style={{ backgroundColor: "var(--bg-tertiary)" }}
                  >
                    {selectedProject.thumbnail}
                  </div>

                  {/* Title */}
                  <h2
                    className="text-3xl font-bold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {selectedProject.title}
                  </h2>

                  {/* Category & Year */}
                  <div className="flex gap-4 mb-6">
                    <span
                      className="text-sm capitalize"
                      style={{ color: "var(--text-muted)" }}
                    >
                      [{selectedProject.category}]
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      [{selectedProject.year}]
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className="text-base leading-relaxed mb-6"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {selectedProject.fullDescription}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-6">
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Tech Stack:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-4 py-2 rounded-full text-sm"
                          style={{
                            backgroundColor: "var(--bg-tertiary)",
                            color: "#7B337D",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Key Features:
                    </h3>
                    <ul className="space-y-2">
                      {selectedProject.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-lg font-medium"
                        style={{
                          backgroundColor: "#7B337D",
                          color: "#ffffff",
                        }}
                      >
                        Live Demo →
                      </a>
                    )}
                    {selectedProject.codeUrl && (
                      <a
                        href={selectedProject.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-lg font-medium border"
                        style={{
                          borderColor: "#7B337D",
                          color: "#7B337D",
                        }}
                      >
                        View Code →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
