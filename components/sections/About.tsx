"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { sectionVariants, itemVariants, viewportConfig } from "@/lib/animations";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportConfig);

  const quickFacts = [
    { icon: "📍", label: "Location", value: "Ho Chi Minh City, Vietnam" },
    { icon: "🎯", label: "Focus", value: "Full-Stack Development, AI/ML" },
    { icon: "💼", label: "Status", value: "Open to opportunities" },
    { icon: "🌐", label: "Languages", value: "Vietnamese, English" },
  ];

  return (
    <section
      id="about"
      className="h-full flex flex-col py-16 md:py-0 md:items-center md:justify-center px-6 md:px-12"
    >
      <motion.div
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-6xl w-full grid md:grid-cols-[300px_1fr] gap-12 items-center"
      >
        {/* Photo */}
        <motion.div variants={itemVariants} className="mx-auto md:mx-0">
          <div className="relative">
            <div
              className="w-52 h-52 md:w-72 md:h-72 rounded-3xl border-4 overflow-hidden"
              style={{
                borderColor: "var(--bg-tertiary)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              {/* Placeholder - Replace with actual photo */}
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #7B337D 0%, #552357 100%)",
                }}
              >
                <span className="text-6xl md:text-8xl">👨‍💻</span>
              </div>
            </div>
            {/* Optional glow effect */}
            <div
              className="absolute inset-0 rounded-3xl opacity-40"
              style={{
                boxShadow: "0 0 40px rgba(123, 51, 125, 0.3)",
                zIndex: -1,
              }}
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            About Me
          </h2>

          <div
            className="space-y-6 text-base md:text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            <p>
              I&apos;m a full-stack developer based in Vietnam with a passion
              for creating interactive digital experiences. With several years
              of experience in web development, I specialize in building modern
              applications using React, Next.js, and AI technologies.
            </p>

            <p>
              I believe great software combines clean code with thoughtful
              design. When I&apos;m not coding, you&apos;ll find me exploring
              new technologies, contributing to open source, or learning about
              AI and machine learning.
            </p>
          </div>

          {/* Quick Facts */}
          <motion.div
            variants={sectionVariants}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6"
          >
            {quickFacts.map((fact, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start gap-3"
              >
                <span className="text-2xl">{fact.icon}</span>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {fact.label}
                  </p>
                  <p
                    className="text-base"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {fact.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
