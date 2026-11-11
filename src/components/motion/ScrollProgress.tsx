"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gradient bar along the top edge that fills as the page is scrolled. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--color-coral), var(--color-pink), var(--color-violet), var(--color-sky))",
      }}
    />
  );
}
