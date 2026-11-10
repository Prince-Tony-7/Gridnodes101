import { ArrowRight } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/cn";
import type { WorkflowNode } from "@/lib/types";
import { nodeKindStyles } from "./nodeKind";

/**
 * Lightweight linearised node map. Placeholder for a future interactive canvas
 * (e.g. React Flow rendering the real n8n `connections` graph).
 */
export function VisualMapPlaceholder({ nodes }: { nodes: WorkflowNode[] }) {
  return (
    <div className="bg-node-grid relative rounded-xl border border-dashed border-line-strong bg-surface-sunken p-6">
      <div className="flex flex-wrap items-center gap-2">
        {nodes.map((node, i) => {
          const style = nodeKindStyles[node.kind];
          const Icon = style.icon;
          return (
            <Fragment key={node.id}>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg border bg-surface px-3 py-2 shadow-card",
                  style.ring,
                )}
                title={node.type}
              >
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-md", style.bg, style.text)}>
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className="max-w-40 truncate text-xs font-medium text-fg">{node.name}</span>
              </div>
              {i < nodes.length - 1 && <ArrowRight className="h-4 w-4 text-fg-subtle" aria-hidden />}
            </Fragment>
          );
        })}
      </div>
      <p className="mt-6 font-mono text-[11px] text-fg-subtle">
        Interactive canvas coming soon — simplified execution path shown.
      </p>
    </div>
  );
}
