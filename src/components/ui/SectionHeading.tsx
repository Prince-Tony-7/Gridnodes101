import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl space-y-3", className)}>
      {eyebrow && (
        <p className="font-mono text-xs font-medium tracking-[0.18em] text-accent-strong uppercase">{eyebrow}</p>
      )}
      <Tag className="text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl">{title}</Tag>
      {description && <p className="text-base leading-relaxed text-pretty text-fg-muted">{description}</p>}
    </div>
  );
}
