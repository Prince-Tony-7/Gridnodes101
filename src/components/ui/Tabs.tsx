"use client";

import { motion } from "framer-motion";
import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: ReactNode;
}

interface TabsProps<T extends string> {
  items: readonly TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Render function so panels are associated with tabs via ARIA ids. */
  children: (active: T, panelProps: { id: string; role: "tabpanel"; "aria-labelledby": string; tabIndex: 0 }) => ReactNode;
}

/** Accessible tablist (roving tabindex, arrow/Home/End keys) with an animated indicator. */
export function Tabs<T extends string>({ items, value, onChange, children }: TabsProps<T>) {
  const baseId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    const item = items[next];
    if (!item) return;
    onChange(item.id);
    refs.current[next]?.focus();
  };

  const tabId = (id: T) => `${baseId}-tab-${id}`;
  const panelId = (id: T) => `${baseId}-panel-${id}`;

  return (
    <div>
      <div role="tablist" className="flex gap-1 rounded-lg border border-line bg-surface-sunken p-1">
        {items.map((item, i) => {
          const selected = item.id === value;
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={tabId(item.id)}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={panelId(item.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(item.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
                selected ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  className="absolute inset-0 rounded-md border border-line-strong bg-surface-raised"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative inline-flex items-center gap-1.5">
                {item.icon}
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        {children(value, { id: panelId(value), role: "tabpanel", "aria-labelledby": tabId(value), tabIndex: 0 })}
      </div>
    </div>
  );
}
