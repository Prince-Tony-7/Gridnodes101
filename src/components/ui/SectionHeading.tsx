import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export function SectionHeading({
  kicker,
  kickerClass = "bg-violet",
  title,
  description,
  className,
  as: Tag = "h2",
}: {
  kicker?: string;
  /** Background colour of the small accent dot before the kicker. */
  kickerClass?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={cn("max-w-2xl space-y-4", className)}>
      {kicker && (
        <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-ink-soft uppercase">
          <span className={cn("h-1.5 w-1.5 rounded-full", kickerClass)} aria-hidden />
          {kicker}
        </p>
      )}
      <Tag className="text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-ink sm:text-5xl">{title}</Tag>
      {description && <p className="text-lg leading-relaxed text-pretty text-ink-soft">{description}</p>}
    </Reveal>
  );
}
