import { Bot, GitBranch, Send, Zap, Box, type LucideIcon } from "lucide-react";
import type { NodeKind } from "@/lib/types";

/** Visual language for node roles, shared by the explainer and visual map. */
export const nodeKindStyles: Record<NodeKind, { label: string; icon: LucideIcon; ring: string; text: string; bg: string }> = {
  trigger: { label: "Trigger", icon: Zap, ring: "border-accent/40", text: "text-accent-strong", bg: "bg-accent-soft" },
  action: { label: "Action", icon: Box, ring: "border-line-strong", text: "text-fg", bg: "bg-surface-raised" },
  logic: { label: "Logic", icon: GitBranch, ring: "border-logic/40", text: "text-logic-strong", bg: "bg-logic-soft" },
  ai: { label: "AI", icon: Bot, ring: "border-fuchsia-400/40", text: "text-fuchsia-300", bg: "bg-fuchsia-500/10" },
  output: { label: "Output", icon: Send, ring: "border-accent/40", text: "text-accent-strong", bg: "bg-accent-soft" },
};
