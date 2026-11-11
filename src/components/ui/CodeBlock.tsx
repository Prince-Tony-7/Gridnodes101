import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { tokenizeJson, type JsonTokenType } from "@/lib/highlightJson";

const tokenClass: Record<JsonTokenType, string> = {
  key: "text-syntax-key",
  string: "text-syntax-string",
  number: "text-syntax-number",
  literal: "text-syntax-literal",
  punct: "text-syntax-punct",
  plain: "",
};

/** Read-only JSON viewer with line numbers and token-level highlighting. */
export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const tokens = useMemo(() => tokenizeJson(code), [code]);
  const lineCount = useMemo(() => code.split("\n").length, [code]);

  return (
    <div className={cn("scrollbar-thin overflow-auto bg-code", className)}>
      <div className="flex min-w-max font-mono text-[12.5px] leading-6">
        <div
          aria-hidden
          className="sticky left-0 border-r border-code-line bg-code px-3 py-4 text-right text-syntax-punct/60 select-none"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="px-4 py-4 text-[#f3ece0]">
          <code>
            {tokens.map((t, i) => (
              <span key={i} className={tokenClass[t.type]}>
                {t.value}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
