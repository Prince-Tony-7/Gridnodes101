import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  kicker,
  kickerClass = "bg-sun",
  title,
  description,
  className,
  as: Tag = "h2",
}: {
  kicker?: string;
  /** Background colour of the kicker sticker. */
  kickerClass?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl space-y-4", className)}>
      {kicker && (
        <span
          className={cn(
            "inline-block -rotate-2 rounded-md border-2 border-ink px-2.5 py-1 text-sm font-bold text-ink shadow-pop-sm",
            kickerClass,
          )}
        >
          {kicker}
        </span>
      )}
      <Tag className="text-4xl leading-[1.05] font-extrabold tracking-tight text-balance text-ink sm:text-5xl">{title}</Tag>
      {description && <p className="text-lg leading-relaxed text-pretty text-ink-soft">{description}</p>}
    </div>
  );
}
