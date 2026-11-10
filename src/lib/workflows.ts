import { workflowsData } from "@/data/workflowsData";
import type { Integration, Workflow } from "@/lib/types";

/**
 * Repository layer for workflows.
 *
 * Every consumer reads workflows through these async functions. Today they
 * resolve from the static mock file; swapping to a CMS or REST API only
 * requires changing the bodies below.
 */

export async function getAllWorkflows(): Promise<Workflow[]> {
  return workflowsData;
}

export async function getWorkflowBySlug(slug: string): Promise<Workflow | undefined> {
  return workflowsData.find((w) => w.slug === slug);
}

/** Integrations that are actually used by at least one workflow, sorted A–Z. */
export function collectIntegrations(workflows: Workflow[]): Integration[] {
  return [...new Set(workflows.flatMap((w) => w.integrations))].sort((a, b) => a.localeCompare(b));
}
