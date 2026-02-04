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
      ease: [0.33, 1, 0.68, 1], // ease-out-cubic
      when: "beforeChildren",
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
      ease: [0.16, 1, 0.3, 1] // ease-out-expo
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
      ease: [0.16, 1, 0.3, 1]
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
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

// Card lift on hover
export const cardHoverVariants = {
  rest: {
    y: 0,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 40px rgba(123, 51, 125, 0.15)",
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

// Button hover/tap states
export const buttonVariants = {
  hover: {
    backgroundColor: "#a34da6",
    boxShadow: "0 0 20px rgba(123, 51, 125, 0.3)",
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    backgroundColor: "#552357",
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
      ease: "easeInOut"
    }
  }
};

// Viewport settings for useInView
// Mobile-friendly: Lower threshold, no margin shrink
export const viewportConfig = {
  once: true,
  amount: 0.1,  // Only need 10% visible (was 0.3)
  margin: "0px"  // No viewport shrink (was -50px)
};

// Helper to get variants based on reduced motion preference
export const getVariants = (prefersReducedMotion: boolean) => ({
  section: prefersReducedMotion ? sectionVariantsReduced : sectionVariants,
  item: prefersReducedMotion ? itemVariantsReduced : itemVariants,
});
