import { createFileRoute } from "@tanstack/react-router";
import { Info, Check } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CorDecor Creative Assistant" },
      {
        name: "description",
        content:
          "About the CorDecor Creative Assistant — an educational AI-powered productivity demo for décor and event styling.",
      },
    ],
  }),
  component: AboutPage,
});

const benefits = [
  "Faster client communication",
  "Better event organisation",
  "Creative inspiration on demand",
  "Improved workflow efficiency",
  "Consistent professional communication",
  "Time-saving planning assistance",
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-3 text-sm text-muted-foreground leading-relaxed sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <PageHeader
        icon={Info}
        eyebrow="About"
        title="CorDecor Creative Assistant"
        description="An AI-powered productivity companion for décor and event styling professionals."
      />

      <div className="mt-10 space-y-5">
        <Section title="Purpose">
          CorDecor Creative Assistant combines AI-powered communication,
          planning and creative inspiration into one productivity application —
          giving small creative studios a calmer, faster way to move from
          enquiry to event day.
        </Section>

        <Section title="Benefits">
          <ul className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-foreground/90">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-primary">
                  <Check className="h-3 w-3" />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Responsible AI">
          AI is a helpful collaborator — not a replacement for human judgement.
          Every generated response should be reviewed, personalised and adapted
          to reflect your client's vision. Treat the output as a strong starting
          draft, then bring your craft, taste and experience to the final piece.
        </Section>

        <Section title="Prompt Engineering">
          Clear, specific inputs create noticeably better AI output. Include
          event type, date, venue, guest count, theme, colour palette and any
          client preferences. The more context you provide, the more useful and
          personalised the generated result will be.
        </Section>

        <Section title="Credits">
          This is an educational demonstration application created with Lovable
          AI to showcase AI-powered productivity for a décor and event styling
          business. No user data is stored and no external AI services are
          used — all responses are generated locally as realistic simulations.
        </Section>

        <ResponsibleAINotice />
      </div>
    </div>
  );
}
