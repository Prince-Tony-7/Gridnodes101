"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Perspective tilt toward the cursor with a soft spotlight that follows it.
 * Children can use `[transform:translateZ(...)]` to sit at different depths.
 * Mouse only; touch and reduced-motion users get a static element.
 */
export function Tilt({
  children,
  className,
  max = 6,
  spotlight = "rgb(106 82 232 / 0.10)",
  lift = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
  /** Colour of the cursor spotlight; pass null to disable. */
  spotlight?: string | null;
  /** Pixels to lift (translateY) while hovered. */
  lift?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(480px circle at ${gx} ${gy}, ${spotlight ?? "transparent"}, transparent 45%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    if (!hover) setHover(true);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    setHover(false);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      animate={{ y: hover && lift ? -lift : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
      className={cn("relative [transform-style:preserve-3d]", className)}
    >
      {children}
      {spotlight && !reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-300"
          style={{ background: glow, opacity: hover ? 1 : 0 }}
        />
      )}
    </motion.div>
  );
}
