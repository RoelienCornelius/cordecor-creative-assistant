import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {eyebrow && (
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </span>
      )}
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-primary text-accent-foreground shadow-sm">
            <Icon className="h-5 w-5" />
          </div>

        )}
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
