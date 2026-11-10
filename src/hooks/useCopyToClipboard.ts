"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CopyStatus = "idle" | "copied" | "error";

/**
 * Copies text to the clipboard with a legacy fallback for non-secure contexts
 * (e.g. LAN previews over plain HTTP). Status resets automatically.
 */
export function useCopyToClipboard(resetAfterMs = 2000) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(
    async (text: string) => {
      let ok = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          ok = true;
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          ok = document.execCommand("copy");
          document.body.removeChild(textarea);
        }
      } catch {
        ok = false;
      }

      setStatus(ok ? "copied" : "error");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus("idle"), resetAfterMs);
      return ok;
    },
    [resetAfterMs],
  );

  return { copy, status };
}
