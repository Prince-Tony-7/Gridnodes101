"use client";

import { motion } from "framer-motion";
import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: ReactNode;
  /** Background class for the active indicator, e.g. `bg-sky`. */
  color?: string;
}

interface TabsProps<T extends string> {
  items: readonly TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Render function so panels are associated with tabs via ARIA ids. */
  children: (active: T, panelProps: { id: string; role: "tabpanel"; "aria-labelledby": string; tabIndex: 0 }) => ReactNode;
}

/** Accessible tablist (roving tabindex, arrow/Home/End keys) with an animated, colour-changing indicator. */
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
      <div role="tablist" className="flex gap-1 rounded-full border-2 border-ink bg-card p-1">
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
                "relative z-0 flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-xs font-bold transition-colors sm:px-3 sm:text-sm",
                selected ? "text-ink" : "text-ink-soft hover:text-ink",
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  className={cn("absolute inset-0 -z-10 rounded-full border-2 border-ink", item.color ?? "bg-sun")}
                  transition={{ type: "spring", stiffness: 480, damping: 34 }}
                />
              )}
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="mt-5">
        {children(value, { id: panelId(value), role: "tabpanel", "aria-labelledby": tabId(value), tabIndex: 0 })}
      </div>
    </div>
  );
}
