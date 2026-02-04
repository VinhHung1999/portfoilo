"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { sectionVariants, itemVariants, viewportConfig } from "@/lib/animations";

interface Skill {
  name: string;
  icon: string;
}

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: "⚛️" },
      { name: "Next.js", icon: "▲" },
      { name: "TypeScript", icon: "TS" },
      { name: "Vue.js", icon: "V" },
      { name: "Tailwind CSS", icon: "🎨" },
      { name: "Framer Motion", icon: "🎬" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: "📗" },
      { name: "Python", icon: "🐍" },
      { name: "FastAPI", icon: "⚡" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "Redis", icon: "🔴" },
      { name: "GraphQL", icon: "◈" },
    ],
  },
  {
    title: "AI/ML & Tools",
    skills: [
      { name: "LangChain", icon: "🦜" },
      { name: "OpenAI", icon: "🤖" },
      { name: "PyTorch", icon: "🔥" },
      { name: "Git", icon: "📦" },
      { name: "Docker", icon: "🐳" },
      { name: "AWS", icon: "☁️" },
    ],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportConfig);

  // Custom skill item with scale effect
  const skillItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="skills"
      className="h-full flex flex-col py-16 md:py-0 md:items-center md:justify-center px-6 md:px-12"
    >
      <motion.div
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-5xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-16">
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

        {/* Categories */}
        <div className="space-y-8">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              className="p-8 rounded-3xl"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              {/* Category Title */}
              <h3
                className="text-xs uppercase tracking-wider font-medium mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                {category.title}
              </h3>

              {/* Skills Grid */}
              <div className="flex flex-wrap justify-center gap-4">
                {category.skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    variants={skillItemVariants}
                    whileHover={{
                      y: -4,
                      borderColor: "#7B337D",
                      transition: { duration: 0.2 },
                    }}
                    className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl border"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      borderColor: "transparent",
                    }}
                  >
                    {/* Icon */}
                    <span className="text-3xl grayscale hover:grayscale-0 transition-all">
                      {skill.icon}
                    </span>

                    {/* Name */}
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
