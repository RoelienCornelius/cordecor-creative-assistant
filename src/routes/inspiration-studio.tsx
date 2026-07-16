import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { TemplatePicker } from "@/components/template-picker";
import { GeneratedOutput } from "@/components/generated-output";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  generateInspiration,
  type InspirationTemplate,
  type InspirationInputs,
} from "@/lib/simulated-ai";

export const Route = createFileRoute("/inspiration-studio")({
  head: () => ({
    meta: [
      { title: "Creative Inspiration Studio — CorDecor" },
      {
        name: "description",
        content:
          "Generate palettes, themes, backdrops and styling ideas for décor projects.",
      },
    ],
  }),
  component: InspirationStudioPage,
});

const TEMPLATES: readonly InspirationTemplate[] = [
  "Colour Palette Suggestions",
  "Theme Inspiration",
  "Backdrop Styling Ideas",
  "Welcome Board Wording",
  "Décor Styling Suggestions",
  "Party Bucket & Gift Ideas",
  "Photo Area Inspiration",
];

const empty: InspirationInputs = {
  eventType: "",
  theme: "",
  colours: "",
  venue: "",
  budget: "",
  requirements: "",
};

function InspirationStudioPage() {
  const [template, setTemplate] = useState<InspirationTemplate>(
    "Colour Palette Suggestions",
  );
  const [inputs, setInputs] = useState<InspirationInputs>(empty);
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const update = <K extends keyof InspirationInputs>(
    k: K,
    v: InspirationInputs[K],
  ) => setInputs((s) => ({ ...s, [k]: v }));

  const run = async () => {
    setIsGenerating(true);
    try {
      setOutput(await generateInspiration(template, inputs));
    } finally {
      setIsGenerating(false);
    }
  };

  const clear = () => {
    setInputs(empty);
    setOutput("");
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <PageHeader
        icon={Sparkles}
        eyebrow="Feature 3"
        title="Creative Inspiration Studio"
        description="Generate creative ideas and styling recommendations for décor projects."
      />

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">
            1. What do you need help with?
          </h2>
          <TemplatePicker
            templates={TEMPLATES}
            value={template}
            onChange={(v) => setTemplate(v as InspirationTemplate)}
          />
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">
            2. Project details
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="eventType">Event type</Label>
              <Input
                id="eventType"
                value={inputs.eventType}
                onChange={(e) => update("eventType", e.target.value)}
                placeholder="e.g. Baby shower"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Input
                id="theme"
                value={inputs.theme}
                onChange={(e) => update("theme", e.target.value)}
                placeholder="e.g. Enchanted garden"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="colours">Colour preferences</Label>
              <Input
                id="colours"
                value={inputs.colours}
                onChange={(e) => update("colours", e.target.value)}
                placeholder="e.g. Sage, cream, brass"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={inputs.venue}
                onChange={(e) => update("venue", e.target.value)}
                placeholder="e.g. Garden marquee"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget (optional)</Label>
              <Input
                id="budget"
                value={inputs.budget}
                onChange={(e) => update("budget", e.target.value)}
                placeholder="e.g. R15 000"
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="requirements">Additional requirements</Label>
              <Textarea
                id="requirements"
                value={inputs.requirements}
                onChange={(e) => update("requirements", e.target.value)}
                className="mt-1.5 min-h-[110px]"
                placeholder="Client preferences, cultural elements, must-haves…"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={run} disabled={isGenerating}>
              {isGenerating ? "Generating…" : "Generate Ideas"}
            </Button>
            <Button variant="outline" onClick={clear} disabled={isGenerating}>
              Clear
            </Button>
          </div>
        </section>

        <GeneratedOutput
          value={output}
          onChange={setOutput}
          onRegenerate={run}
          isGenerating={isGenerating}
        />

        <ResponsibleAINotice />
      </div>
    </div>
  );
}
