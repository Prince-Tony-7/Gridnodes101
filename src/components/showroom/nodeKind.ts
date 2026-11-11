import { Bot, Box, GitBranch, Send, Zap, type LucideIcon } from "lucide-react";
import { nodeKindColor, type Swatch } from "@/lib/palette";
import type { NodeKind } from "@/lib/types";

export const nodeKindStyles: Record<NodeKind, Swatch & { label: string; icon: LucideIcon }> = {
  trigger: { label: "Trigger", icon: Zap, ...nodeKindColor.trigger },
  action: { label: "Action", icon: Box, ...nodeKindColor.action },
  logic: { label: "Logic", icon: GitBranch, ...nodeKindColor.logic },
  ai: { label: "AI", icon: Bot, ...nodeKindColor.ai },
  output: { label: "Output", icon: Send, ...nodeKindColor.output },
};
