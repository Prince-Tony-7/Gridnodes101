"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { departmentColor } from "@/lib/palette";
import { DEPARTMENTS, type Department, type DemoVideo } from "@/lib/types";
import { DemoPoster } from "./DemoPoster";
import { VideoPlayer } from "./VideoPlayer";

/**
 * Featured player with a playlist beside it. Selecting a playlist item swaps
 * the player; optional team filters narrow the list.
 */
export function DemoTheater({ demos, showFilters = false }: { demos: DemoVideo[]; showFilters?: boolean }) {
  const [team, setTeam] = useState<Department | null>(null);
  const visible = useMemo(() => (team ? demos.filter((d) => d.department === team) : demos), [demos, team]);
  const [activeSlug, setActiveSlug] = useState(demos[0]?.slug);
  const active = visible.find((d) => d.slug === activeSlug) ?? visible[0];
  const teams = DEPARTMENTS.filter((d) => demos.some((x) => x.department === d));

  if (!active) return null;

  return (
    <div>
      {showFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter demos by team">
          {[null, ...teams].map((t) => {
            const selected = team === t;
            return (
              <button
                key={t ?? "all"}
                type="button"
                aria-pressed={selected}
                onClick={() => setTeam(t)}
                className={cn(
                  "rounded-md border px-3 py-1 text-sm font-medium transition-colors",
                  selected ? "border-ink bg-ink text-white" : "border-line bg-card text-ink-soft hover:border-line-strong hover:text-ink",
                )}
              >
                {t ?? "All demos"}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* player + details */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <VideoPlayer demo={active} />
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={departmentColor[active.department].soft}>{active.department}</Badge>
                    {active.integrations.map((i) => (
                      <Badge key={i}>{i}</Badge>
                    ))}
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">{active.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{active.summary}</p>
                </div>
                {active.workflowSlug && (
                  <Link
                    href={`/showroom?workflow=${active.workflowSlug}`}
                    className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-coral-deep hover:underline"
                  >
                    View the workflow <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* playlist */}
        <div className="pop flex flex-col self-start overflow-hidden rounded-card bg-card lg:max-h-[560px]">
          <p className="border-b border-line px-4 py-3 text-xs font-semibold tracking-wider text-ink-mute uppercase">
            {visible.length} {visible.length === 1 ? "demo" : "demos"}
          </p>
          <ul className="scrollbar-thin divide-y divide-line overflow-y-auto">
            {visible.map((d) => {
              const selected = d.slug === active.slug;
              return (
                <li key={d.slug}>
                  <button
                    type="button"
                    onClick={() => setActiveSlug(d.slug)}
                    aria-current={selected || undefined}
                    className={cn(
                      "relative flex w-full gap-3 p-3 text-left transition-colors",
                      selected ? "bg-coral-tint/60" : "hover:bg-paper",
                    )}
                  >
                    {selected && <span className="absolute inset-y-0 left-0 w-1 bg-coral" aria-hidden />}
                    <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md border border-line">
                      <DemoPoster demo={d} compact />
                      <span className="absolute right-1 bottom-1 rounded bg-ink/75 px-1 font-mono text-[10px] text-white">
                        {d.duration}
                      </span>
                    </span>
                    <span className="min-w-0 py-0.5">
                      <span className="line-clamp-2 text-sm leading-snug font-semibold text-ink">{d.title}</span>
                      <span className="mt-1 flex items-center gap-1.5 text-xs text-ink-mute">
                        <span className={cn("h-1.5 w-1.5 rounded-full", departmentColor[d.department].solid)} aria-hidden />
                        {d.department}
                        {!d.source && <span className="text-ink-mute/80">· Coming soon</span>}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
