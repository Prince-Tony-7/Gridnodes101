"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Bot,
  Braces,
  Cpu,
  FileSpreadsheet,
  GitBranch,
  Globe,
  Mail,
  Maximize2,
  Merge,
  Minimize2,
  PenLine,
  Repeat,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { CanvasIcon, CaseStudyWorkflow } from "@/data/caseStudyData";

const NODE = 88;
const PAD = 70;
const LABEL_GAP = 22;
const LINE_H = 17;

const ICONS: Record<CanvasIcon, { icon: LucideIcon; color: string; name: string }> = {
  mail: { icon: Mail, color: "var(--color-coral)", name: "Gmail" },
  code: { icon: Braces, color: "var(--color-sun)", name: "Code (JavaScript)" },
  branch: { icon: GitBranch, color: "var(--color-sky)", name: "Decision" },
  sheet: { icon: FileSpreadsheet, color: "var(--color-mint)", name: "Spreadsheet file" },
  edit: { icon: PenLine, color: "#a99bff", name: "Set fields" },
  ai: { icon: Bot, color: "var(--color-pink)", name: "AI step" },
  model: { icon: Cpu, color: "var(--color-pink)", name: "AI model" },
  merge: { icon: Merge, color: "#a99bff", name: "Merge" },
  http: { icon: Globe, color: "var(--color-sky)", name: "HTTP request (Gmail API)" },
  loop: { icon: Repeat, color: "var(--color-mint)", name: "Loop" },
};

/** Splits a label into at most two lines of ~16 characters. */
function wrap(label: string): string[] {
  const words = label.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > 16 && line) {
      lines.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  return lines.length > 2 ? [lines[0]!, lines.slice(1).join(" ")] : lines;
}

/**
 * n8n-style canvas for an anonymised workflow. Positions and connections come
 * from the real export; labels are generic.
 */
export function WorkflowCanvas({ workflow, compact = false }: { workflow: CaseStudyWorkflow; compact?: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [overview, setOverview] = useState(compact);
  const { nodes, edges } = workflow.canvas;

  const layout = useMemo(() => {
    const xs = nodes.map((n) => n.x);
    const ys = nodes.map((n) => n.y);
    const minX = Math.min(...xs) - PAD;
    const minY = Math.min(...ys) - PAD;
    const hasLoopBack = edges.some((e) => {
      const a = nodes.find((n) => n.id === e.from)!;
      const b = nodes.find((n) => n.id === e.to)!;
      return !e.ai && b.x <= a.x;
    });
    const maxY = Math.max(...ys) + NODE + LABEL_GAP + LINE_H * 2 + (hasLoopBack ? 70 : 0) + PAD / 2;
    const maxX = Math.max(...xs) + NODE + PAD;
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    // Failure path = the rejection/failure email nodes and everything downstream of them.
    const failure = new Set(nodes.filter((n) => /rejection|failure/i.test(n.label)).map((n) => n.id));
    let grew = true;
    while (grew) {
      grew = false;
      for (const e of edges) {
        if (failure.has(e.from) && !failure.has(e.to)) {
          failure.add(e.to);
          grew = true;
        }
      }
    }
    const loopY = Math.max(...ys) + NODE + LABEL_GAP + LINE_H * 2 + 30;
    const paths = edges.map((e, i) => {
      const a = byId[e.from]!;
      const b = byId[e.to]!;
      if (e.ai) {
        // AI sub-node: model (below) feeds the chain (above), drawn from top of model to bottom of chain.
        const sx = a.x + NODE / 2;
        const sy = a.y;
        const tx = b.x + NODE / 2;
        const ty = b.y + NODE;
        return { key: i, d: `M ${sx} ${sy} C ${sx} ${sy - 40}, ${tx} ${ty + 40}, ${tx} ${ty}`, ai: true, branch: false };
      }
      const offset = e.outputs > 1 ? (e.output === 0 ? -16 : 16) : 0;
      const sx = a.x + NODE;
      const sy = a.y + NODE / 2 + offset;
      const tx = b.x;
      const ty = b.y + NODE / 2;
      if (tx <= sx) {
        // Loop back to an earlier node: route underneath the canvas.
        return {
          key: i,
          d: `M ${sx} ${sy} C ${sx + 60} ${sy}, ${sx + 60} ${loopY}, ${sx} ${loopY} L ${tx} ${loopY} C ${tx - 60} ${loopY}, ${tx - 60} ${ty}, ${tx} ${ty}`,
          ai: false,
          branch: failure.has(e.to),
        };
      }
      const dx = Math.max(50, (tx - sx) * 0.5);
      return {
        key: i,
        d: `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`,
        ai: false,
        branch: failure.has(e.to),
      };
    });
    return { minX, minY, width: maxX - minX, height: maxY - minY, paths };
  }, [nodes, edges]);

  const scale = 0.62;
  const pixelWidth = Math.round(layout.width * scale);
  const animate = inView && !reduce;

  return (
    <figure className="overflow-hidden rounded-card border border-white/10 bg-deep shadow-pop-lg">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
        <span className="truncate font-mono text-xs text-white/50">
          {workflow.slug}.json · {workflow.nodeCount} nodes
        </span>
        {!compact ? (
          <button
            type="button"
            onClick={() => setOverview((v) => !v)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white"
            aria-pressed={overview}
          >
            {overview ? <Maximize2 className="h-3.5 w-3.5" aria-hidden /> : <Minimize2 className="h-3.5 w-3.5" aria-hidden />}
            {overview ? "Zoom in" : "Overview"}
          </button>
        ) : (
          <span className="w-12" aria-hidden />
        )}
      </div>

      <div
        ref={ref}
        className={cn("relative", !overview && "scrollbar-thin overflow-x-auto focus-visible:outline-offset-[-3px]")}
        // Keyboard users can focus the diagram and scroll it with the arrow keys.
        tabIndex={overview ? undefined : 0}
        role={overview ? undefined : "region"}
        aria-label={overview ? undefined : `${workflow.title} workflow diagram, scrollable`}
      >
        <svg
          viewBox={`${layout.minX} ${layout.minY} ${layout.width} ${layout.height}`}
          width={overview ? "100%" : pixelWidth}
          className="block"
          role="img"
          aria-label={`Diagram of the ${workflow.title} workflow: ${workflow.nodeCount} n8n nodes. Node labels are anonymised.`}
        >
          <defs>
            <pattern id={`dots-${workflow.slug}`} width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1.2" fill="rgb(255 255 255 / 0.09)" />
            </pattern>
          </defs>
          <rect x={layout.minX} y={layout.minY} width={layout.width} height={layout.height} fill={`url(#dots-${workflow.slug})`} />

          {/* wires */}
          {layout.paths.map((p, i) => (
            <g key={p.key}>
              <motion.path
                d={p.d}
                fill="none"
                stroke={p.ai ? "var(--color-pink)" : p.branch ? "rgb(255 255 255 / 0.28)" : "rgb(255 255 255 / 0.45)"}
                strokeWidth={2.5}
                strokeDasharray={p.ai ? "6 6" : undefined}
                initial={reduce ? false : { pathLength: 0 }}
                animate={animate || reduce ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.04, ease: "easeOut" }}
              />
              {animate && !p.ai && !p.branch && (
                <circle r={4.5} fill="var(--color-coral)" opacity={0}>
                  <animateMotion dur="2.6s" begin={`${1.2 + (i % 7) * 0.35}s`} repeatCount="indefinite" path={p.d} />
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.6s" begin={`${1.2 + (i % 7) * 0.35}s`} repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ))}

          {/* nodes */}
          {nodes.map((n, i) => {
            const meta = ICONS[n.icon];
            const Icon = meta.icon;
            const lines = wrap(n.label);
            return (
              <motion.g
                key={n.id}
                initial={reduce ? false : { opacity: 0 }}
                animate={animate || reduce ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <title>{`${n.label} (${meta.name})`}</title>
                <rect
                  x={n.x}
                  y={n.y}
                  width={NODE}
                  height={NODE}
                  rx={n.trigger ? 30 : n.icon === "model" ? NODE / 2 : 14}
                  fill="#123f31"
                  stroke="rgb(255 255 255 / 0.22)"
                  strokeWidth={2}
                />
                <Icon x={n.x + NODE / 2 - 18} y={n.y + NODE / 2 - 18} width={36} height={36} color={meta.color} strokeWidth={1.75} />
                {n.trigger && <Zap x={n.x - 26} y={n.y + NODE / 2 - 10} width={20} height={20} color="var(--color-coral)" fill="var(--color-coral)" />}
                {lines.map((line, li) => (
                  <text
                    key={li}
                    x={n.x + NODE / 2}
                    y={n.y + NODE + LABEL_GAP + li * LINE_H}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="600"
                    fill="rgb(246 244 238 / 0.88)"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {line}
                  </text>
                ))}
              </motion.g>
            );
          })}
        </svg>
        {!overview && (
          <span className="pointer-events-none absolute top-1/2 right-0 h-full w-12 -translate-y-1/2 bg-gradient-to-l from-deep to-transparent" aria-hidden />
        )}
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-2.5 text-xs text-white/50">
        <span>Real workflow structure, anonymised labels. {overview ? "" : "Scroll sideways to follow it."}</span>
        <span className="flex flex-wrap gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1">
            <span className="h-0.5 w-4 bg-white/45" aria-hidden /> main path
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-0.5 w-4 bg-white/25" aria-hidden /> failure path
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
