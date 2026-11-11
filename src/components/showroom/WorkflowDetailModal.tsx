"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cpu, Map as MapIcon, TrendingUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { cn } from "@/lib/cn";
import { complexityColor, departmentColor } from "@/lib/palette";
import type { Workflow } from "@/lib/types";
import { JsonCodePanel } from "./JsonCodePanel";
import { NodeExplainer } from "./NodeExplainer";
import { VisualMapPlaceholder } from "./VisualMapPlaceholder";

type TabId = "map" | "roi" | "specs";

const TABS: readonly TabItem<TabId>[] = [
  { id: "map", label: "Visual Map", icon: <MapIcon className="h-4 w-4" aria-hidden />, color: "bg-card" },
  { id: "roi", label: "Business ROI", icon: <TrendingUp className="h-4 w-4" aria-hidden />, color: "bg-card" },
  { id: "specs", label: "Technical Specs", icon: <Cpu className="h-4 w-4" aria-hidden />, color: "bg-card" },
];

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

interface WorkflowDetailModalProps {
  workflow: Workflow | null;
  onClose: () => void;
}

export function WorkflowDetailModal({ workflow, onClose }: WorkflowDetailModalProps) {
  return (
    <AnimatePresence>
      {workflow && <ModalContent key={workflow.slug} workflow={workflow} onClose={onClose} />}
    </AnimatePresence>
  );
}

function ModalContent({ workflow, onClose }: { workflow: Workflow; onClose: () => void }) {
  const [tab, setTab] = useState<TabId>("map");
  const dialogRef = useRef<HTMLDivElement>(null);

  // Scroll lock, initial focus, focus restore, Escape + focus trap.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      );
      const first = focusables[0];
      const last = focusables.at(-1);
      if (!first || !last) return;
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const titleId = `wf-${workflow.slug}-title`;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        className="relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-line bg-paper shadow-pop-lg focus:outline-none sm:rounded-2xl"
      >
        {/* Header */}
        <div
          className={cn(
            "sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-card px-6 py-5",
          )}
        >
          <span className={cn("absolute inset-x-0 top-0 h-1", departmentColor[workflow.department].solid)} aria-hidden />
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge className={departmentColor[workflow.department].soft}>{workflow.department}</Badge>
              <Badge className={complexityColor[workflow.complexity]}>{workflow.complexity}</Badge>
            </div>
            <h2 id={titleId} className="text-2xl leading-tight font-semibold tracking-tight text-ink sm:text-3xl">
              {workflow.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close workflow details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-card text-ink-soft transition-colors hover:bg-paper hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="scrollbar-thin overflow-y-auto px-6 py-6">
          <p className="max-w-3xl text-lg leading-relaxed text-ink-soft">{workflow.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {workflow.tags.map((t) => (
              <li key={t} className="rounded-md border border-line bg-card px-2.5 py-0.5 text-sm text-ink-soft">
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <section aria-labelledby={`${titleId}-nodes`}>
              <h3 id={`${titleId}-nodes`} className="mb-4 text-lg font-semibold text-ink">
                How it works, node by node
              </h3>
              <NodeExplainer nodes={workflow.nodes} />
            </section>

            <section aria-label="Workflow details">
              <Tabs items={TABS} value={tab} onChange={setTab}>
                {(active, panelProps) => (
                  <div {...panelProps} className="focus:outline-none">
                    {active === "map" && <VisualMapPlaceholder nodes={workflow.nodes} />}
                    {active === "roi" && <RoiPanel workflow={workflow} />}
                    {active === "specs" && <SpecsPanel workflow={workflow} />}
                  </div>
                )}
              </Tabs>
            </section>
          </div>

          <div className="mt-8">
            <JsonCodePanel json={workflow.n8nJson} fileName={workflow.slug} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const ROI_ACCENTS = ["bg-mint", "bg-sky", "bg-violet", "bg-coral"];

function RoiPanel({ workflow }: { workflow: Workflow }) {
  return (
    <div className="space-y-5">
      <p className="font-display text-xl leading-snug font-semibold text-ink">{workflow.roi.headline}</p>
      <dl className="grid grid-cols-2 gap-3">
        {workflow.roi.metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 24, delay: i * 0.06 }}
            className="relative flex flex-col overflow-hidden rounded-xl border border-line bg-card p-4 pl-5 shadow-pop-sm"
          >
            <span className={cn("absolute inset-y-0 left-0 w-1", ROI_ACCENTS[i % ROI_ACCENTS.length])} aria-hidden />
            <dd className="order-1 font-display text-3xl font-semibold tracking-tight text-ink">{m.value}</dd>
            <dt className="order-2 mt-1 text-sm font-medium text-ink-soft">
              {m.label}
              {m.context && <span className="block font-normal text-ink-mute">{m.context}</span>}
            </dt>
          </motion.div>
        ))}
      </dl>
      <p className="leading-relaxed text-ink-soft">{workflow.roi.narrative}</p>
    </div>
  );
}

function SpecsPanel({ workflow }: { workflow: Workflow }) {
  const { specs } = workflow;
  const rows: Array<[string, React.ReactNode]> = [
    ["Trigger", specs.trigger],
    ["Avg. execution", specs.avgExecutionTime],
    ["Throughput", specs.throughput],
    ["Error handling", specs.errorHandling],
    ["Hosting", specs.hosting],
    ["n8n version", specs.n8nVersion],
    [
      "Credentials",
      <ul key="creds" className="flex flex-wrap gap-1.5">
        {specs.credentials.map((c) => (
          <li key={c}>
            <Badge>{c}</Badge>
          </li>
        ))}
      </ul>,
    ],
  ];

  return (
    <dl className="pop divide-y divide-line overflow-hidden rounded-xl bg-card">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[130px_1fr] sm:gap-4">
          <dt className="text-sm font-medium text-ink">{label}</dt>
          <dd className="text-sm text-ink-soft">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
