"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Layers } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { Workflow } from "@/lib/types";

interface WorkflowCardProps {
  workflow: Workflow;
  /** When provided the card is a button (opens the modal); otherwise it links to the showroom deep link. */
  onSelect?: (slug: string) => void;
}

const cardClass =
  "group relative flex h-full w-full flex-col rounded-card border border-line bg-surface/70 p-6 text-left shadow-card transition-colors hover:border-accent/40 focus-visible:border-accent/60";

function CardBody({ workflow }: { workflow: Workflow }) {
  const primaryMetric = workflow.roi.metrics[0];
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="logic">{workflow.department}</Badge>
          <Badge tone={workflow.complexity === "Advanced" ? "warn" : "accent"}>{workflow.complexity}</Badge>
        </div>
        <ArrowUpRight
          className="h-5 w-5 shrink-0 text-fg-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-strong"
          aria-hidden
        />
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-fg">{workflow.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fg-muted">{workflow.tagline}</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {workflow.integrations.map((i) => (
          <span key={i} className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
            {i}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-5">
        {primaryMetric && (
          <div>
            <p className="text-xl font-semibold text-accent-strong">{primaryMetric.value}</p>
            <p className="text-xs text-fg-subtle">
              {primaryMetric.label}
              {primaryMetric.context ? ` · ${primaryMetric.context}` : ""}
            </p>
          </div>
        )}
        <span className="inline-flex items-center gap-1 font-mono text-xs text-fg-subtle">
          <Layers className="h-3.5 w-3.5" aria-hidden />
          {workflow.nodes.length} nodes
        </span>
      </div>
    </>
  );
}

export function WorkflowCard({ workflow, onSelect }: WorkflowCardProps) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="h-full">
      {onSelect ? (
        <button
          type="button"
          className={cardClass}
          onClick={() => onSelect(workflow.slug)}
          aria-haspopup="dialog"
          aria-label={`View details for ${workflow.title}`}
        >
          <CardBody workflow={workflow} />
        </button>
      ) : (
        <Link href={`/showroom?workflow=${workflow.slug}`} className={cardClass}>
          <CardBody workflow={workflow} />
        </Link>
      )}
    </motion.div>
  );
}
