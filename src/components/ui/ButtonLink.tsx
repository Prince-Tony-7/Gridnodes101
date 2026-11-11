import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ink";

export const buttonStyles: Record<Variant, string> = {
  primary: "border-ink bg-ink text-white hover:bg-[#262a40]",
  secondary: "border-line-strong bg-card text-ink hover:border-ink-mute hover:bg-paper",
  ink: "border-ink bg-ink text-white hover:bg-[#262a40]",
};

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold shadow-pop-sm transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60";

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(buttonBase, buttonStyles[variant], className)} {...props} />;
}
