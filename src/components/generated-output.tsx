import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RefreshCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function GeneratedOutput({
  value,
  onChange,
  onRegenerate,
  isGenerating,
}: {
  value: string;
  onChange: (v: string) => void;
  onRegenerate: () => void;
  isGenerating?: boolean;
}) {
  const [copying, setCopying] = useState(false);

  const handleCopy = async () => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Unable to copy");
    } finally {
      setCopying(false);
    }
  };

  if (!value && !isGenerating) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold">Generated result</h3>
          <p className="text-xs text-muted-foreground">
            Fully editable — refine anything before you use it.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!value || copying}
          >
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Regenerate</span>
          </Button>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[420px] resize-y whitespace-pre-wrap font-mono text-[13px] leading-relaxed"
        placeholder={isGenerating ? "Generating…" : ""}
      />
    </div>
  );
}
