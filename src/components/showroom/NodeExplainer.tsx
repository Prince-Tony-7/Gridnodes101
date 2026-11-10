"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { WorkflowNode } from "@/lib/types";
import { nodeKindStyles } from "./nodeKind";

/** Interactive, step-by-step walkthrough of a workflow's nodes. */
export function NodeExplainer({ nodes }: { nodes: WorkflowNode[] }) {
  const [activeId, setActiveId] = useState<string | null>(nodes[0]?.id ?? null);

  return (
    <ol className="relative space-y-2">
      <span className="absolute top-4 bottom-4 left-[19px] w-px bg-line-strong" aria-hidden />
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
                "flex w-full items-start gap-3 rounded-lg border p-2 pr-3 text-left transition-colors",
                open ? "border-line-strong bg-surface-raised/60" : "border-transparent hover:bg-surface-raised/40",
              )}
            >
              <span
                className={cn(
                  "relative z-10 flex h-6 w-6 shrink-0 translate-x-[3px] translate-y-[3px] items-center justify-center rounded-md border",
                  style.ring,
                  style.bg,
                  style.text,
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 pl-1">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
                  <span className="truncate text-sm font-medium text-fg">{node.name}</span>
                  <span className={cn("ml-auto hidden font-mono text-[10px] tracking-wider uppercase sm:inline", style.text)}>
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
                      <span className="mt-2 block text-sm leading-relaxed text-fg-muted">{node.summary}</span>
                      {node.detail && (
                        <span className="mt-2 block rounded-md border border-line bg-surface-sunken px-3 py-2 text-xs leading-relaxed text-fg-muted">
                          {node.detail}
                        </span>
                      )}
                      <code className="mt-2 block font-mono text-[11px] text-fg-subtle">{node.type}</code>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <ChevronRight
                className={cn("mt-1 h-4 w-4 shrink-0 text-fg-subtle transition-transform", open && "rotate-90")}
                aria-hidden
              />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
