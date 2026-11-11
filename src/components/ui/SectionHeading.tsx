import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export function SectionHeading({
  kicker,
  kickerClass = "bg-coral",
  title,
  description,
  className,
  as: Tag = "h2",
  tone = "light",
}: {
  kicker?: string;
  /** Background colour of the small accent dot before the kicker. */
  kickerClass?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
  /** Use "dark" on dark backgrounds. */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <Reveal className={cn("max-w-2xl space-y-4", className)}>
      {kicker && (
        <p className={cn("inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase", dark ? "text-white/60" : "text-ink-soft")}>
          <span className={cn("h-1.5 w-1.5 rounded-full", kickerClass)} aria-hidden />
          {kicker}
        </p>
      )}
      <Tag className={cn("text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl", dark ? "text-white" : "text-ink")}>{title}</Tag>
      {description && <p className={cn("text-lg leading-relaxed text-pretty", dark ? "text-white/65" : "text-ink-soft")}>{description}</p>}
    </Reveal>
  );
}
