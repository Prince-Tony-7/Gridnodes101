"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Cpu, Info, Map as MapIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { cn } from "@/lib/cn";
import { complexityColor, departmentColor } from "@/lib/palette";
import type { Workflow } from "@/lib/types";
import { JsonCodePanel } from "./JsonCodePanel";
import { NodeExplainer } from "./NodeExplainer";
import { VisualMapPlaceholder } from "./VisualMapPlaceholder";

type TabId = "map" | "value" | "specs";

const TABS: readonly TabItem<TabId>[] = [
  { id: "map", label: "Visual Map", icon: <MapIcon className="h-4 w-4" aria-hidden />, color: "bg-card" },
  { id: "value", label: "What it does", icon: <CheckCircle2 className="h-4 w-4" aria-hidden />, color: "bg-card" },
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
              <Badge className="bg-ink text-white">Example</Badge>
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
          <p className="mt-4 flex max-w-3xl items-start gap-2 rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink-soft">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-coral-deep" aria-hidden />
            This is an example template showing how I&rsquo;d approach this job, not a client deployment. Every build is
            adapted to your tools and your process.
          </p>
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
                    {active === "value" && <ValuePanel workflow={workflow} />}
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

function ValuePanel({ workflow }: { workflow: Workflow }) {
  return (
    <div className="space-y-5">
      <p className="font-display text-xl leading-snug font-semibold text-ink">{workflow.value.headline}</p>
      <ul className="space-y-3">
        {workflow.value.points.map((point, i) => (
          <motion.li
            key={point}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-start gap-3 rounded-xl border border-line bg-card p-4 shadow-pop-sm"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-tint text-mint-deep">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="leading-relaxed text-ink-soft">{point}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function SpecsPanel({ workflow }: { workflow: Workflow }) {
  const { specs } = workflow;
  const rows: Array<[string, React.ReactNode]> = [
    ["Trigger", specs.trigger],
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
