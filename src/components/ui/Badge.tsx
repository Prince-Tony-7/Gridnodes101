import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small outlined pill. Pass a background class (e.g. `bg-sun`) via `className`. */
export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border-2 border-ink bg-card px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
