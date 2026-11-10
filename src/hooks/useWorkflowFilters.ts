"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { EMPTY_FILTERS, filterWorkflows, isFilterActive, toggleInList } from "@/lib/filters";
import type { Complexity, Department, Integration, Workflow, WorkflowFilters } from "@/lib/types";

/** Encapsulates showroom filter state + derived results. */
export function useWorkflowFilters(workflows: Workflow[]) {
  const [filters, setFilters] = useState<WorkflowFilters>(EMPTY_FILTERS);
  const deferredFilters = useDeferredValue(filters);

  const results = useMemo(() => filterWorkflows(workflows, deferredFilters), [workflows, deferredFilters]);

  const setQuery = useCallback((query: string) => setFilters((f) => ({ ...f, query })), []);
  const toggleDepartment = useCallback(
    (d: Department) => setFilters((f) => ({ ...f, departments: toggleInList(f.departments, d) })),
    [],
  );
  const toggleIntegration = useCallback(
    (i: Integration) => setFilters((f) => ({ ...f, integrations: toggleInList(f.integrations, i) })),
    [],
  );
  const setComplexity = useCallback(
    (c: Complexity | null) => setFilters((f) => ({ ...f, complexity: f.complexity === c ? null : c })),
    [],
  );
  const reset = useCallback(() => setFilters(EMPTY_FILTERS), []);

  return {
    filters,
    results,
    active: isFilterActive(filters),
    setQuery,
    toggleDepartment,
    toggleIntegration,
    setComplexity,
    reset,
  };
}
