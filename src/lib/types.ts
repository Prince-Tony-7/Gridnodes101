/**
 * Domain model for an n8n automation sample.
 *
 * These types are intentionally decoupled from the data source so that
 * `src/data/workflowsData.ts` can later be swapped for a CMS or API
 * (see `src/lib/workflows.ts` for the repository layer).
 */

export const DEPARTMENTS = ["Admin", "Finance", "Operations", "Sales"] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const COMPLEXITIES = ["Basic", "Advanced"] as const;
export type Complexity = (typeof COMPLEXITIES)[number];

/** Tools used in the example workflows (the ones I work with day to day). */
export const INTEGRATIONS = ["Gmail", "Google Sheets", "Excel", "Slack", "OpenAI", "Supabase"] as const;
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

export interface TechnicalSpecs {
  trigger: string;
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
  /** Plain-English description of what the workflow takes off someone's plate. No invented figures. */
  value: {
    headline: string;
    points: string[];
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

/** Where a demo recording is hosted. */
export type VideoSource =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "loom"; id: string }
  /** A file in /public, e.g. "/videos/lead-router.mp4". */
  | { kind: "file"; src: string };

export interface DemoVideo {
  slug: string;
  title: string;
  summary: string;
  department: Department;
  /** e.g. "2:45"; omit until the recording exists. */
  duration?: string;
  /** Tools shown in the video. */
  integrations: string[];
  /** Steps drawn on the poster while no thumbnail is set. */
  steps: Array<{ label: string; kind: NodeKind }>;
  /** Optional poster image in /public, e.g. "/videos/lead-router.jpg". */
  poster?: string;
  /** Leave undefined until the recording is ready: the card shows "coming soon". */
  source?: VideoSource;
  /** Links the demo to a showroom workflow, if there is one. */
  workflowSlug?: string;
}
