"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Bot, Palette, ShoppingBag, Globe, Code, Smartphone, Database, Brain, Rocket, Layout, Heart, Mic, Terminal, Film, MessageSquare, BookOpen } from "lucide-react";
import { useTiltEffect } from "@/hooks/useTiltEffect";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";

const iconMap: Record<string, typeof Bot> = {
  Bot, Palette, ShoppingBag, Globe, Code, Smartphone, Database, Brain, Rocket, Layout, Heart, Mic, Terminal, Film, MessageSquare, BookOpen,
};
import { sectionVariants, itemVariants, viewportConfig } from "@/lib/animations";
import { projects as defaultData } from "@/data/projects";
import { Project } from "@/data/types";

/** 3D Tilt Card Wrapper (P0-3) */
function TiltCard({
  children,
  disabled,
  ...motionProps
}: {
  children: React.ReactNode;
  disabled: boolean;
} & React.ComponentProps<typeof motion.div>) {
  const { ref, tiltStyle, glowStyle, handlers } = useTiltEffect(8);

  if (disabled) {
    return <motion.div {...motionProps}>{children}</motion.div>;
  }

  return (
    <div style={{ perspective: "1000px" }}>
      <motion.div
        ref={ref}
        {...motionProps}
        style={{ ...motionProps.style, ...tiltStyle }}
        {...handlers}
      >
        {/* Radial glow overlay */}
        <div style={glowStyle} />
        {children}
      </motion.div>
    </div>
  );
}

export default function Projects({ data }: { data?: Project[] }) {
  const projects = data ?? defaultData;
  const ref = useRef(null);
  const isInView = useInView(ref, viewportConfig);

  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const tiltDisabled = isMobile || prefersReducedMotion;

  const [activeFilter, setActiveFilter] = useState<"all" | "web" | "mobile" | "ai">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const closeModal = useCallback(() => setSelectedProject(null), []);

  // BUG #1 fix: Close modal on Escape key
  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, closeModal]);

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
        className="flex flex-col py-16 md:py-20 md:items-center md:justify-center px-6 md:px-12 overflow-hidden"
        style={{ backgroundColor: "var(--bg-alternate)" }}
      >
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl w-full"
        >
          {/* Header */}
          <div className="text-center mb-6 md:mb-12">
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
                  className="px-6 py-2 rounded-full text-sm font-medium transition-all capitalize cursor-pointer"
                  style={{
                    backgroundColor:
                      activeFilter === filter ? "var(--cta)" : "transparent",
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
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <TiltCard
                  key={project.id}
                  disabled={tiltDisabled}
                  custom={index}
                  variants={cardVariantsWithDelay}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={tiltDisabled ? {
                    boxShadow: "0 20px 40px var(--cta-glow)",
                    transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
                  } : undefined}
                  onClick={() => setSelectedProject(project)}
                  className="rounded-2xl border cursor-pointer overflow-hidden group relative"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--cta)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  }}
                >
                  {/* Image with zoom effect */}
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] }
                    }}
                    className="aspect-video flex items-center justify-center rounded-lg overflow-hidden gradient-bg"
                  >
                    {project.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      (() => { const Icon = iconMap[project.thumbnail]; return Icon ? <Icon className="w-20 h-20 text-white" /> : null; })()
                    )}
                  </motion.div>

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
                            color: "var(--cta)",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button
                      className="text-sm font-medium"
                      style={{ color: "var(--cta)" }}
                    >
                      View Project →
                    </button>
                  </div>
                </TiltCard>
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
                    className="aspect-video flex items-center justify-center rounded-xl mb-6 gradient-bg overflow-hidden"
                  >
                    {selectedProject.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={selectedProject.thumbnailUrl} alt={selectedProject.title} className="w-full h-full object-cover" />
                    ) : (
                      (() => { const Icon = iconMap[selectedProject.thumbnail]; return Icon ? <Icon className="w-32 h-32 text-white" /> : null; })()
                    )}
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
                            color: "var(--cta)",
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
                      <motion.a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{
                          boxShadow: "0 0 20px var(--cta-glow)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 rounded-lg font-medium cursor-pointer transition-all"
                        style={{
                          backgroundColor: "var(--cta)",
                          color: "#ffffff",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--cta-hover)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--cta)";
                        }}
                      >
                        Live Demo →
                      </motion.a>
                    )}
                    {selectedProject.codeUrl && (
                      <motion.a
                        href={selectedProject.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{
                          boxShadow: "0 0 20px var(--cta-glow)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 rounded-lg font-medium border cursor-pointer transition-all"
                        style={{
                          borderColor: "var(--cta)",
                          color: "var(--cta)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--cta-hover)";
                          e.currentTarget.style.color = "var(--cta-hover)";
                          e.currentTarget.style.backgroundColor = "var(--cta-glow)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--cta)";
                          e.currentTarget.style.color = "var(--cta)";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        View Code →
                      </motion.a>
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
