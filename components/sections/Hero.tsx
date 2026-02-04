"use client";

import { motion } from "framer-motion";
import { scrollToSection } from "@/lib/scroll";
import { scrollIndicatorVariants } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const container = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  } : {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const fadeInUp = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  } : {
    hidden: { opacity: 0, y: 60, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const nameReveal = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  } : {
    hidden: { opacity: 0, y: 60, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="hero"
      className="h-full flex items-start md:items-center md:justify-center relative py-16"
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
          className="text-lg md:text-xl font-medium mb-4"
          style={{ color: "var(--text-muted)" }}
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
          className="text-2xl md:text-4xl font-semibold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          Full-Stack Developer & Creative Technologist
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={fadeInUp}
          className="text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
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
          <motion.button
            onClick={() => scrollToSection('projects')}
            whileHover={{
              backgroundColor: "#a34da6",
              boxShadow: "0 0 30px rgba(123, 51, 125, 0.4)",
            }}
            whileTap={{ scale: 0.98, backgroundColor: "#552357" }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="px-8 py-4 font-medium rounded-2xl shadow-md min-h-[48px]"
            style={{
              backgroundColor: "#7B337D",
              color: "#ffffff",
            }}
          >
            View My Work
          </motion.button>
          <motion.button
            onClick={() => scrollToSection('contact')}
            whileHover={{
              borderColor: "#a34da6",
              color: "#a34da6",
              boxShadow: "0 0 20px rgba(123, 51, 125, 0.2)",
            }}
            whileTap={{ scale: 0.98, borderColor: "#552357", color: "#552357" }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="px-8 py-4 border-2 font-medium rounded-2xl bg-transparent min-h-[48px]"
            style={{
              borderColor: "#7B337D",
              color: "#7B337D",
            }}
          >
            Get in Touch
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        variants={scrollIndicatorVariants}
        animate="animate"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        style={{ color: "var(--text-muted)" }}
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
