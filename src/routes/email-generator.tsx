import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { TemplatePicker } from "@/components/template-picker";
import { GeneratedOutput } from "@/components/generated-output";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  generateEmail,
  type EmailTemplate,
  type EmailTone,
  type EmailInputs,
} from "@/lib/simulated-ai";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Client Email Generator — CorDecor" },
      {
        name: "description",
        content:
          "Draft professional, editable client emails for enquiries, quotations, bookings and reminders.",
      },
    ],
  }),
  component: EmailGeneratorPage,
});

const TEMPLATES: readonly EmailTemplate[] = [
  "New Enquiry Reply",
  "Quotation Email",
  "Booking Confirmation",
  "Deposit Reminder",
  "Final Payment Reminder",
  "Thank You Message",
  "Custom Email",
];

const TONES: EmailTone[] = ["Professional", "Friendly", "Warm", "Persuasive"];

const emptyInputs: EmailInputs = {
  clientName: "",
  eventType: "",
  eventDate: "",
  subject: "",
  notes: "",
  tone: "Professional",
};

function EmailGeneratorPage() {
  const [template, setTemplate] = useState<EmailTemplate>("New Enquiry Reply");
  const [inputs, setInputs] = useState<EmailInputs>(emptyInputs);
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const update = <K extends keyof EmailInputs>(k: K, v: EmailInputs[K]) =>
    setInputs((s) => ({ ...s, [k]: v }));

  const run = async () => {
    setIsGenerating(true);
    try {
      const result = await generateEmail(template, inputs);
      setOutput(result);
    } finally {
      setIsGenerating(false);
    }
  };

  const clear = () => {
    setInputs(emptyInputs);
    setOutput("");
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <PageHeader
        icon={Mail}
        eyebrow="Feature 1"
        title="Client Email Generator"
        description="Create professional, editable client emails for every stage of the booking process."
      />

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">
            1. Choose a template
          </h2>
          <TemplatePicker
            templates={TEMPLATES}
            value={template}
            onChange={(v) => setTemplate(v as EmailTemplate)}
          />
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">
            2. Add the details
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="clientName">Client name</Label>
              <Input
                id="clientName"
                value={inputs.clientName}
                onChange={(e) => update("clientName", e.target.value)}
                placeholder="e.g. Nomvula Dlamini"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="eventType">Event type</Label>
              <Input
                id="eventType"
                value={inputs.eventType}
                onChange={(e) => update("eventType", e.target.value)}
                placeholder="e.g. 40th birthday celebration"
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
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={inputs.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="Optional — we'll suggest one"
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="notes">Additional notes</Label>
              <Textarea
                id="notes"
                value={inputs.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Anything specific to include — pricing, venue, requests…"
                className="mt-1.5 min-h-[110px]"
              />
            </div>
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select
                value={inputs.tone}
                onValueChange={(v) => update("tone", v as EmailTone)}
              >
                <SelectTrigger id="tone" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={run} disabled={isGenerating}>
              {isGenerating ? "Generating…" : "Generate Email"}
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
