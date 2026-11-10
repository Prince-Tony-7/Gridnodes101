/**
 * Domain model for an n8n automation sample.
 *
 * These types are intentionally decoupled from the data source so that
 * `src/data/workflowsData.ts` can later be swapped for a CMS or API
 * (see `src/lib/workflows.ts` for the repository layer).
 */

export const DEPARTMENTS = ["Marketing", "Finance", "Ops", "Sales"] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const COMPLEXITIES = ["Basic", "Advanced"] as const;
export type Complexity = (typeof COMPLEXITIES)[number];

export const INTEGRATIONS = [
  "HubSpot",
  "OpenAI",
  "Stripe",
  "Slack",
  "Google Sheets",
  "Postgres",
  "Notion",
  "LinkedIn",
  "Clearbit",
  "QuickBooks",
] as const;
export type Integration = (typeof INTEGRATIONS)[number];

/** Visual role of a node — drives the accent colour in the UI. */
export type NodeKind = "trigger" | "action" | "logic" | "ai" | "output";

export interface WorkflowNode {
  id: string;
  /** Display name as it appears on the n8n canvas. */
  name: string;
  /** Underlying n8n node type, e.g. `n8n-nodes-base.webhook`. */
  type: string;
  kind: NodeKind;
  /** Plain-language summary of what this step does. */
  summary: string;
  /** Optional implementation detail surfaced in the node explainer. */
  detail?: string;
}

export interface RoiMetric {
  label: string;
  value: string;
  /** Short qualifier, e.g. "per month" or "vs. manual baseline". */
  context?: string;
}

export interface TechnicalSpecs {
  trigger: string;
  avgExecutionTime: string;
  throughput: string;
  errorHandling: string;
  hosting: string;
  credentials: string[];
  n8nVersion: string;
}

export interface Workflow {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  department: Department;
  complexity: Complexity;
  integrations: Integration[];
  tags: string[];
  nodes: WorkflowNode[];
  roi: {
    headline: string;
    metrics: RoiMetric[];
    narrative: string;
  };
  specs: TechnicalSpecs;
  /** Raw, importable n8n workflow JSON (pretty-printed). */
  n8nJson: string;
}

export interface WorkflowFilters {
  query: string;
  departments: Department[];
  integrations: Integration[];
  complexity: Complexity | null;
}
