import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";

export const buttonStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-slate-950 hover:bg-accent-strong shadow-glow disabled:opacity-60 disabled:cursor-not-allowed",
  secondary: "border border-line-strong bg-surface-raised/50 text-fg hover:border-fg-subtle hover:bg-surface-raised",
};

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors";

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(buttonBase, buttonStyles[variant], className)} {...props} />;
}
