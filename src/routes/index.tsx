import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ListChecks, Sparkles, ArrowRight, Lightbulb } from "lucide-react";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CorDecor Creative Assistant" },
      {
        name: "description",
        content:
          "One integrated dashboard for client communication, event planning and creative inspiration.",
      },
    ],
  }),
  component: DashboardPage,
});

const features = [
  {
    to: "/email-generator" as const,
    icon: Mail,
    title: "Client Email Generator",
    description:
      "Generate professional client emails for enquiries, quotations, bookings, reminders and follow-ups.",
  },
  {
    to: "/setup-planner" as const,
    icon: ListChecks,
    title: "Setup Planner",
    description: "Organise events using timelines, schedules and checklists.",
  },
  {
    to: "/inspiration-studio" as const,
    icon: Sparkles,
    title: "Creative Inspiration Studio",
    description:
      "Generate décor ideas, styling inspiration and creative recommendations.",
  },
];

const tips = [
  "Be specific about your event.",
  "Include colours, themes or venue details.",
  "Mention client preferences.",
  "Add important requirements.",
];

function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
      <section className="mb-10 sm:mb-14">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Welcome
        </span>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
          Your creative studio, <em className="font-normal italic">calmer</em>.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          CorDecor Creative Assistant helps simplify client communication, event
          planning and creative inspiration using AI — all in one intuitive
          workspace.
        </p>
      </section>

      <section className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
          >
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-semibold">{f.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
              {f.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 group-hover:text-foreground">
              Open
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>

      <section className="mb-10 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Quick tips</h2>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {tips.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/50" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ResponsibleAINotice />
    </div>
  );
}
