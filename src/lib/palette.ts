import type { Complexity, Department, NodeKind } from "@/lib/types";

/**
 * Colour assignments. Class names are written out in full so Tailwind can
 * detect them at build time.
 */

export interface Swatch {
  /** Solid fill */
  solid: string;
  /** Pale fill for large areas */
  tint: string;
  /** Raw CSS colour, for SVG / inline styles */
  hex: string;
}

export const departmentColor: Record<Department, Swatch> = {
  Sales: { solid: "bg-coral", tint: "bg-coral-tint", hex: "var(--color-coral)" },
  Finance: { solid: "bg-mint", tint: "bg-mint-tint", hex: "var(--color-mint)" },
  Marketing: { solid: "bg-pink", tint: "bg-pink-tint", hex: "var(--color-pink)" },
  Ops: { solid: "bg-sky", tint: "bg-sky-tint", hex: "var(--color-sky)" },
};

export const complexityColor: Record<Complexity, string> = {
  Basic: "bg-sun",
  Advanced: "bg-violet text-white",
};

export const nodeKindColor: Record<NodeKind, Swatch> = {
  trigger: { solid: "bg-coral", tint: "bg-coral-tint", hex: "var(--color-coral)" },
  action: { solid: "bg-sky", tint: "bg-sky-tint", hex: "var(--color-sky)" },
  logic: { solid: "bg-violet", tint: "bg-violet-tint", hex: "var(--color-violet)" },
  ai: { solid: "bg-pink", tint: "bg-pink-tint", hex: "var(--color-pink)" },
  output: { solid: "bg-mint", tint: "bg-mint-tint", hex: "var(--color-mint)" },
};

/** Cycled through for lists that have no semantic colour (chips, metrics…). */
export const rotation = ["bg-sun", "bg-sky", "bg-pink", "bg-mint", "bg-violet text-white", "bg-coral"] as const;
