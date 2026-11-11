import { cn } from "@/lib/cn";
import { withBasePath } from "@/lib/basePath";
import { departmentColor } from "@/lib/palette";
import type { DemoVideo } from "@/lib/types";
import { nodeKindStyles } from "@/components/showroom/nodeKind";

/**
 * Thumbnail for a demo. Uses `poster` when provided, otherwise draws the
 * workflow's steps as a mini n8n canvas in the department's colours.
 */
export function DemoPoster({ demo, compact = false }: { demo: DemoVideo; compact?: boolean }) {
  const dept = departmentColor[demo.department];

  if (demo.poster) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export, unoptimised images
      <img src={withBasePath(demo.poster)} alt="" className="absolute inset-0 h-full w-full object-cover" />
    );
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden", dept.tint)} aria-hidden>
      <div className="bg-dots absolute inset-0 opacity-70" />
      <div className={cn("absolute -top-1/3 -right-1/4 h-[90%] w-[70%] rounded-full opacity-40 blur-3xl", dept.solid)} />
      <div className={cn("relative flex h-full justify-center px-[6%]", compact ? "items-center" : "items-start pt-[13%]")}>
        <div className="flex items-center">
          {(compact ? demo.steps.slice(0, 4) : demo.steps).map((s, i) => {
            const k = nodeKindStyles[s.kind];
            const Icon = k.icon;
            return (
              <div key={s.label} className="flex items-center">
                {i > 0 && <span className={cn("h-px bg-ink/25", compact ? "w-1.5" : "w-3 sm:w-6")} />}
                <span
                  className={cn(
                    "flex items-center rounded-lg border border-line bg-card shadow-pop-sm",
                    compact ? "p-0.5" : "gap-1.5 px-1.5 py-1.5 sm:px-2.5",
                  )}
                >
                  <span className={cn("flex items-center justify-center rounded-md", k.soft, compact ? "h-3.5 w-3.5" : "h-6 w-6")}>
                    <Icon className={compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} strokeWidth={2} />
                  </span>
                  {!compact && <span className="hidden text-xs font-medium text-ink md:inline">{s.label}</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
