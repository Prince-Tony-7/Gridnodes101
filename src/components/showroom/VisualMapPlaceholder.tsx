"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fragment } from "react";
import { cn } from "@/lib/cn";
import type { WorkflowNode } from "@/lib/types";
import { nodeKindStyles } from "./nodeKind";

/**
 * Simplified execution path with animated "data flow" between nodes.
 * Placeholder for a future interactive canvas (e.g. React Flow rendering the
 * real n8n `connections` graph).
 */
export function VisualMapPlaceholder({ nodes }: { nodes: WorkflowNode[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="bg-dots pop relative rounded-xl bg-card p-5">
      <div className="flex flex-wrap items-center gap-y-4">
        {nodes.map((node, i) => {
          const style = nodeKindStyles[node.kind];
          const Icon = style.icon;
          return (
            <Fragment key={node.id}>
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: i * 0.07 }}
                className={"flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-2 shadow-pop-sm"}
                title={node.type}
              >
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-md", style.soft)}>
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                </span>
                <span className="max-w-40 truncate text-xs font-medium text-ink">{node.name}</span>
              </motion.div>
              {i < nodes.length - 1 && (
                <svg viewBox="0 0 32 12" className="h-3 w-8 shrink-0" aria-hidden>
                  <line
                    x1="0"
                    y1="6"
                    x2="26"
                    y2="6"
                    stroke="var(--color-line-strong)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className={reduce ? undefined : "[animation:dash_0.6s_linear_infinite]"}
                  />
                  <path d="M24 1 L31 6 L24 11 Z" fill="var(--color-line-strong)" />
                </svg>
              )}
            </Fragment>
          );
        })}
      </div>
      <p className="mt-6 text-xs font-medium text-ink-mute">Simplified path. Interactive canvas coming soon.</p>
      <style>{`@keyframes dash { to { stroke-dashoffset: -8; } }`}</style>
    </div>
  );
}
