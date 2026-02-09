"use client";

import { useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Animated counter hook: counts from 0 to target value
 * Synced with skill bar fill animation timing
 */
export function useCountUp(target: number, inView: boolean, delay: number = 0) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return unsubscribe;
  }, [rounded]);

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      animate(motionValue, target, {
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1],
      });
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [inView, target, delay, motionValue]);

  return display;
}
