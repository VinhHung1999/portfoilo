"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Award, Star, Medal, Sparkles } from "lucide-react";
import { sectionVariants, itemVariants, viewportConfig } from "@/lib/animations";
import { achievements } from "@/data/achievements";

const iconMap = {
  trophy: Trophy,
  award: Award,
  star: Star,
  medal: Medal,
  sparkles: Sparkles,
};

export default function Achievements() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportConfig);

  return (
    <section
      id="achievements"
      className="flex flex-col py-16 md:py-20 px-6 md:px-12"
      style={{ backgroundColor: "var(--bg-alternate)" }}
    >
      <motion.div
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-6xl w-full mx-auto"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="mb-12 text-center">
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Achievements
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Recognition and milestones from my journey at MoMo
          </p>
        </motion.div>

        {/* Achievements Grid - Badge/Medal Showcase */}
        <motion.div
          variants={sectionVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {achievements.map((achievement, index) => {
            const IconComponent = iconMap[achievement.icon];
            return (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2 },
                }}
                className="p-6 rounded-2xl border-2 cursor-pointer transition-all"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--cta)";
                  e.currentTarget.style.boxShadow = "0 8px 24px var(--cta-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Icon Badge */}
                <div className="flex items-center justify-center mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)",
                    }}
                  >
                    <IconComponent className="w-8 h-8" style={{ color: "#ffffff" }} />
                  </div>
                </div>

                {/* Date Badge */}
                <div className="flex justify-center mb-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--cta)",
                    }}
                  >
                    {achievement.date}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold mb-2 text-center"
                  style={{ color: "var(--text-primary)" }}
                >
                  {achievement.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm text-center leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {achievement.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
