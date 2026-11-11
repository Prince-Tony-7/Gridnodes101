import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ink";

export const buttonStyles: Record<Variant, string> = {
  primary:
    "border-ink bg-gradient-to-b from-[#2b3050] to-ink text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_1px_2px_rgb(18_21_39/0.25),0_10px_24px_-10px_rgb(18_21_39/0.6)] hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_2px_4px_rgb(18_21_39/0.25),0_16px_32px_-12px_rgb(18_21_39/0.6)]",
  secondary:
    "border-line-strong bg-gradient-to-b from-white to-paper text-ink shadow-[inset_0_1px_0_white,0_1px_2px_rgb(18_21_39/0.06)] hover:-translate-y-px hover:border-ink-mute hover:shadow-pop",
  ink: "border-ink bg-gradient-to-b from-[#2b3050] to-ink text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_1px_2px_rgb(18_21_39/0.25)] hover:-translate-y-px",
};

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-[transform,box-shadow,background-color,border-color] duration-200 disabled:cursor-not-allowed disabled:opacity-60";

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(buttonBase, buttonStyles[variant], className)} {...props} />;
}
