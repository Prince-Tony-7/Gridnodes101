"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bot, Database, GitBranch, MessageSquare, Webhook, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Decorative "live" workflow: data packets travel along the wires of a small
 * lead-routing graph. Coordinates live in a 520×360 space shared by the SVG
 * wires and the absolutely positioned HTML nodes.
 */

const W = 520;
const H = 360;
const NODE_HALF_W = 64;

interface GraphNode {
  id: string;
  label: string;
  icon: LucideIcon;
  x: number;
  y: number;
  fill: string;
  color: string;
}

const NODES: GraphNode[] = [
  { id: "hook", label: "Webhook", icon: Webhook, x: 76, y: 180, fill: "bg-coral", color: "var(--color-coral)" },
  { id: "ai", label: "AI score", icon: Bot, x: 215, y: 90, fill: "bg-pink", color: "var(--color-pink)" },
  { id: "route", label: "Route", icon: GitBranch, x: 290, y: 250, fill: "bg-violet text-white", color: "var(--color-violet)" },
  { id: "crm", label: "HubSpot", icon: Database, x: 440, y: 120, fill: "bg-sky", color: "var(--color-sky)" },
  { id: "slack", label: "Slack", icon: MessageSquare, x: 440, y: 285, fill: "bg-mint", color: "var(--color-mint)" },
];

const EDGES: Array<[string, string]> = [
  ["hook", "ai"],
  ["ai", "route"],
  ["route", "crm"],
  ["route", "slack"],
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<string, GraphNode>;

function wire(fromId: string, toId: string) {
  const a = byId[fromId]!;
  const b = byId[toId]!;
  const x1 = a.x + NODE_HALF_W;
  const x2 = b.x - NODE_HALF_W;
  const dx = Math.max(40, Math.abs(x2 - x1) * 0.6);
  return `M ${x1} ${a.y} C ${x1 + dx} ${a.y}, ${x2 - dx} ${b.y}, ${x2} ${b.y}`;
}

export function HeroGraph() {
  const reduce = useReducedMotion();
  const [runs, setRuns] = useState(1284);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setRuns((r) => r + 1), 1400);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="pop relative overflow-hidden rounded-card bg-card">
      {/* window chrome */}
      <div className="flex items-center justify-between border-b-2 border-ink bg-paper-deep px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full border-2 border-ink bg-coral" />
          <span className="h-3 w-3 rounded-full border-2 border-ink bg-sun" />
          <span className="h-3 w-3 rounded-full border-2 border-ink bg-mint" />
        </div>
        <span className="font-mono text-xs font-semibold text-ink-soft">lead-router.json</span>
        <span className="w-12" aria-hidden />
      </div>

      <div className="bg-dots @container relative" style={{ aspectRatio: `${W} / ${H}` }} aria-hidden>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
          {EDGES.map(([from, to], i) => {
            const d = wire(from, to);
            const target = byId[to]!;
            return (
              <g key={`${from}-${to}`}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.25, ease: "easeOut" }}
                />
                {!reduce &&
                  [0, 1].map((k) => (
                    <circle key={k} r={6} fill={target.color} stroke="var(--color-ink)" strokeWidth={2} opacity={0}>
                      <animateMotion dur="2.4s" begin={`${1.4 + i * 0.6 + k * 1.2}s`} repeatCount="indefinite" path={d} />
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.1;0.85;1"
                        dur="2.4s"
                        begin={`${1.4 + i * 0.6 + k * 1.2}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  ))}
              </g>
            );
          })}
        </svg>

        {NODES.map((n, i) => {
          const Icon = n.icon;
          return (
            <motion.div
              key={n.id}
              className="absolute"
              style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%`, width: `${((NODE_HALF_W * 2) / W) * 100}%` }}
              initial={reduce ? false : { opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.1 + i * 0.12 }}
            >
              <div
                className={cn(
                  "flex -translate-x-1/2 -translate-y-1/2 items-center gap-[1.5cqw] rounded-[2cqw] border-2 border-ink px-[2cqw] py-[1.8cqw] text-[3cqw] leading-none font-bold text-ink shadow-pop-sm",
                  n.fill,
                )}
              >
                <Icon className="h-[3.6cqw] w-[3.6cqw] shrink-0" strokeWidth={2.5} />
                <span className="truncate">{n.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t-2 border-ink px-4 py-2.5 text-xs font-semibold">
        <span className="inline-flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-ink bg-mint" />
          </span>
          Active
        </span>
        <span className="font-mono tabular-nums text-ink-soft">
          {runs.toLocaleString("en-US")} runs today
        </span>
      </div>
    </div>
  );
}
