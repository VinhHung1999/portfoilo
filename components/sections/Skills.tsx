"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { sectionVariants, viewportConfig } from "@/lib/animations";
import { skillCategories as defaultData } from "@/data/skills";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCountUp } from "@/hooks/useCountUp";
import type { SkillCategory, SkillItem } from "@/data/types";

/** Normalize skill data: support both string[] and SkillItem[] formats */
function normalizeSkill(skill: string | SkillItem, index: number): SkillItem {
  if (typeof skill === "string") {
    return { name: skill, proficiency: Math.max(50, 90 - index * 5) };
  }
  return skill;
}

/** Single skill bar with animated fill + counter */
function SkillBar({
  skill,
  inView,
  delay,
  prefersReducedMotion,
}: {
  skill: SkillItem;
  inView: boolean;
  delay: number;
  prefersReducedMotion: boolean;
}) {
  const count = useCountUp(skill.proficiency, inView && !prefersReducedMotion, delay);
  const displayValue = prefersReducedMotion ? skill.proficiency : count;

  return (
    <div className="flex items-center gap-3">
      {/* Bar container */}
      <div className="flex-1 relative" style={{ height: 32, borderRadius: "var(--radius-full)", backgroundColor: "var(--bg-tertiary)" }}>
        {/* Skill name inside bar */}
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-medium z-[2]"
          style={{ color: "var(--text-primary)" }}
        >
          {skill.name}
        </span>
        {/* Animated fill */}
        <motion.div
          className="absolute inset-y-0 left-0 skill-bar-fill"
          style={{
            borderRadius: "var(--radius-full)",
            background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-end))",
          }}
          initial={{ width: "0%" }}
          animate={inView ? { width: `${skill.proficiency}%` } : { width: "0%" }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }
          }
        />
      </div>
      {/* Percentage counter */}
      <span
        className="text-[13px] font-semibold w-10 text-right tabular-nums"
        style={{ color: "var(--cta)" }}
      >
        {displayValue}%
      </span>
    </div>
  );
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

        {/* Category Cards with Progress Bars */}
        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, catIndex) => {
            const normalizedSkills = category.skills.map((s, i) => normalizeSkill(s, i));
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.2 }
                    : { duration: 0.5, delay: catIndex * 0.15, ease: [0.16, 1, 0.3, 1] }
                }
                className="rounded-2xl border p-6"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Category Title */}
                <h3
                  className="text-sm uppercase tracking-wider font-semibold mb-4"
                  style={{ color: "var(--text-muted)" }}
                >
                  {category.category}
                </h3>

                {/* Skill Bars */}
                <div className="flex flex-col gap-2.5">
                  {normalizedSkills.map((skill, skillIndex) => (
                    <SkillBar
                      key={skill.name}
                      skill={skill}
                      inView={isInView}
                      delay={catIndex * 0.15 + skillIndex * 0.08}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
