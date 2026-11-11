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
  "group pop relative flex h-full w-full flex-col overflow-hidden rounded-card bg-card text-left transition-shadow duration-200 hover:shadow-pop-lg";

/** Miniature of the workflow: one coloured dot per node, wired in sequence. */
function NodeStrip({ workflow }: { workflow: Workflow }) {
  return (
    <div className="flex items-center" aria-hidden>
      {workflow.nodes.map((n, i) => (
        <span key={n.id} className="flex items-center">
          {i > 0 && <span className="h-0.5 w-3 bg-ink sm:w-4" />}
          <span
            className={cn(
              "h-4 w-4 rounded-[5px] border-2 border-ink transition-transform duration-300 group-hover:-translate-y-1",
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
      <div className={cn("flex items-center justify-between gap-3 border-b-2 border-ink px-5 py-4", dept.solid)}>
        <NodeStrip workflow={workflow} />
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-card transition-transform duration-300 group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={dept.tint}>{workflow.department}</Badge>
          <Badge className={complexityColor[workflow.complexity]}>{workflow.complexity}</Badge>
        </div>

        <h3 className="mt-4 text-2xl leading-tight font-bold tracking-tight text-ink">{workflow.title}</h3>
        <p className="mt-2 line-clamp-3 leading-relaxed text-ink-soft">{workflow.tagline}</p>

        <p className="mt-4 text-sm text-ink-mute">
          {workflow.integrations.join(" · ")}
        </p>

        {metric && (
          <div className={cn("mt-5 flex items-baseline gap-2 rounded-xl border-2 border-dashed border-ink/40 px-4 py-3", dept.tint)}>
            <span className="font-display text-3xl font-extrabold tracking-tight text-ink">{metric.value}</span>
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
      whileHover={{ y: -6, rotate: -0.6 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
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
