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

const smallBtn =
  "inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 text-xs font-bold shadow-pop-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

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
    <div className="pop overflow-hidden rounded-2xl bg-violet-tint">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="inline-flex items-center gap-2 font-bold text-ink"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink bg-violet text-white">
            <FileJson className="h-4 w-4" aria-hidden />
          </span>
          {expanded ? "Hide" : "Show"} the n8n JSON
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} aria-hidden />
          <span className="text-xs font-medium text-ink-mute">{sizeKb} KB</span>
        </button>

        <div className="flex items-center gap-2">
          <button type="button" onClick={download} className={cn(smallBtn, "bg-card")}>
            <Download className="h-3.5 w-3.5" aria-hidden /> .json
          </button>
          <motion.button
            type="button"
            onClick={() => copy(json)}
            animate={status === "copied" ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              smallBtn,
              "min-w-40",
              status === "copied" ? "bg-mint" : status === "error" ? "bg-coral" : "bg-sun",
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
          </motion.button>
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
            className="overflow-hidden border-t-2 border-ink"
          >
            <CodeBlock code={json} className="max-h-[420px]" />
            <p className="border-t-2 border-ink bg-card px-4 py-2.5 text-xs text-ink-soft">
              In n8n, open a blank workflow and paste (Ctrl/⌘ + V) onto the canvas. Swap in your own credentials before
              activating.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
