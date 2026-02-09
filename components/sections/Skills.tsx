"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { sectionVariants, viewportConfig } from "@/lib/animations";
import { skillCategories as defaultData } from "@/data/skills";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { SkillCategory } from "@/data/types";

/** Determine grid span based on skill count */
function getCardSpan(skillCount: number): string {
  if (skillCount >= 5) return "col-span-2 row-span-2";
  if (skillCount >= 3) return "col-span-2 md:col-span-1 row-span-2";
  return "col-span-1 row-span-1";
}

export default function Skills({ data }: { data?: SkillCategory[] }) {
  const skillCategories = data ?? defaultData;
  const ref = useRef(null);
  const isInView = useInView(ref, viewportConfig);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="skills"
      className="flex flex-col py-16 md:py-20 md:items-center md:justify-center px-6 md:px-12"
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

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-min">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.category}
              className={`${getCardSpan(category.skills.length)} rounded-2xl border p-5 transition-all cursor-default`}
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.9, y: 20 }
              }
              animate={
                isInView
                  ? { opacity: 1, scale: 1, y: 0 }
                  : prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.9, y: 20 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0.2 }
                  : { duration: 0.5, delay: catIndex * 0.06, ease: [0.16, 1, 0.3, 1] }
              }
              whileHover={{
                y: -4,
                boxShadow: "0 12px 32px var(--cta-glow)",
                borderColor: "var(--cta)",
                transition: { duration: 0.2 },
              }}
            >
              {/* Category Name */}
              <h3
                className="text-xs uppercase tracking-wider font-semibold mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                {category.category}
              </h3>

              {/* Skill Pills */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
