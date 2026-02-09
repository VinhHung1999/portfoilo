"use client";

import { useRef, useState, useCallback } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
  glowX: number;
  glowY: number;
}

/**
 * 3D tilt effect hook for project cards
 * Returns ref, tilt style, glow style, and event handlers
 * Disabled on touch devices and when prefers-reduced-motion
 */
export function useTiltEffect(maxAngle: number = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rotateX = ((mouseY - centerY) / centerY) * -maxAngle;
    const rotateY = ((mouseX - centerX) / centerX) * maxAngle;
    setTilt({ rotateX, rotateY, glowX: mouseX, glowY: mouseY });
  }, [maxAngle]);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  }, []);

  const tiltStyle: React.CSSProperties = {
    transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovering ? 1.02 : 1})`,
    transition: isHovering ? "transform 100ms ease-out" : "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
    transformStyle: "preserve-3d" as const,
  };

  const glowStyle: React.CSSProperties = {
    position: "absolute" as const,
    inset: 0,
    borderRadius: "inherit",
    pointerEvents: "none" as const,
    opacity: isHovering ? 1 : 0,
    transition: "opacity 200ms",
    background: `radial-gradient(circle 200px at ${tilt.glowX}px ${tilt.glowY}px, var(--cta-glow), transparent)`,
    zIndex: 1,
  };

  return {
    ref,
    tiltStyle,
    glowStyle,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
}
