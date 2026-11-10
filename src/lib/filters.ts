import type { Workflow, WorkflowFilters } from "@/lib/types";

export const EMPTY_FILTERS: WorkflowFilters = {
  query: "",
  departments: [],
  integrations: [],
  complexity: null,
};

export function isFilterActive(filters: WorkflowFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.departments.length > 0 ||
    filters.integrations.length > 0 ||
    filters.complexity !== null
  );
}

function matchesQuery(workflow: Workflow, query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = [
    workflow.title,
    workflow.tagline,
    workflow.description,
    workflow.department,
    ...workflow.tags,
    ...workflow.integrations,
    ...workflow.nodes.map((n) => n.name),
  ]
    .join(" ")
    .toLowerCase();

  return terms.every((term) => haystack.includes(term));
}

/**
 * Pure filter function.
 * - Search: every whitespace-separated term must match (AND).
 * - Departments: OR within the facet.
 * - Integrations: workflow must use ALL selected integrations (AND), which is
 *   what buyers expect when asking "show me HubSpot + Slack automations".
 * - Complexity: single-select.
 */
export function filterWorkflows(workflows: Workflow[], filters: WorkflowFilters): Workflow[] {
  return workflows.filter(
    (w) =>
      matchesQuery(w, filters.query) &&
      (filters.departments.length === 0 || filters.departments.includes(w.department)) &&
      filters.integrations.every((i) => w.integrations.includes(i)) &&
      (filters.complexity === null || w.complexity === filters.complexity),
  );
}

export function toggleInList<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
