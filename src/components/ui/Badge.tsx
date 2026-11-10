import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "logic" | "warn";

const tones: Record<Tone, string> = {
  neutral: "border-line-strong bg-surface-raised/60 text-fg-muted",
  accent: "border-accent/30 bg-accent-soft text-accent-strong",
  logic: "border-logic/30 bg-logic-soft text-logic-strong",
  warn: "border-warn/30 bg-warn/10 text-warn",
};

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
