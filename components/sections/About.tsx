"use client";

import { motion } from "framer-motion";

export default function About() {
  const sectionReveal = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const photoReveal = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const textReveal = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const factItem = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const quickFacts = [
    { icon: "📍", label: "Location", value: "Ho Chi Minh City, Vietnam" },
    { icon: "🎯", label: "Focus", value: "Full-Stack Development, AI/ML" },
    { icon: "💼", label: "Status", value: "Open to opportunities" },
    { icon: "🌐", label: "Languages", value: "Vietnamese, English" },
  ];

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center py-24 px-6 md:px-12"
    >
      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-6xl w-full grid md:grid-cols-[300px_1fr] gap-12 items-center"
      >
        {/* Photo */}
        <motion.div variants={photoReveal} className="mx-auto md:mx-0">
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
                  background: "linear-gradient(135deg, #64ffda 0%, #5ccfb8 100%)",
                }}
              >
                <span className="text-6xl md:text-8xl">👨‍💻</span>
              </div>
            </div>
            {/* Optional glow effect */}
            <div
              className="absolute inset-0 rounded-3xl opacity-40"
              style={{
                boxShadow: "0 0 40px rgba(100, 255, 218, 0.3)",
                zIndex: -1,
              }}
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={textReveal} className="space-y-6">
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
            variants={sectionReveal}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6"
          >
            {quickFacts.map((fact, index) => (
              <motion.div
                key={index}
                variants={factItem}
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
