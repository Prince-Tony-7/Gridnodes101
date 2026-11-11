import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ink";

export const buttonStyles: Record<Variant, string> = {
  primary: "bg-coral text-ink",
  secondary: "bg-card text-ink",
  ink: "bg-ink text-paper",
};

/** Chunky outlined button that "presses" into its shadow. */
export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 text-sm font-bold shadow-pop transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60";

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(buttonBase, buttonStyles[variant], className)} {...props} />;
}
