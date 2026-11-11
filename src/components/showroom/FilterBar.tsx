"use client";

import { Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { complexityColor, departmentColor, rotation } from "@/lib/palette";
import {
  COMPLEXITIES,
  DEPARTMENTS,
  type Complexity,
  type Department,
  type Integration,
  type WorkflowFilters,
} from "@/lib/types";

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

/** Selected chips fill with their own colour and pop out; idle chips stay paper. */
function Chip({
  selected,
  onClick,
  color,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  color: string;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-full border-2 border-ink px-3.5 py-1 text-sm font-semibold transition-all duration-150",
        selected ? cn(color, "-translate-y-0.5 shadow-pop-sm") : "bg-card text-ink hover:bg-paper-deep",
      )}
    >
      {children}
    </button>
  );
}

function FacetGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="mb-2.5 w-full text-sm font-bold text-ink">{label}</legend>
      {children}
    </fieldset>
  );
}

export function FilterBar(props: FilterBarProps) {
  const { filters, integrations, active, resultCount, totalCount } = props;

  return (
    <div className="pop rounded-card bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search workflows</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink" aria-hidden />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => props.onQueryChange(e.target.value)}
            placeholder="Try “stripe”, “AI” or “slack”…"
            className="w-full rounded-full border-2 border-ink bg-paper py-3 pr-4 pl-12 text-base text-ink placeholder:text-ink-mute focus:bg-sun-tint focus:outline-none"
          />
        </label>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <p className="text-sm font-semibold text-ink-soft" aria-live="polite">
            <span className="font-display text-xl font-extrabold text-ink">{resultCount}</span> of {totalCount}
          </p>
          {active && (
            <button
              type="button"
              onClick={props.onReset}
              className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-coral-tint px-3 py-1 text-sm font-semibold hover:bg-coral"
            >
              <X className="h-4 w-4" aria-hidden /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[auto_auto_1fr] lg:gap-10">
        <FacetGroup label="Team">
          {DEPARTMENTS.map((d) => (
            <Chip
              key={d}
              selected={filters.departments.includes(d)}
              color={departmentColor[d].solid}
              onClick={() => props.onToggleDepartment(d)}
            >
              {d}
            </Chip>
          ))}
        </FacetGroup>
        <FacetGroup label="Complexity">
          {COMPLEXITIES.map((c) => (
            <Chip key={c} selected={filters.complexity === c} color={complexityColor[c]} onClick={() => props.onComplexityChange(c)}>
              {c}
            </Chip>
          ))}
        </FacetGroup>
        <FacetGroup label="Integrations">
          {integrations.map((i, idx) => (
            <Chip
              key={i}
              selected={filters.integrations.includes(i)}
              color={rotation[idx % rotation.length]!}
              onClick={() => props.onToggleIntegration(i)}
            >
              {i}
            </Chip>
          ))}
        </FacetGroup>
      </div>
    </div>
  );
}
