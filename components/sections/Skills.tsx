"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { sectionVariants, itemVariants, viewportConfig } from "@/lib/animations";

// Simplified flat skills list - no icons, no categories
const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Vue.js",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "Redis",
  "GraphQL",
  "LangChain",
  "OpenAI",
  "PyTorch",
  "Git",
  "Docker",
  "AWS",
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportConfig);

  return (
    <section
      id="skills"
      className="h-full flex flex-col py-16 md:py-32 md:items-center md:justify-center px-6 md:px-12"
    >
      <motion.div
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-5xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Skills
          </h2>
          <p className="text-base" style={{ color: "var(--text-muted)" }}>
            Technologies I work with
          </p>
        </div>

        {/* Simple flat skills grid - no icons, clean borders */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3"
        >
          {skills.map((skill) => (
            <motion.div
              key={skill}
              variants={itemVariants}
              whileHover={{
                borderColor: "#7B337D",
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              className="px-6 py-3 rounded-lg border"
              style={{
                borderColor: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
              }}
            >
              {skill}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
