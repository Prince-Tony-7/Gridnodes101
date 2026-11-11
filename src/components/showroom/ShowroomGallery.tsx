"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";
import { useWorkflowFilters } from "@/hooks/useWorkflowFilters";
import { collectIntegrations } from "@/lib/workflows";
import type { Workflow } from "@/lib/types";
import { FilterBar } from "./FilterBar";
import { WorkflowCard } from "./WorkflowCard";
import { WorkflowDetailModal } from "./WorkflowDetailModal";

const PARAM = "workflow";

/**
 * Client island for the showroom: owns filter state and the detail modal.
 * The open workflow is mirrored to `?workflow=<slug>` so details are deep-linkable
 * and the browser back button closes the modal.
 */
export function ShowroomGallery({ workflows }: { workflows: Workflow[] }) {
  const searchParams = useSearchParams();
  const integrations = useMemo(() => collectIntegrations(workflows), [workflows]);
  const f = useWorkflowFilters(workflows);

  const selectedSlug = searchParams.get(PARAM);
  const selected = useMemo(() => workflows.find((w) => w.slug === selectedSlug) ?? null, [workflows, selectedSlug]);

  // True when the modal was opened in-app (pushState); closing then pops that entry so
  // Back/Forward stay consistent. Direct deep-link visits close via replaceState instead.
  const pushedRef = useRef(false);

  const open = useCallback(
    (slug: string) => {
      pushedRef.current = true;
      const params = new URLSearchParams(searchParams.toString());
      params.set(PARAM, slug);
      // window.location.pathname (unlike usePathname) includes the deploy basePath.
      window.history.pushState(null, "", `${window.location.pathname}?${params.toString()}`);
    },
    [searchParams],
  );

  const close = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete(PARAM);
    const qs = params.toString();
    const path = window.location.pathname;
    window.history.replaceState(null, "", qs ? `${path}?${qs}` : path);
  }, [searchParams]);

  return (
    <>
      <FilterBar
        filters={f.filters}
        integrations={integrations}
        active={f.active}
        resultCount={f.results.length}
        totalCount={workflows.length}
        onQueryChange={f.setQuery}
        onToggleDepartment={f.toggleDepartment}
        onToggleIntegration={f.toggleIntegration}
        onComplexityChange={f.setComplexity}
        onReset={f.reset}
      />

      <motion.ul layout className="mt-10 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {f.results.map((w) => (
            <motion.li
              key={w.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              <WorkflowCard workflow={w} onSelect={open} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {f.results.length === 0 && (
        <div className="pop mt-8 flex flex-col items-center rounded-card bg-sun-tint px-6 py-16 text-center">
          <span className="inline-block animate-wiggle text-5xl" aria-hidden>
            🔌
          </span>
          <p className="mt-4 font-display text-2xl font-bold text-ink">Nothing wired up for that combo yet.</p>
          <p className="mt-1 text-ink-soft">Drop a filter, or tell us what you need and we&rsquo;ll build it.</p>
          <button
            type="button"
            onClick={f.reset}
            className="mt-6 rounded-full border-2 border-ink bg-card px-4 py-2 font-semibold shadow-pop-sm hover:bg-sun"
          >
            Reset filters
          </button>
        </div>
      )}

      <WorkflowDetailModal workflow={selected} onClose={close} />
    </>
  );
}
