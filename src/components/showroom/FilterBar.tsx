"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { COMPLEXITIES, DEPARTMENTS, type Complexity, type Department, type Integration, type WorkflowFilters } from "@/lib/types";

interface FilterBarProps {
  filters: WorkflowFilters;
  integrations: Integration[];
  active: boolean;
  resultCount: number;
  totalCount: number;
  onQueryChange: (q: string) => void;
  onToggleDepartment: (d: Department) => void;
  onToggleIntegration: (i: Integration) => void;
  onComplexityChange: (c: Complexity | null) => void;
  onReset: () => void;
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
        selected
          ? "border-accent/50 bg-accent-soft text-accent-strong"
          : "border-line bg-surface/60 text-fg-muted hover:border-line-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function FacetGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="mb-2 w-full font-mono text-[11px] tracking-wider text-fg-subtle uppercase">{label}</legend>
      {children}
    </fieldset>
  );
}

export function FilterBar(props: FilterBarProps) {
  const { filters, integrations, active, resultCount, totalCount } = props;

  return (
    <div className="rounded-card border border-line bg-surface/60 p-5 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search workflows</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-fg-subtle" aria-hidden />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => props.onQueryChange(e.target.value)}
            placeholder="Search by name, tool, node or outcome…"
            className="w-full rounded-lg border border-line bg-surface-sunken py-2.5 pr-3 pl-9 text-sm text-fg placeholder:text-fg-subtle focus:border-accent/50 focus:outline-none"
          />
        </label>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <p className="font-mono text-xs text-fg-subtle" aria-live="polite">
            <SlidersHorizontal className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
            {resultCount} / {totalCount} workflows
          </p>
          {active && (
            <button
              type="button"
              onClick={props.onReset}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-fg-muted hover:text-fg"
            >
              <X className="h-3.5 w-3.5" aria-hidden /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[auto_auto_1fr] lg:gap-8">
        <FacetGroup label="Department">
          {DEPARTMENTS.map((d) => (
            <Chip key={d} selected={filters.departments.includes(d)} onClick={() => props.onToggleDepartment(d)}>
              {d}
            </Chip>
          ))}
        </FacetGroup>
        <FacetGroup label="Complexity">
          {COMPLEXITIES.map((c) => (
            <Chip key={c} selected={filters.complexity === c} onClick={() => props.onComplexityChange(c)}>
              {c}
            </Chip>
          ))}
        </FacetGroup>
        <FacetGroup label="Integrations">
          {integrations.map((i) => (
            <Chip key={i} selected={filters.integrations.includes(i)} onClick={() => props.onToggleIntegration(i)}>
              {i}
            </Chip>
          ))}
        </FacetGroup>
      </div>
    </div>
  );
}
