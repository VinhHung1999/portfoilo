"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { sectionVariants, viewportConfig } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { experiences as defaultData } from "@/data/experience";
import type { Experience as ExperienceType } from "@/data/types";

export default function Experience({ data }: { data?: ExperienceType[] }) {
  const experiences = data ?? defaultData;
  const ref = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(ref, viewportConfig);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Scroll-driven timeline line (P0-4)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  // Alternating card variants (desktop: left/right, mobile: slide-up)
  const getCardVariants = (index: number) => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2, delay: index * 0.1 } },
      };
    }
    if (isMobile) {
      return {
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] as const },
        },
      };
    }
    // Desktop: alternate left/right
    const fromRight = index % 2 === 0;
    return {
      hidden: { opacity: 0, x: fromRight ? 60 : -60 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] as const },
      },
    };
  };

  // Dot variants with pulse
  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.15 + 0.2,
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="flex flex-col relative py-16 md:py-20"
    >
      <div className="px-6 md:px-12 flex flex-col">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl w-full mx-auto flex flex-col"
        >
          {/* Header */}
          <div className="text-center mb-8 flex-shrink-0">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Experience
            </h2>
            <p className="text-base" style={{ color: "var(--text-muted)" }}>
              My professional journey
            </p>
          </div>

          {/* Timeline */}
          <div className="relative pl-8 md:pl-16 pb-8">
            {/* Scroll-driven Timeline Line */}
            <motion.div
              className="absolute left-3 md:left-5 top-0 bottom-0 w-0.5"
              style={{
                background: prefersReducedMotion
                  ? "var(--bg-tertiary)"
                  : "linear-gradient(180deg, var(--gradient-start), var(--gradient-end))",
                scaleY: prefersReducedMotion ? 1 : lineScaleY,
                transformOrigin: "top",
                width: 2,
              }}
            />

            {/* Experience Items */}
            <motion.div variants={sectionVariants} className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  variants={getCardVariants(index)}
                  className="relative"
                >
                  {/* Enhanced Timeline Dot */}
                  <motion.div
                    custom={index}
                    variants={dotVariants}
                    className="absolute -left-[26px] md:-left-[34px] top-6 w-3 h-3 rounded-full"
                    style={{
                      background: isInView
                        ? "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))"
                        : "var(--bg-primary)",
                      border: "3px solid var(--cta)",
                      boxShadow: isInView ? "0 0 12px var(--cta-glow)" : "none",
                    }}
                  />

                  {/* Experience Card */}
                  <motion.div
                    whileHover={{
                      boxShadow: "0 0 20px var(--cta-glow)",
                      transition: { duration: 0.2 },
                    }}
                    className="rounded-2xl border p-6 md:p-8 transition-all"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--cta)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3
                          className="text-lg md:text-xl font-bold uppercase tracking-wide mb-1"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {exp.company}
                        </h3>
                        <p
                          className="text-base font-medium"
                          style={{ color: "var(--cta)" }}
                        >
                          {exp.role}
                        </p>
                      </div>
                      <p
                        className="text-sm mt-2 md:mt-0"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {exp.startDate} - {exp.endDate || "Present"}
                      </p>
                    </div>

                    {/* Achievements */}
                    <ul className="space-y-2 mb-6">
                      {exp.achievements.map((achievement, idx) => (
                        <li
                          key={idx}
                          className="text-sm md:text-base flex items-start gap-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <span style={{ color: "var(--cta)" }}>•</span>
                          <span className="leading-relaxed">{achievement}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {exp.techStack.map((tech) => (
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
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
