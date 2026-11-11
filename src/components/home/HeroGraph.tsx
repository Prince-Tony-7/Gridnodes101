"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FileSpreadsheet, GitBranch, Mail, MailCheck, ScanText, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Illustration of a small admin workflow (not live data): packets travel
 * along the wires of an email-to-spreadsheet graph. Coordinates live in a 520×360 space shared by the SVG
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
  { id: "hook", label: "Gmail", icon: Mail, x: 76, y: 180, fill: "bg-coral-tint text-coral-deep", color: "var(--color-coral)" },
  { id: "ai", label: "Extract", icon: ScanText, x: 215, y: 90, fill: "bg-pink-tint text-pink-deep", color: "var(--color-pink)" },
  { id: "route", label: "Check", icon: GitBranch, x: 290, y: 250, fill: "bg-violet-tint text-violet-deep", color: "var(--color-violet)" },
  { id: "crm", label: "Sheets", icon: FileSpreadsheet, x: 440, y: 120, fill: "bg-sky-tint text-sky-deep", color: "var(--color-sky)" },
  { id: "slack", label: "Reply", icon: MailCheck, x: 440, y: 285, fill: "bg-mint-tint text-mint-deep", color: "var(--color-mint)" },
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

  return (
    <div className="pop relative overflow-hidden rounded-card bg-card">
      {/* window chrome */}
      <div className="flex items-center justify-between border-b border-line bg-paper px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        </div>
        <span className="font-mono text-xs text-ink-mute">example-workflow</span>
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
                  stroke="var(--color-line-strong)"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.25, ease: "easeOut" }}
                />
                {!reduce &&
                  [0, 1].map((k) => (
                    <circle key={k} r={4} fill={target.color} opacity={0}>
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
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 + i * 0.1 }}
            >
              <div
                className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-[1.6cqw] rounded-[1.6cqw] border border-line bg-card px-[1.6cqw] py-[1.4cqw] text-[2.9cqw] leading-none font-medium text-ink shadow-pop"
              >
                <span className={cn("flex shrink-0 items-center justify-center rounded-[1cqw] p-[0.9cqw]", n.fill)}>
                  <Icon className="h-[3.2cqw] w-[3.2cqw]" strokeWidth={2} />
                </span>
                <span className="truncate">{n.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
