"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { sectionVariants, itemVariants, viewportConfig } from "@/lib/animations";
import { skillCategories as defaultData } from "@/data/skills";
import type { SkillCategory } from "@/data/types";

export default function Skills({ data }: { data?: SkillCategory[] }) {
  const skillCategories = data ?? defaultData;
  const ref = useRef(null);
  const isInView = useInView(ref, viewportConfig);

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

        {/* Categories with simple bordered skills - no icons */}
        <div className="space-y-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div key={category.category} variants={itemVariants}>
              {/* Category Title */}
              <h3
                className="text-sm uppercase tracking-wider font-medium mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                {category.category}
              </h3>

              {/* Skills - Simple bordered tags */}
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={`${catIndex}-${skillIndex}`}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    className="px-4 py-2 rounded-lg border cursor-pointer transition-all"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--cta)";
                      e.currentTarget.style.color = "var(--cta)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    {skill}
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
