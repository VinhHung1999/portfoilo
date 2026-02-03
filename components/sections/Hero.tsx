"use client";

import { motion } from "framer-motion";

export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const nameReveal = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const bounce = {
    y: [0, 10, 0],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-6 md:px-12 text-center"
      >
        {/* Greeting */}
        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-[color:var(--text-muted)] font-medium mb-4"
        >
          Hi, I&apos;m
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={nameReveal}
          className="text-5xl md:text-7xl font-extrabold mb-6 gradient-text"
        >
          Hung Pham
        </motion.h1>

        {/* Tagline */}
        <motion.h2
          variants={fadeInUp}
          className="text-2xl md:text-4xl font-semibold text-[color:var(--text-primary)] mb-6"
        >
          Full-Stack Developer & Creative Technologist
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={fadeInUp}
          className="text-base md:text-lg text-[color:var(--text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          I craft interactive digital experiences that merge elegant design with
          robust engineering. Passionate about AI, web technologies, and
          building products that make a difference.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="#projects"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 gradient-bg text-white font-medium rounded-2xl shadow-md transition-all"
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{
              scale: 1.02,
              borderColor: "var(--accent-primary)",
              color: "var(--accent-primary)",
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 border-2 border-[color:var(--accent-primary)] text-[color:var(--text-primary)] font-medium rounded-2xl transition-all"
          >
            Get in Touch
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={bounce}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[color:var(--text-muted)]"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.div>
    </section>
  );
}
