/**
 * Shared animation variants for consistent motion across the portfolio
 * Sprint 3: Polish & Performance
 */

// Reduced motion variants (opacity-only, faster)
export const sectionVariantsReduced = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  }
};

export const itemVariantsReduced = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2
    }
  }
};

// Section wrapper - triggers on viewport entry
export const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.33, 1, 0.68, 1] as const,
      when: "beforeChildren" as const,
      staggerChildren: 0.08
    }
  }
};

// Content items (fade + slide up)
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    }
  }
};

// Title animations (larger slide)
export const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    }
  }
};

// Subtitle with delay
export const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.1,
      ease: [0.16, 1, 0.3, 1] as const,
    }
  }
};

// Card lift on hover — uses CSS .card-hover class for theme-aware glow
export const cardHoverVariants = {
  rest: {
    y: 0,
    boxShadow: "0 4px 12px var(--shadow-md-raw, rgba(0,0,0,0.1))"
  },
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] }
  }
};

// Image zoom on card hover
export const imageZoomVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] }
  }
};

// Button hover/tap states — theme-aware via CSS variables
export const buttonVariants = {
  hover: {
    boxShadow: "0 0 20px var(--cta-glow)",
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Scroll indicator pulse
export const scrollIndicatorVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    y: [0, 5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    }
  }
};

// Viewport settings for useInView
// Mobile-friendly: Lower threshold, no margin shrink
export const viewportConfig = {
  once: true,
  amount: 0.1,  // Only need 10% visible (was 0.3)
  margin: "0px" as `${number}px`,  // No viewport shrink (was -50px)
};

// Helper to get variants based on reduced motion preference
export const getVariants = (prefersReducedMotion: boolean) => ({
  section: prefersReducedMotion ? sectionVariantsReduced : sectionVariants,
  item: prefersReducedMotion ? itemVariantsReduced : itemVariants,
});
