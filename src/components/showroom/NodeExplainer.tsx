"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { WorkflowNode } from "@/lib/types";
import { nodeKindStyles } from "./nodeKind";

/** Interactive, step-by-step walkthrough of a workflow's nodes. */
export function NodeExplainer({ nodes }: { nodes: WorkflowNode[] }) {
  const [activeId, setActiveId] = useState<string | null>(nodes[0]?.id ?? null);

  return (
    <ol className="relative space-y-2.5">
      <span className="absolute top-6 bottom-6 left-[24px] w-px bg-line-strong" aria-hidden />
      {nodes.map((node, index) => {
        const style = nodeKindStyles[node.kind];
        const Icon = style.icon;
        const open = activeId === node.id;

        return (
          <li key={node.id} className="relative">
            <button
              type="button"
              onClick={() => setActiveId(open ? null : node.id)}
              aria-expanded={open}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-2 pr-3 text-left transition-all duration-150",
                open ? "border-line bg-card shadow-pop-sm" : "border-transparent hover:bg-card",
              )}
            >
              <span
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  style.soft,
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
              </span>
              <span className="min-w-0 flex-1 pt-1">
                <span className="flex items-center gap-2">
                  <span className="text-xs font-medium text-ink-mute tabular-nums">{index + 1}</span>
                  <span className="truncate font-medium text-ink">{node.name}</span>
                  <span className="ml-auto hidden rounded px-1.5 text-[11px] font-medium text-ink-mute sm:inline">
                    {style.label}
                  </span>
                </span>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.span
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="block overflow-hidden"
                    >
                      <span className="mt-2 block text-sm leading-relaxed text-ink-soft">{node.summary}</span>
                      {node.detail && (
                        <span className="mt-2 block rounded-lg border border-line bg-paper px-3 py-2 text-xs leading-relaxed text-ink-soft">
                          {node.detail}
                        </span>
                      )}
                      <code className="mt-2 block font-mono text-[11px] text-ink-mute">{node.type}</code>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <ChevronDown
                className={cn("mt-1.5 h-4 w-4 shrink-0 text-ink-mute transition-transform", open && "rotate-180")}
                aria-hidden
              />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
