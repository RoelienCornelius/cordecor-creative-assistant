// Realistic simulated AI content generators. No network, no data storage.

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const fallback = (v: string, alt: string) => (v && v.trim() ? v.trim() : alt);

/* --------------------------- EMAIL GENERATOR --------------------------- */

export type EmailTone = "Professional" | "Friendly" | "Warm" | "Persuasive";
export type EmailTemplate =
  | "New Enquiry Reply"
  | "Quotation Email"
  | "Booking Confirmation"
  | "Deposit Reminder"
  | "Final Payment Reminder"
  | "Thank You Message"
  | "Custom Email";

export interface EmailInputs {
  clientName: string;
  eventType: string;
  eventDate: string;
  subject: string;
  notes: string;
  tone: EmailTone;
}

function greeting(tone: EmailTone, name: string) {
  const n = fallback(name, "there");
  switch (tone) {
    case "Friendly":
      return `Hi ${n},`;
    case "Warm":
      return `Dear ${n},`;
    case "Persuasive":
      return `Hello ${n},`;
    default:
      return `Dear ${n},`;
  }
}

function signoff(tone: EmailTone) {
  const base = "The CorDecor Team";
  switch (tone) {
    case "Friendly":
      return `Chat soon,\n${base}`;
    case "Warm":
      return `With warmest regards,\n${base}`;
    case "Persuasive":
      return `Looking forward to creating something unforgettable,\n${base}`;
    default:
      return `Kind regards,\n${base}`;
  }
}

export async function generateEmail(
  template: EmailTemplate,
  input: EmailInputs,
): Promise<string> {
  await delay(300 + Math.random() * 300);

  const name = fallback(input.clientName, "Client");
  const event = fallback(input.eventType, "your event");
  const date = fallback(input.eventDate, "your chosen date");
  const notes = input.notes.trim();
  const subject =
    input.subject.trim() || defaultSubject(template, event);

  const openings: Record<EmailTemplate, string[]> = {
    "New Enquiry Reply": [
      `Thank you so much for reaching out to CorDecor about ${event}. It would be a pleasure to help bring your vision to life.`,
      `We were delighted to receive your enquiry about ${event} — thank you for thinking of CorDecor.`,
    ],
    "Quotation Email": [
      `Thank you for the opportunity to prepare a quotation for ${event} on ${date}. Please find our proposed styling package details below.`,
      `Following our conversation about ${event}, we're pleased to share a tailored quotation for your consideration.`,
    ],
    "Booking Confirmation": [
      `We're thrilled to confirm your booking with CorDecor for ${event} on ${date}.`,
      `This is a lovely note to confirm that your ${event} on ${date} is officially in our diary.`,
    ],
    "Deposit Reminder": [
      `We hope you're well. This is a friendly reminder that the deposit for ${event} on ${date} is due to secure your booking.`,
      `Just a gentle nudge — the deposit for your ${event} is still pending on our side.`,
    ],
    "Final Payment Reminder": [
      `As we look forward to ${event} on ${date}, this is a courteous reminder that the final balance is now due.`,
      `With ${event} approaching on ${date}, we wanted to check in about the outstanding final payment.`,
    ],
    "Thank You Message": [
      `Thank you for choosing CorDecor to style ${event}. It was an absolute joy working with you.`,
      `What a beautiful ${event} that was — thank you for trusting us with your day.`,
    ],
    "Custom Email": [
      `Thank you for getting in touch regarding ${event}.`,
      `We appreciate you reaching out about ${event}.`,
    ],
  };

  const bodies: Record<EmailTemplate, string[]> = {
    "New Enquiry Reply": [
      `To prepare the most accurate proposal, could you kindly confirm:\n  • Confirmed date and venue\n  • Approximate guest count\n  • Preferred colour palette or theme\n  • Any styling elements you already have in mind (backdrop, welcome board, table styling, etc.)\n\nOnce received, we'll put together a tailored concept and quotation within 2–3 working days.`,
    ],
    "Quotation Email": [
      `Included in this proposal:\n  • Concept development and styling direction\n  • Décor items, backdrop and floral installation\n  • Setup, on-site management and pack-down\n  • Delivery within the greater metro area\n\nThis quotation is valid for 14 days. A 30% deposit secures your date, with the balance payable two weeks before ${date}.`,
    ],
    "Booking Confirmation": [
      `Here is a quick summary of what we have on file:\n  • Event: ${event}\n  • Date: ${date}\n  • Deposit: received, thank you\n\nOur next step is a styling walk-through two weeks before the event to lock in the final details. We'll send a short questionnaire in the meantime so we can start bringing your ideas to life.`,
    ],
    "Deposit Reminder": [
      `Kindly note that your date is only fully secured once the 30% deposit reflects in our account. If it's already on its way, please disregard this note. Otherwise, we're happy to resend banking details or share alternative payment options.`,
    ],
    "Final Payment Reminder": [
      `The outstanding balance is payable no later than 7 days before the event to allow us to finalise sourcing and logistics. Once received, we'll share the final run-sheet and setup schedule for your peace of mind.`,
    ],
    "Thank You Message": [
      `It was a privilege to be part of such a special occasion. We would be so grateful if you could share a short review or tag CorDecor in any photos — it really does help small creative studios like ours.\n\nWe've kept your mood board on file, so please keep us in mind for future celebrations.`,
    ],
    "Custom Email": [
      `Please find the details below:\n\n${notes || "  • [ Add the specific points you would like to communicate ]"}`,
    ],
  };

  const persuasiveBoost =
    input.tone === "Persuasive"
      ? `\n\nWe'd love to lock in your date soon — our calendar for ${date} is filling up quickly, and we want to make sure ${event} gets the attention it deserves.`
      : "";

  const notesBlock =
    template !== "Custom Email" && notes
      ? `\n\nA few additional notes on file:\n${notes
          .split(/\n+/)
          .map((l) => `  • ${l.trim()}`)
          .join("\n")}`
      : "";

  const body = [
    `Subject: ${subject}`,
    "",
    greeting(input.tone, name),
    "",
    pick(openings[template]),
    "",
    pick(bodies[template]),
    persuasiveBoost,
    notesBlock,
    "",
    "Please don't hesitate to reach out with any questions.",
    "",
    signoff(input.tone),
  ]
    .filter(Boolean)
    .join("\n");

  return body;
}

function defaultSubject(template: EmailTemplate, event: string) {
  switch (template) {
    case "New Enquiry Reply":
      return `Re: Your enquiry about ${event}`;
    case "Quotation Email":
      return `Your CorDecor quotation for ${event}`;
    case "Booking Confirmation":
      return `Booking confirmed — ${event}`;
    case "Deposit Reminder":
      return `Friendly reminder: deposit due for ${event}`;
    case "Final Payment Reminder":
      return `Final balance reminder — ${event}`;
    case "Thank You Message":
      return `Thank you from CorDecor`;
    default:
      return `A note from CorDecor`;
  }
}

/* ---------------------------- SETUP PLANNER ---------------------------- */

export type PlanTemplate =
  | "Event Timeline"
  | "Shopping Checklist"
  | "Packing Checklist"
  | "Setup Schedule"
  | "Staff Task List";

export interface PlanInputs {
  eventName: string;
  eventDate: string;
  venue: string;
  guests: string;
  theme: string;
  notes: string;
}

export async function generatePlan(
  template: PlanTemplate,
  i: PlanInputs,
): Promise<string> {
  await delay(300 + Math.random() * 300);

  const name = fallback(i.eventName, "Your Event");
  const date = fallback(i.eventDate, "TBC");
  const venue = fallback(i.venue, "the venue");
  const guests = fallback(i.guests, "TBC");
  const theme = fallback(i.theme, "your chosen theme");

  const header = `${template.toUpperCase()}\n${name} · ${date} · ${venue}\nGuests: ${guests}  |  Theme: ${theme}\n${"─".repeat(56)}\n`;

  const notesBlock = i.notes.trim()
    ? `\n\nNOTES\n${i.notes
        .split(/\n+/)
        .map((l) => `  • ${l.trim()}`)
        .join("\n")}`
    : "";

  const reminder = `\n\nHELPFUL REMINDERS\n  • Confirm venue access times 48 hours prior.\n  • Charge all cordless lighting the night before.\n  • Keep a small emergency kit (scissors, cable ties, steamer, spare bulbs).\n  • Photograph the finished setup before guests arrive.`;

  const body = (() => {
    switch (template) {
      case "Event Timeline":
        return [
          "PRIORITISED TIMELINE",
          "  1. 8 weeks out — Confirm concept, palette and final quotation.",
          "  2. 6 weeks out — Source hero décor items and confirm florist.",
          "  3. 4 weeks out — Finalise seating plan and signage wording.",
          "  4. 2 weeks out — Walk-through at " + venue + " with client.",
          "  5. 1 week out — Confirm staff schedule and delivery logistics.",
          "  6. Day before — Pack vehicles, brief team, charge equipment.",
          "  7. Event day — Setup, styling, on-site management, pack-down.",
        ].join("\n");
      case "Shopping Checklist":
        return [
          "SHOPPING CHECKLIST",
          "  ☐ Fresh florals (focal + filler)",
          "  ☐ Candles, tapers and holders",
          "  ☐ Ribbon, twine and stationery",
          "  ☐ Table linen and runners (" + theme + " palette)",
          "  ☐ Signage board and hand-lettering supplies",
          "  ☐ Guest favours / party bucket contents",
          "  ☐ Balloons, foliage or greenery accents",
          "  ☐ Batteries, extension leads and gaffer tape",
        ].join("\n");
      case "Packing Checklist":
        return [
          "PACKING CHECKLIST",
          "  ☐ Backdrop frame + panels + fixings",
          "  ☐ Welcome board + easel",
          "  ☐ Table centrepieces (labelled per table)",
          "  ☐ Candles + lighters + drip trays",
          "  ☐ Toolkit: scissors, cable ties, tape, sewing kit",
          "  ☐ Steamer + spare linen",
          "  ☐ Clipboard with run-sheet + client contact card",
          "  ☐ First-aid kit + snacks + water for the team",
        ].join("\n");
      case "Setup Schedule":
        return [
          "SETUP SEQUENCE",
          "  07:00  Team call, load-in briefing",
          "  08:00  Arrive at " + venue + ", unload zone 1",
          "  08:30  Backdrop and structural elements installed",
          "  09:30  Tables dressed with linen, chargers and glassware",
          "  10:30  Centrepieces, florals and candles placed",
          "  11:30  Welcome board, signage and lounge styling",
          "  12:30  Final walk-through with client",
          "  13:00  Team break before guest arrival",
        ].join("\n");
      case "Staff Task List":
        return [
          "STAFF RESPONSIBILITIES",
          "  • Lead Stylist — Concept integrity, client liaison, final sign-off.",
          "  • Assistant Stylist — Table styling, florals, candles.",
          "  • Setup Crew (x2) — Backdrop, heavy items, lighting.",
          "  • Runner — Fetching, packing, on-call throughout setup.",
          "  • Pack-Down Lead — Coordinates strike, inventory check, load-out.",
        ].join("\n");
    }
  })();

  return header + body + notesBlock + reminder;
}

/* ------------------------- INSPIRATION STUDIO ------------------------- */

export type InspirationTemplate =
  | "Colour Palette Suggestions"
  | "Theme Inspiration"
  | "Backdrop Styling Ideas"
  | "Welcome Board Wording"
  | "Décor Styling Suggestions"
  | "Party Bucket & Gift Ideas"
  | "Photo Area Inspiration";

export interface InspirationInputs {
  eventType: string;
  theme: string;
  colours: string;
  venue: string;
  budget: string;
  requirements: string;
}

export async function generateInspiration(
  template: InspirationTemplate,
  i: InspirationInputs,
): Promise<string> {
  await delay(300 + Math.random() * 300);

  const event = fallback(i.eventType, "the event");
  const theme = fallback(i.theme, "your theme");
  const colours = fallback(i.colours, "your chosen palette");
  const venue = fallback(i.venue, "the venue");

  const header = `${template.toUpperCase()}\nFor ${event} · Theme: ${theme} · Palette: ${colours}\n${"─".repeat(56)}\n`;

  const reqBlock = i.requirements.trim()
    ? `\n\nSPECIAL REQUIREMENTS CONSIDERED\n${i.requirements
        .split(/\n+/)
        .map((l) => `  • ${l.trim()}`)
        .join("\n")}`
    : "";

  const budgetBlock = i.budget.trim()
    ? `\n\nBUDGET NOTE\n  • Concepts scaled to suit approx. ${i.budget.trim()}. Swap fresh florals for dried where appropriate.`
    : "";

  const body = (() => {
    switch (template) {
      case "Colour Palette Suggestions": {
        const palettes = shuffle([
          {
            name: "Warm Neutral Romance",
            swatches: ["#F5EDE1  Buttercream", "#E4C9A8  Sand", "#B4886A  Toffee", "#3A2A22  Cocoa"],
          },
          {
            name: "Soft Botanical",
            swatches: ["#F1EEE6  Linen", "#C9D3B7  Sage", "#8AA382  Moss", "#4A5A3E  Forest"],
          },
          {
            name: "Modern Blush",
            swatches: ["#FBEDEA  Petal", "#E8B7B0  Rose", "#B77B7A  Terracotta", "#5C3535  Wine"],
          },
        ]).slice(0, 2);
        return palettes
          .map(
            (p, idx) =>
              `PALETTE ${idx + 1} — ${p.name}\n${p.swatches
                .map((s) => `  ▪ ${s}`)
                .join("\n")}`,
          )
          .join("\n\n");
      }
      case "Theme Inspiration":
        return [
          `CONCEPT DIRECTIONS`,
          `  1. Modern Heirloom — Timeless silhouettes in ${colours}, layered linen, tapered candles and pressed florals.`,
          `  2. Botanical Editorial — Sculptural greenery, oversized foliage and a monochrome palette that leans on ${theme}.`,
          `  3. Soft Cinematic — Warm uplighting, mirrored surfaces and heirloom glassware to elevate ${venue}.`,
        ].join("\n");
      case "Backdrop Styling Ideas":
        return [
          `BACKDROP IDEAS`,
          `  • Arched panel in ${colours.split(",")[0] || "the primary tone"} with cascading florals on one shoulder.`,
          `  • Textured fabric drape with soft lighting behind, suited to ${venue}.`,
          `  • Freestanding dried-floral wall with a hand-lettered signage plaque.`,
          `  • Suspended greenery installation over the top table for a photo-forward moment.`,
        ].join("\n");
      case "Welcome Board Wording":
        return [
          `WELCOME BOARD OPTIONS`,
          `  1. "Welcome to ${event} — where every detail was chosen with love."`,
          `  2. "So glad you're here. Find your seat, raise a glass, celebrate."`,
          `  3. "${theme}, together." (Great as a minimal one-liner in serif type.)`,
          `  4. "A gathering in honour of ___" — clean, editorial, timeless.`,
        ].join("\n");
      case "Décor Styling Suggestions":
        return [
          `STYLING SUGGESTIONS`,
          `  • Layer three heights on each table: taper candles, low florals and a signature charger plate.`,
          `  • Use vintage brass or matte black accents to anchor ${colours}.`,
          `  • Introduce texture with linen runners, raw-edge menus and hand-tied napkin ties.`,
          `  • Reserve one hero moment (arch, chandelier or installation) as the visual anchor for ${venue}.`,
        ].join("\n");
      case "Party Bucket & Gift Ideas":
        return [
          `GUEST FAVOUR IDEAS`,
          `  • Kraft box with artisan chocolate, a mini candle in ${colours}, and a handwritten thank-you.`,
          `  • Seed-paper card guests can plant, matched to ${theme}.`,
          `  • Small glass bottle of house-blend tea or coffee with a custom label.`,
          `  • Child-friendly option: colouring set, sticker sheet and a small treat.`,
        ].join("\n");
      case "Photo Area Inspiration":
        return [
          `PHOTO AREA CONCEPTS`,
          `  • Signage + florals over a bench seat, softly lit for evening portraits.`,
          `  • Mirror-and-neon combo with a short quote referencing ${theme}.`,
          `  • Framed floral window with props (hats, bouquets) for a playful moment.`,
          `  • Polaroid station — guests pin their favourite shot onto a guest board.`,
        ].join("\n");
    }
  })();

  return header + body + budgetBlock + reqBlock;
}
