"use client";

import { motion } from "framer-motion";
import { MapPin, Target, Briefcase, Globe, User } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import { scrollIndicatorVariants } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { personalInfo } from "@/data/personal";

export default function HeroAbout() {
  const prefersReducedMotion = useReducedMotion();

  const container = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.05, delayChildren: 0.1 },
        },
      }
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08, delayChildren: 0.1 },
        },
      };

  const fadeInUp = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { duration: 0.2 },
        },
      }
    : {
        hidden: { opacity: 0, y: 30, filter: "blur(2px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
        },
      };

  const nameReveal = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { duration: 0.2 },
        },
      }
    : {
        hidden: { opacity: 0, y: 30, filter: "blur(2px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
        },
      };

  const photoReveal = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { duration: 0.2 },
        },
      }
    : {
        hidden: { opacity: 0, scale: 0.95, filter: "blur(2px)" },
        show: {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
        },
      };

  // Map icon names from data to actual icon components
  const iconMap: Record<string, typeof MapPin> = {
    MapPin,
    Target,
    Briefcase,
    Globe,
  };

  const quickFacts = personalInfo.quickFacts.map((fact) => ({
    icon: iconMap[fact.icon],
    label: fact.label,
    value: fact.value,
  }));

  return (
    <section
      id="hero"
      className="min-h-[80vh] flex items-center justify-center relative py-16 md:py-20"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-6 md:px-12 w-full"
      >
        {/* MOBILE LAYOUT - Vertical Stack (Photo on Top) */}
        <div className="flex flex-col items-center md:hidden gap-8">
          {/* Photo - Mobile (280x280) */}
          <motion.div variants={photoReveal}>
            <div className="relative">
              <div
                className="w-[280px] h-[280px] rounded-3xl border-4 overflow-hidden"
                style={{
                  borderColor: "var(--bg-tertiary)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center gradient-bg">
                  <User className="w-32 h-32" style={{ color: "#ffffff" }} />
                </div>
              </div>
              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-3xl opacity-40"
                style={{
                  boxShadow: "0 0 40px rgba(123, 51, 125, 0.3)",
                  zIndex: -1,
                }}
              />
            </div>
          </motion.div>

          {/* Content - Mobile (Centered) */}
          <div className="text-center">
            {/* Name */}
            <motion.h1
              variants={nameReveal}
              className="text-5xl font-bold mb-4 gradient-text"
            >
              {personalInfo.name}
            </motion.h1>

            {/* Tagline */}
            <motion.h2
              variants={fadeInUp}
              className="text-2xl font-semibold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              {personalInfo.tagline}
            </motion.h2>

            {/* Merged Bio */}
            <motion.p
              variants={fadeInUp}
              className="text-base leading-relaxed mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              {personalInfo.bio}
            </motion.p>

            {/* Quick Facts - Mobile (2x2 Grid) */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {quickFacts.map((fact, index) => {
                const IconComponent = fact.icon;
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "var(--bg-tertiary)" }}
                    >
                      <IconComponent
                        className="w-5 h-5"
                        style={{ color: "var(--cta)" }}
                      />
                    </div>
                    <div className="text-center">
                      <p
                        className="text-xs font-medium"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {fact.label}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {fact.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* CTAs - Mobile (Stacked Vertically) */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col gap-4 items-center"
            >
              <motion.button
                onClick={() => scrollToSection("projects")}
                whileHover={{
                  boxShadow: "0 0 30px var(--cta-glow)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full px-8 py-4 font-medium rounded-2xl shadow-md min-h-[48px] cursor-pointer transition-all"
                style={{
                  backgroundColor: "var(--cta)",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--cta-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--cta)";
                }}
              >
                View My Work
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("contact")}
                whileHover={{
                  boxShadow: "0 0 20px var(--cta-glow)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full px-8 py-4 border-2 font-medium rounded-2xl bg-transparent min-h-[48px] cursor-pointer transition-all"
                style={{
                  borderColor: "var(--cta)",
                  color: "var(--cta)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--cta-hover)";
                  e.currentTarget.style.color = "var(--cta-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--cta)";
                  e.currentTarget.style.color = "var(--cta)";
                }}
              >
                Get in Touch
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* DESKTOP LAYOUT - Side by Side (Content Left, Photo Right) */}
        <div className="hidden md:grid md:grid-cols-[1fr_400px] gap-12 items-center">
          {/* Content - Desktop (Left) */}
          <div>
            {/* Name */}
            <motion.h1
              variants={nameReveal}
              className="text-7xl font-bold mb-6 gradient-text"
            >
              {personalInfo.name}
            </motion.h1>

            {/* Tagline */}
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-semibold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              {personalInfo.tagline}
            </motion.h2>

            {/* Merged Bio */}
            <motion.p
              variants={fadeInUp}
              className="text-lg leading-relaxed mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              {personalInfo.bio}
            </motion.p>

            {/* Quick Facts - Desktop (2x2 Grid) */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {quickFacts.map((fact, index) => {
                const IconComponent = fact.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "var(--bg-tertiary)" }}
                    >
                      <IconComponent
                        className="w-5 h-5"
                        style={{ color: "var(--cta)" }}
                      />
                    </div>
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
                  </div>
                );
              })}
            </motion.div>

            {/* CTAs - Desktop (Horizontal) */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-row gap-4"
            >
              <motion.button
                onClick={() => scrollToSection("projects")}
                whileHover={{
                  boxShadow: "0 0 30px var(--cta-glow)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="px-8 py-4 font-medium rounded-2xl shadow-md min-h-[48px] cursor-pointer transition-all"
                style={{
                  backgroundColor: "var(--cta)",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--cta-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--cta)";
                }}
              >
                View My Work
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("contact")}
                whileHover={{
                  boxShadow: "0 0 20px var(--cta-glow)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="px-8 py-4 border-2 font-medium rounded-2xl bg-transparent min-h-[48px] cursor-pointer transition-all"
                style={{
                  borderColor: "var(--cta)",
                  color: "var(--cta)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--cta-hover)";
                  e.currentTarget.style.color = "var(--cta-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--cta)";
                  e.currentTarget.style.color = "var(--cta)";
                }}
              >
                Get in Touch
              </motion.button>
            </motion.div>
          </div>

          {/* Photo - Desktop (400x400, Right) */}
          <motion.div variants={photoReveal}>
            <div className="relative">
              <div
                className="w-[400px] h-[400px] rounded-3xl border-4 overflow-hidden"
                style={{
                  borderColor: "var(--bg-tertiary)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center gradient-bg">
                  <User className="w-48 h-48" style={{ color: "#ffffff" }} />
                </div>
              </div>
              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-3xl opacity-40"
                style={{
                  boxShadow: "0 0 40px rgba(123, 51, 125, 0.3)",
                  zIndex: -1,
                }}
              />
            </div>
          </motion.div>
        </div>
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
