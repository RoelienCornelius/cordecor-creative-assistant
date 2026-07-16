import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { TemplatePicker } from "@/components/template-picker";
import { GeneratedOutput } from "@/components/generated-output";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  generatePlan,
  type PlanTemplate,
  type PlanInputs,
} from "@/lib/simulated-ai";

export const Route = createFileRoute("/setup-planner")({
  head: () => ({
    meta: [
      { title: "Setup Planner — CorDecor" },
      {
        name: "description",
        content:
          "Organise events with AI-generated timelines, checklists and setup schedules.",
      },
    ],
  }),
  component: SetupPlannerPage,
});

const TEMPLATES: readonly PlanTemplate[] = [
  "Event Timeline",
  "Shopping Checklist",
  "Packing Checklist",
  "Setup Schedule",
  "Staff Task List",
];

const empty: PlanInputs = {
  eventName: "",
  eventDate: "",
  venue: "",
  guests: "",
  theme: "",
  notes: "",
};

function SetupPlannerPage() {
  const [template, setTemplate] = useState<PlanTemplate>("Event Timeline");
  const [inputs, setInputs] = useState<PlanInputs>(empty);
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const update = <K extends keyof PlanInputs>(k: K, v: PlanInputs[K]) =>
    setInputs((s) => ({ ...s, [k]: v }));

  const run = async () => {
    setIsGenerating(true);
    try {
      setOutput(await generatePlan(template, inputs, output));
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setInputs(empty);
    setOutput("");
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <PageHeader
        icon={ListChecks}
        eyebrow="Feature 2"
        title="Setup Planner"
        description="Help your team organise event preparation using structured schedules and checklists."
      />

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">
            1. What do you want to plan?
          </h2>
          <TemplatePicker
            templates={TEMPLATES}
            value={template}
            onChange={(v) => setTemplate(v as PlanTemplate)}
          />
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">
            2. Event details
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="eventName">Event name</Label>
              <Input
                id="eventName"
                value={inputs.eventName}
                onChange={(e) => update("eventName", e.target.value)}
                placeholder="e.g. Thabo & Lerato's Wedding"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="eventDate">Event date</Label>
              <Input
                id="eventDate"
                type="date"
                value={inputs.eventDate}
                onChange={(e) => update("eventDate", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={inputs.venue}
                onChange={(e) => update("venue", e.target.value)}
                placeholder="e.g. Rustenberg Estate"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="guests">Number of guests</Label>
              <Input
                id="guests"
                inputMode="numeric"
                value={inputs.guests}
                onChange={(e) => update("guests", e.target.value)}
                placeholder="e.g. 120"
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="theme">Theme</Label>
              <Input
                id="theme"
                value={inputs.theme}
                onChange={(e) => update("theme", e.target.value)}
                placeholder="e.g. Warm neutrals, botanical, candlelit"
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="notes">Additional notes</Label>
              <Textarea
                id="notes"
                value={inputs.notes}
                onChange={(e) => update("notes", e.target.value)}
                className="mt-1.5 min-h-[110px]"
                placeholder="Access times, on-site restrictions, must-haves…"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={run} disabled={isGenerating}>
              {isGenerating ? "Generating…" : "Generate Plan"}
            </Button>
            <Button variant="outline" onClick={reset} disabled={isGenerating}>
              Reset
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
