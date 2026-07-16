import { ShieldCheck } from "lucide-react";

export function ResponsibleAINotice() {
  return (
    <div className="rounded-2xl border border-border/70 bg-accent/40 p-4 sm:p-5">
      <div className="flex gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-background text-accent-foreground shadow-sm">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold">Responsible AI Notice</p>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            AI-generated content should always be reviewed before being shared with
            clients or used for important business decisions. Personalise all
            communications, verify recommendations and ensure every design reflects
            your client's vision and event requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
