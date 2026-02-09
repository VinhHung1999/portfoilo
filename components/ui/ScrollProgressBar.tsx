"use client";

import { motion, useScroll } from "framer-motion";

/**
 * Sprint 11 P0-5: Global scroll progress bar
 * 3px gradient bar fixed at top of viewport, fills left-to-right with scroll
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        transformOrigin: "left",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 60,
        background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-end))",
        boxShadow: "0 0 8px var(--cta-glow)",
      }}
    />
  );
}
