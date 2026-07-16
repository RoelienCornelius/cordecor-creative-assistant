import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function TemplatePicker({
  templates,
  value,
  onChange,
}: {
  templates: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((t) => {
        const active = value === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={cn(
              "group relative flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card hover:border-primary/40 hover:bg-accent/40"
            )}
          >
            <span className="font-medium">{t}</span>
            {active && <Check className="h-4 w-4" />}
          </button>
        );
      })}
    </div>
  );
}
