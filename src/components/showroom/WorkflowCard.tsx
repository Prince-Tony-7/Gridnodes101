"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { complexityColor, departmentColor } from "@/lib/palette";
import type { Workflow } from "@/lib/types";
import { nodeKindStyles } from "./nodeKind";

interface WorkflowCardProps {
  workflow: Workflow;
  /** When provided the card is a button (opens the modal); otherwise it links to the showroom deep link. */
  onSelect?: (slug: string) => void;
}

const cardClass =
  "group pop relative flex h-full w-full flex-col overflow-hidden rounded-card bg-card text-left transition-shadow duration-200 hover:border-line-strong hover:shadow-pop-lg";

/** Miniature of the workflow: one coloured dot per node, wired in sequence. */
function NodeStrip({ workflow }: { workflow: Workflow }) {
  return (
    <div className="flex items-center" aria-hidden>
      {workflow.nodes.map((n, i) => (
        <span key={n.id} className="flex items-center">
          {i > 0 && <span className="h-px w-3 bg-line-strong sm:w-4" />}
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-transform duration-300 group-hover:scale-125",
              nodeKindStyles[n.kind].solid,
            )}
            style={{ transitionDelay: `${i * 35}ms` }}
          />
        </span>
      ))}
    </div>
  );
}

function CardBody({ workflow }: { workflow: Workflow }) {
  const metric = workflow.roi.metrics[0];
  const dept = departmentColor[workflow.department];

  return (
    <>
      <span className={cn("absolute inset-x-0 top-0 h-1", dept.solid)} aria-hidden />
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 pt-5 pb-4">
        <NodeStrip workflow={workflow} />
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-mute transition-all duration-200 group-hover:bg-ink group-hover:text-white">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={dept.soft}>{workflow.department}</Badge>
          <Badge className={complexityColor[workflow.complexity]}>{workflow.complexity}</Badge>
        </div>

        <h3 className="mt-4 text-xl leading-snug font-semibold tracking-tight text-ink">{workflow.title}</h3>
        <p className="mt-2 line-clamp-3 leading-relaxed text-ink-soft">{workflow.tagline}</p>

        <p className="mt-4 mb-5 text-sm text-ink-mute">
          {workflow.integrations.join(" · ")}
        </p>

        {metric && (
          <div className={"mt-auto flex items-baseline gap-2 border-t border-line pt-4"}>
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">{metric.value}</span>
            <span className="text-sm leading-tight font-medium text-ink-soft">
              {metric.label.toLowerCase()}
              {metric.context ? ` ${metric.context}` : ""}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

export function WorkflowCard({ workflow, onSelect }: WorkflowCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
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
