# CorDecor Creative Assistant — Build Plan

A single-page SaaS-style app with sidebar navigation, five routes, and simulated AI content generation (no backend, no external APIs, no auth, no storage).

## Design direction

- Neutral premium palette (warm off-white background, deep charcoal/ink text, soft muted accent — no hard-coded brand colors), defined as semantic tokens in `src/styles.css` (oklch).
- Elegant typography pair: a refined serif for headings + clean sans for body (loaded via `<link>` in `__root.tsx`).
- Rounded cards (radius ~1rem), subtle shadows, generous whitespace, lucide icons, smooth transitions.
- Fully responsive: sidebar collapses to icon rail on tablet and to a Sheet drawer on mobile.

## Routes (TanStack Start file-based)

```
src/routes/
  __root.tsx              -> shell: fonts, meta, providers
  index.tsx               -> Dashboard (replaces placeholder)
  email-generator.tsx     -> Feature 1
  setup-planner.tsx       -> Feature 2
  inspiration-studio.tsx  -> Feature 3
  about.tsx               -> About
```

Each route sets its own `head()` with unique title/description/og tags.

## Layout

- `src/routes/__root.tsx` wraps `<Outlet />` in `SidebarProvider` + `AppSidebar` + top header (page title, `SidebarTrigger`, subtle brand mark).
- `AppSidebar` (`src/components/app-sidebar.tsx`): 5 nav items with lucide icons (LayoutDashboard, Mail, ListChecks, Sparkles, Info), active-route highlighting via `useRouterState`.

## Dashboard (`/`)

- Welcome hero: heading + one-paragraph intro.
- Three feature cards (Link to each tool) with icon, title, short description, hover lift.
- Quick Tips card: 4 bullet tips.
- Responsible AI notice component at bottom.

## Shared components

- `FeaturePageShell` — consistent header (title, subtitle) + Responsible AI notice footer for the three tool pages.
- `ResponsibleAINotice` — reusable card with the exact copy specified.
- `TemplatePicker` — grid of selectable template chips/cards (Step 1).
- `GeneratedOutput` — large editable `<Textarea>` (auto-sized) with Copy + Regenerate buttons; Copy uses `navigator.clipboard` + toast.

## Feature pages (shared 2-step pattern)

Step 1: template picker.
Step 2: form (react-hook-form + zod optional; simple controlled state is fine) with the exact inputs per spec, Tone select where applicable, Generate + Clear/Reset buttons.
Output: editable textarea, Copy, Regenerate.

### Simulated AI generator (`src/lib/simulated-ai.ts`)

Pure TS module. Exports three functions: `generateEmail(template, inputs)`, `generatePlan(template, inputs)`, `generateInspiration(template, inputs)`. Each returns a realistic, professional, template-shaped string built from the user's inputs (interpolated name/event/date/theme/venue/etc.), with variation on regenerate (small pool of intros/closings, shuffled bullets, timestamp seed). ~200–400 ms artificial delay via `await new Promise(setTimeout, …)` so a "Generating…" state can show. No network calls.

Content templates per feature:
- **Email Generator**: 7 templates. Each returns Subject + salutation + body + sign-off, tone-adjusted (Professional/Friendly/Warm/Persuasive changes phrasing).
- **Setup Planner**: 5 templates producing structured markdown-like text (headings, bulleted checklists, timeline rows).
- **Inspiration Studio**: 7 templates producing palettes (with hex swatches in text), themes, backdrop ideas, welcome-board wording variants, etc.

## About page

Sections: Purpose, Benefits (checklist), Responsible AI, Prompt Engineering tips, Credits — as plain content cards.

## Tech / constraints

- TanStack Start + TanStack Router, Tailwind v4 tokens in `src/styles.css`, shadcn components (sidebar, card, button, input, textarea, select, label, tabs/toggle-group for templates, sonner for toasts).
- No backend, no Lovable Cloud, no secrets, no DB, no auth.
- All generated content is fully editable (plain `<Textarea>` state).
- Responsible AI notice appears on all three tool pages and the dashboard.
- SEO: unique `head()` per route; no og:image (hosting supplies default).

## Deliverables checklist

1. Design tokens + fonts in `styles.css` / `__root.tsx`.
2. `AppSidebar` + root layout with header and mobile trigger.
3. Dashboard replacing the placeholder index.
4. Three feature pages sharing shell + output component.
5. `simulated-ai.ts` with tone- and template-aware generators.
6. About page.
7. Responsive checks at mobile/tablet/desktop.

Ready to build on approval.