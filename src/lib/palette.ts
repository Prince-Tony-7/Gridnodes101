import type { Complexity, Department, NodeKind } from "@/lib/types";

/**
 * Colour assignments. Class names are written out in full so Tailwind can
 * detect them at build time.
 */

export interface Swatch {
  /** Solid accent fill (small marks: dots, bars, icons) */
  solid: string;
  /** Pale fill for surfaces */
  tint: string;
  /** Pale fill with matching deep text, for badges and selected chips */
  soft: string;
  /** Accent text colour */
  text: string;
  /** Raw CSS colour, for SVG / inline styles */
  hex: string;
}

const coral: Swatch = { solid: "bg-coral", tint: "bg-coral-tint", soft: "bg-coral-tint text-coral-deep", text: "text-coral-deep", hex: "var(--color-coral)" };
const mint: Swatch = { solid: "bg-mint", tint: "bg-mint-tint", soft: "bg-mint-tint text-mint-deep", text: "text-mint-deep", hex: "var(--color-mint)" };
const pink: Swatch = { solid: "bg-pink", tint: "bg-pink-tint", soft: "bg-pink-tint text-pink-deep", text: "text-pink-deep", hex: "var(--color-pink)" };
const sky: Swatch = { solid: "bg-sky", tint: "bg-sky-tint", soft: "bg-sky-tint text-sky-deep", text: "text-sky-deep", hex: "var(--color-sky)" };
const violet: Swatch = { solid: "bg-violet", tint: "bg-violet-tint", soft: "bg-violet-tint text-violet-deep", text: "text-violet-deep", hex: "var(--color-violet)" };

export const departmentColor: Record<Department, Swatch> = {
  Admin: coral,
  Finance: mint,
  Operations: sky,
  Sales: pink,
};

export const complexityColor: Record<Complexity, string> = {
  Basic: "bg-paper-deep text-ink-soft",
  Advanced: "bg-violet-tint text-violet-deep",
};

export const nodeKindColor: Record<NodeKind, Swatch> = {
  trigger: coral,
  action: sky,
  logic: violet,
  ai: pink,
  output: mint,
};

/** Cycled through for lists that have no semantic colour (chips, tools…). */
export const rotation = [
  "bg-sky-tint text-sky-deep",
  "bg-violet-tint text-violet-deep",
  "bg-mint-tint text-mint-deep",
  "bg-coral-tint text-coral-deep",
  "bg-sun-tint text-sun-deep",
  "bg-pink-tint text-pink-deep",
] as const;

/** Solid accent dots in the same order as `rotation`. */
export const rotationDot = ["bg-sky", "bg-violet", "bg-mint", "bg-coral", "bg-sun", "bg-pink"] as const;
