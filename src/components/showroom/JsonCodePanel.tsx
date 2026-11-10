"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Copy, Download, FileJson, TriangleAlert } from "lucide-react";
import { useId, useState } from "react";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/cn";

interface JsonCodePanelProps {
  json: string;
  fileName: string;
}

export function JsonCodePanel({ json, fileName }: JsonCodePanelProps) {
  const [expanded, setExpanded] = useState(false);
  const { copy, status } = useCopyToClipboard();
  const panelId = useId();
  const sizeKb = (new Blob([json]).size / 1024).toFixed(1);

  const download = () => {
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent-strong"
        >
          <FileJson className="h-4 w-4 text-accent-strong" aria-hidden />
          {expanded ? "Hide" : "Show"} n8n JSON
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} aria-hidden />
          <span className="font-mono text-xs text-fg-subtle">{sizeKb} KB</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs text-fg-muted hover:border-line-strong hover:text-fg"
          >
            <Download className="h-3.5 w-3.5" aria-hidden /> .json
          </button>
          <button
            type="button"
            onClick={() => copy(json)}
            className={cn(
              "inline-flex min-w-36 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              status === "copied"
                ? "bg-accent-soft text-accent-strong"
                : status === "error"
                  ? "bg-danger/15 text-danger"
                  : "bg-accent text-slate-950 hover:bg-accent-strong",
            )}
          >
            {status === "copied" ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden /> Copied!
              </>
            ) : status === "error" ? (
              <>
                <TriangleAlert className="h-3.5 w-3.5" aria-hidden /> Copy failed
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden /> Copy n8n JSON Code
              </>
            )}
          </button>
          <span className="sr-only" aria-live="polite">
            {status === "copied" ? "Workflow JSON copied to clipboard" : status === "error" ? "Copy failed" : ""}
          </span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={panelId}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line"
          >
            <CodeBlock code={json} className="max-h-[420px]" />
            <p className="border-t border-line px-4 py-2.5 text-xs text-fg-subtle">
              In n8n: open a blank workflow → paste (Ctrl/⌘ + V) onto the canvas. Replace credential placeholders before activating.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
