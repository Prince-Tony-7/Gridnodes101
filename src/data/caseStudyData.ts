/**
 * Case study: three n8n workflows I built for my employer, an Irish medical
 * device company. ANONYMISED: node labels are generic, and no code, prices,
 * site names, product names, system names or data fields are included.
 *
 * Canvas positions and connections are taken from the real workflow exports,
 * so the diagrams show the actual shape of each workflow.
 */

export type CanvasIcon = "mail" | "code" | "branch" | "sheet" | "edit" | "ai" | "model" | "merge" | "http" | "loop";

export interface CanvasNode {
  id: string;
  label: string;
  icon: CanvasIcon;
  trigger: boolean;
  x: number;
  y: number;
}

export interface CanvasEdge {
  from: string;
  to: string;
  /** Output index on the source node (e.g. 0 = true/ready, 1 = false/reject). */
  output: number;
  outputs: number;
  /** AI sub-node connection (model -> chain), drawn dashed. */
  ai?: boolean;
}

export interface CaseStudyWorkflow {
  slug: string;
  title: string;
  oneLiner: string;
  trigger: string;
  output: string;
  nodeCount: number;
  stages: Array<{ title: string; body: string }>;
  canvas: { nodes: CanvasNode[]; edges: CanvasEdge[] };
}

export const caseStudyWorkflows: CaseStudyWorkflow[] = [
  {
    slug: "exception-report",
    title: "Exception report",
    oneLiner: "A checked export arrives by email; every problem row is flagged, grouped by site and sent back in a colour-coded workbook with a short AI-written summary.",
    trigger: "An email with the export attached, labelled for processing in Gmail",
    output: "One workbook with an overview tab and a tab per site, hard exceptions in red and review items in amber, plus a short summary email",
    nodeCount: 23,
    stages: [
      { title: "Check the input", body: "Finds the Excel attachment and checks the columns are what the rules expect. If anything is missing, the sender gets an email saying exactly what to fix." },
      { title: "Apply the exception rules", body: "Every row is checked: invalid or missing dates, missing or badly formatted reference numbers, accessories without the main item they belong to, overlapping or duplicate records, the same reference under two different names, and names that look like a one-letter typo of another record." },
      { title: "Group and build the workbook", body: "Rows are grouped by site with exceptions first, sorted by severity, then written into a styled workbook. Hard exceptions are red, items to review are amber." },
      { title: "Summarise with a self-hosted AI model", body: "Only the counts (rows processed, exceptions by type and by site) are given to a self-hosted AI model (Ollama), which writes a short covering email. The rows themselves are never sent to the model or to an outside AI service." },
      { title: "Send and tidy up", body: "The workbook and summary are emailed back, and the original email is labelled processed and marked read so it is never handled twice." },
    ],
    canvas: {
      nodes: [
        { id: "n0", label: "Report email arrives", icon: "mail", trigger: true, x: -16, y: 32 },
        { id: "n1", label: "Ready or reject?", icon: "branch", trigger: false, x: 432, y: 32 },
        { id: "n2", label: "Find Excel attachment", icon: "code", trigger: false, x: 208, y: 32 },
        { id: "n3", label: "Read spreadsheet", icon: "sheet", trigger: false, x: 656, y: -48 },
        { id: "n4", label: "Group by site", icon: "code", trigger: false, x: 1552, y: -96 },
        { id: "n5", label: "Build workbook", icon: "code", trigger: false, x: 1776, y: -96 },
        { id: "n6", label: "Write summary (AI)", icon: "ai", trigger: false, x: 2224, y: 32 },
        { id: "n7", label: "Exception rules", icon: "code", trigger: false, x: 1328, y: -96 },
        { id: "n8", label: "Local AI model", icon: "model", trigger: false, x: 2304, y: 256 },
        { id: "n9", label: "Combine report + text", icon: "merge", trigger: false, x: 3024, y: -96 },
        { id: "n10", label: "Email rejection reason", icon: "mail", trigger: false, x: 1328, y: 256 },
        { id: "n11", label: "Prepare summary facts", icon: "edit", trigger: false, x: 2000, y: 32 },
        { id: "n12", label: "Tidy AI text", icon: "edit", trigger: false, x: 2576, y: 32 },
        { id: "n13", label: "Email the report", icon: "mail", trigger: false, x: 3248, y: -96 },
        { id: "n14", label: "Label failed", icon: "mail", trigger: false, x: 1552, y: 256 },
        { id: "n15", label: "Clean email text", icon: "edit", trigger: false, x: 2800, y: 32 },
        { id: "n16", label: "Label processed", icon: "mail", trigger: false, x: 3472, y: -96 },
        { id: "n17", label: "Clear intake label", icon: "mail", trigger: false, x: 3696, y: -96 },
        { id: "n18", label: "Mark read", icon: "mail", trigger: false, x: 3920, y: -96 },
        { id: "n19", label: "Clear intake label", icon: "mail", trigger: false, x: 1776, y: 256 },
        { id: "n20", label: "Check columns", icon: "code", trigger: false, x: 880, y: -48 },
        { id: "n21", label: "Columns OK?", icon: "branch", trigger: false, x: 1104, y: -48 },
        { id: "n22", label: "Mark read", icon: "mail", trigger: false, x: 2000, y: 256 },
      ],
      edges: [
        { from: "n0", to: "n2", output: 0, outputs: 1 },
        { from: "n2", to: "n1", output: 0, outputs: 1 },
        { from: "n1", to: "n3", output: 0, outputs: 2 },
        { from: "n1", to: "n10", output: 1, outputs: 2 },
        { from: "n3", to: "n20", output: 0, outputs: 1 },
        { from: "n4", to: "n5", output: 0, outputs: 1 },
        { from: "n7", to: "n4", output: 0, outputs: 1 },
        { from: "n5", to: "n11", output: 0, outputs: 1 },
        { from: "n5", to: "n9", output: 0, outputs: 1 },
        { from: "n8", to: "n6", output: 0, outputs: 1, ai: true },
        { from: "n6", to: "n12", output: 0, outputs: 1 },
        { from: "n9", to: "n13", output: 0, outputs: 1 },
        { from: "n11", to: "n6", output: 0, outputs: 1 },
        { from: "n12", to: "n15", output: 0, outputs: 1 },
        { from: "n14", to: "n19", output: 0, outputs: 1 },
        { from: "n10", to: "n14", output: 0, outputs: 1 },
        { from: "n13", to: "n16", output: 0, outputs: 1 },
        { from: "n15", to: "n9", output: 0, outputs: 1 },
        { from: "n16", to: "n17", output: 0, outputs: 1 },
        { from: "n17", to: "n18", output: 0, outputs: 1 },
        { from: "n20", to: "n21", output: 0, outputs: 1 },
        { from: "n21", to: "n7", output: 0, outputs: 2 },
        { from: "n21", to: "n10", output: 1, outputs: 2 },
        { from: "n19", to: "n22", output: 0, outputs: 1 },
      ],
    },
  },
  {
    slug: "monthly-billing",
    title: "Monthly billing workbooks",
    oneLiner: "A monthly export becomes one billing workbook per customer site, with chargeable days recalculated from the dates rather than trusted from the export.",
    trigger: "An email with the monthly export attached; the billing month is read from the subject line (or worked out from the data)",
    output: "One workbook per site, a sheet per ward, sections per product with subtotals and a ward total, emailed back to the sender",
    nodeCount: 14,
    stages: [
      { title: "Find the file and the month", body: "Picks the Excel attachment and reads the billing month and year from the subject line. If the subject doesn’t say, it works out the most common month from the data." },
      { title: "Validate and tidy", body: "Checks every required column is present and normalises the rows. Missing columns or an unknown month send a clear failure email back instead of a wrong report." },
      { title: "Recalculate chargeable days", body: "Days are recalculated from the start and end dates inside the billing month, rather than trusting the figure in the export. Some items are only charged on scheduled days, and any row where the export’s figure disagrees is highlighted." },
      { title: "Price items that are billed together", body: "When two items are used together by the same customer on the same day they are billed as one pack, matched day by day: within the same ward first, then across wards at the same site." },
      { title: "Build and send the workbooks", body: "Writes a styled workbook per site with a sheet per ward, product sections, subtotals and ward totals, emails them back and labels the original email processed." },
    ],
    canvas: {
      nodes: [
        { id: "n0", label: "Export email arrives", icon: "mail", trigger: true, x: 0, y: 80 },
        { id: "n1", label: "Find file + month", icon: "code", trigger: false, x: 224, y: 80 },
        { id: "n2", label: "Ready or reject?", icon: "branch", trigger: false, x: 448, y: 80 },
        { id: "n3", label: "Read export sheet", icon: "sheet", trigger: false, x: 672, y: 16 },
        { id: "n4", label: "Check + tidy rows", icon: "code", trigger: false, x: 896, y: 16 },
        { id: "n5", label: "Columns OK?", icon: "branch", trigger: false, x: 1120, y: 16 },
        { id: "n6", label: "Build billing workbooks", icon: "code", trigger: false, x: 1344, y: -64 },
        { id: "n7", label: "Email workbooks", icon: "mail", trigger: false, x: 1792, y: -112 },
        { id: "n8", label: "Label processed", icon: "mail", trigger: false, x: 2016, y: -112 },
        { id: "n9", label: "Clear intake label", icon: "mail", trigger: false, x: 2240, y: -112 },
        { id: "n10", label: "Email failure reason", icon: "mail", trigger: false, x: 1792, y: 128 },
        { id: "n11", label: "Label failed", icon: "mail", trigger: false, x: 2016, y: 128 },
        { id: "n12", label: "Clear intake label", icon: "mail", trigger: false, x: 2240, y: 128 },
        { id: "n13", label: "Built OK?", icon: "branch", trigger: false, x: 1568, y: -64 },
      ],
      edges: [
        { from: "n0", to: "n1", output: 0, outputs: 1 },
        { from: "n1", to: "n2", output: 0, outputs: 1 },
        { from: "n2", to: "n3", output: 0, outputs: 2 },
        { from: "n2", to: "n10", output: 1, outputs: 2 },
        { from: "n3", to: "n4", output: 0, outputs: 1 },
        { from: "n4", to: "n5", output: 0, outputs: 1 },
        { from: "n5", to: "n10", output: 0, outputs: 2 },
        { from: "n5", to: "n6", output: 1, outputs: 2 },
        { from: "n6", to: "n13", output: 0, outputs: 1 },
        { from: "n7", to: "n8", output: 0, outputs: 1 },
        { from: "n8", to: "n9", output: 0, outputs: 1 },
        { from: "n10", to: "n11", output: 0, outputs: 1 },
        { from: "n11", to: "n12", output: 0, outputs: 1 },
        { from: "n13", to: "n10", output: 0, outputs: 2 },
        { from: "n13", to: "n7", output: 1, outputs: 2 },
      ],
    },
  },
  {
    slug: "daily-sheets",
    title: "Categorised daily sheets",
    oneLiner: "Daily Excel files sent by email are sorted into category sheets and replied to in the same email thread.",
    trigger: "A daily email with one or more Excel files attached (old .xls or newer .xlsx)",
    output: "A workbook per file with a sheet per category plus an “All” sheet, sent as a reply in the original thread",
    nodeCount: 25,
    stages: [
      { title: "Pick up the email safely", body: "Reads the sender and message details, then swaps the intake label for a “processing” label so the same email can’t be picked up twice while it runs." },
      { title: "Collect every attachment", body: "Fetches the full message and finds every Excel attachment, downloading any that Gmail doesn’t include inline. Each file is handled in turn." },
      { title: "Read old and new Excel formats", body: "Converts each attachment to a file and reads it with the right reader for .xls or .xlsx, then combines the rows." },
      { title: "Categorise every row", body: "Each row is sorted into a category using keyword rules on the product and job details, with explicit overrides for the edge cases, then written to a styled sheet per category plus an overview sheet." },
      { title: "Reply in the same thread", body: "All processed files are attached to a reply on the original email, which is then labelled processed and marked read." },
    ],
    canvas: {
      nodes: [
        { id: "n0", label: "Daily email arrives", icon: "mail", trigger: true, x: -480, y: 64 },
        { id: "n1", label: "Read sender + IDs", icon: "code", trigger: false, x: -256, y: 64 },
        { id: "n2", label: "Label processing", icon: "mail", trigger: false, x: -32, y: 64 },
        { id: "n3", label: "Clear intake label", icon: "mail", trigger: false, x: 192, y: 64 },
        { id: "n4", label: "Fetch full message", icon: "http", trigger: false, x: 416, y: 64 },
        { id: "n5", label: "Find Excel files", icon: "code", trigger: false, x: 640, y: 64 },
        { id: "n6", label: "Loop each file", icon: "loop", trigger: false, x: 864, y: 64 },
        { id: "n7", label: "Needs download?", icon: "branch", trigger: false, x: 1088, y: 64 },
        { id: "n8", label: "Join file details", icon: "merge", trigger: false, x: 1536, y: -16 },
        { id: "n9", label: "Download attachment", icon: "http", trigger: false, x: 1312, y: -80 },
        { id: "n10", label: "Tidy downloaded file", icon: "code", trigger: false, x: 1760, y: -16 },
        { id: "n11", label: "Tidy inline file", icon: "code", trigger: false, x: 1760, y: 208 },
        { id: "n12", label: "Combine files", icon: "merge", trigger: false, x: 1984, y: 96 },
        { id: "n13", label: "Old .xls format?", icon: "branch", trigger: false, x: 2432, y: 96 },
        { id: "n14", label: "Convert to file", icon: "sheet", trigger: false, x: 2208, y: 96 },
        { id: "n15", label: "Read .xls", icon: "sheet", trigger: false, x: 2656, y: -16 },
        { id: "n16", label: "Read .xlsx", icon: "sheet", trigger: false, x: 2656, y: 208 },
        { id: "n17", label: "Combine rows", icon: "merge", trigger: false, x: 2880, y: 96 },
        { id: "n18", label: "Categorise + build workbook", icon: "code", trigger: false, x: 3104, y: 96 },
        { id: "n19", label: "Save workbook", icon: "sheet", trigger: false, x: 3328, y: 160 },
        { id: "n20", label: "Gather results", icon: "code", trigger: false, x: 1088, y: -272 },
        { id: "n21", label: "Reply with sheets", icon: "mail", trigger: false, x: 1312, y: -272 },
        { id: "n22", label: "Label processed", icon: "mail", trigger: false, x: 1536, y: -272 },
        { id: "n23", label: "Clear processing label", icon: "mail", trigger: false, x: 1760, y: -272 },
        { id: "n24", label: "Mark read", icon: "mail", trigger: false, x: 1984, y: -272 },
      ],
      edges: [
        { from: "n0", to: "n1", output: 0, outputs: 1 },
        { from: "n1", to: "n2", output: 0, outputs: 1 },
        { from: "n2", to: "n3", output: 0, outputs: 1 },
        { from: "n3", to: "n4", output: 0, outputs: 1 },
        { from: "n4", to: "n5", output: 0, outputs: 1 },
        { from: "n5", to: "n6", output: 0, outputs: 1 },
        { from: "n6", to: "n20", output: 0, outputs: 2 },
        { from: "n6", to: "n7", output: 1, outputs: 2 },
        { from: "n7", to: "n9", output: 0, outputs: 2 },
        { from: "n7", to: "n8", output: 0, outputs: 2 },
        { from: "n7", to: "n11", output: 1, outputs: 2 },
        { from: "n8", to: "n10", output: 0, outputs: 1 },
        { from: "n9", to: "n8", output: 0, outputs: 1 },
        { from: "n10", to: "n12", output: 0, outputs: 1 },
        { from: "n11", to: "n12", output: 0, outputs: 1 },
        { from: "n12", to: "n14", output: 0, outputs: 1 },
        { from: "n13", to: "n15", output: 0, outputs: 2 },
        { from: "n13", to: "n16", output: 1, outputs: 2 },
        { from: "n14", to: "n13", output: 0, outputs: 1 },
        { from: "n15", to: "n17", output: 0, outputs: 1 },
        { from: "n16", to: "n17", output: 0, outputs: 1 },
        { from: "n17", to: "n18", output: 0, outputs: 1 },
        { from: "n18", to: "n19", output: 0, outputs: 1 },
        { from: "n19", to: "n6", output: 0, outputs: 1 },
        { from: "n20", to: "n21", output: 0, outputs: 1 },
        { from: "n21", to: "n22", output: 0, outputs: 1 },
        { from: "n22", to: "n23", output: 0, outputs: 1 },
        { from: "n23", to: "n24", output: 0, outputs: 1 },
      ],
    },
  },
];

/**
 * TODO(Prince): fill in the measured before/after time. Leave both as null
 * until you have real numbers; the time panel only appears once both are set.
 */
export const caseStudyResultTime: { before: string | null; after: string | null; unit: string } = {
  before: null, // TODO: e.g. "X hours per month" measured before automation
  after: null, // TODO: e.g. "Y minutes per month" measured after automation
  unit: "spent on billing and exception reports",
};

/** Outcomes that follow directly from how the workflows are built (no invented figures). */
export const caseStudyOutcomes = [
  "Reports come back by email from the same written-down rules every time, instead of being rebuilt by hand.",
  "Bad input is rejected with a clear reason (missing attachment, wrong columns, no month in the subject), so nobody gets a wrong report.",
  "Every email is labelled processed or failed, so nothing is handled twice or silently skipped.",
  "Problem rows are colour-coded: red must be fixed, amber needs a second look.",
  "The AI summary runs on a self-hosted model and only sees counts, never the records themselves.",
];

export const caseStudyTools = ["n8n (self-hosted, Docker)", "Gmail", "Excel (.xls and .xlsx)", "JavaScript Code nodes", "ExcelJS", "Gmail API", "Ollama (self-hosted AI)"];
