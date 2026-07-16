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

/** Format an ISO date (YYYY-MM-DD) into "30 July 2026". Returns the fallback
 *  when input isn't a parseable ISO date. */
function formatDate(iso: string, alt = "your chosen date"): string {
  const v = (iso || "").trim();
  if (!v) return alt;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return v;
  const d = new Date(`${v}T00:00:00`);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Turn a bare event type into a natural phrase: "wedding" → "your wedding". */
function naturalEvent(raw: string, alt = "your event"): string {
  const v = (raw || "").trim();
  if (!v) return alt;
  const lower = v.toLowerCase();
  if (/^(your|our|the|a|an|my|his|her|their)\b/.test(lower)) return v;
  return `your ${v}`;
}

/** Capitalise the first letter (for sentence starts). */
function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** Split notes into clean sentences. */
function splitNotes(notes: string): string[] {
  return notes
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.trim().replace(/[.;]+$/, ""))
    .filter((s) => s.length > 0);
}

/** Try up to N variations of `gen` until the result differs from `previous`. */
async function distinct(
  previous: string | undefined,
  gen: () => Promise<string> | string,
  attempts = 8,
): Promise<string> {
  let out = await gen();
  let tries = 0;
  while (previous && out.trim() === previous.trim() && tries < attempts) {
    out = await gen();
    tries++;
  }
  return out;
}

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
      return `Dearest ${n},`;
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
      return `Chat soon,\n\n${base}`;
    case "Warm":
      return `With warmest regards,\n\n${base}`;
    case "Persuasive":
      return `Looking forward to creating something unforgettable,\n\n${base}`;
    default:
      return `Kind regards,\n\n${base}`;
  }
}

export async function generateEmail(
  template: EmailTemplate,
  input: EmailInputs,
  previous?: string,
): Promise<string> {
  await delay(300 + Math.random() * 300);

  return distinct(previous, () => buildEmail(template, input));
}

function buildEmail(template: EmailTemplate, input: EmailInputs): string {
  const name = fallback(input.clientName, "there");
  const event = naturalEvent(input.eventType);
  const date = formatDate(input.eventDate);
  const notes = input.notes.trim();
  const subject = input.subject.trim() || defaultSubject(template, event);

  const openings: Record<EmailTemplate, string[]> = {
    "New Enquiry Reply": [
      `Thank you so much for reaching out to CorDecor about ${event}. It would be a genuine pleasure to help bring your vision to life.`,
      `We were delighted to receive your enquiry about ${event} — thank you for thinking of CorDecor.`,
      `What a joy to hear from you about ${event}. We would love to be considered for the styling.`,
      `Thank you for getting in touch about ${event} — we're looking forward to learning more about your day.`,
    ],
    "Quotation Email": [
      `Thank you for the opportunity to prepare a quotation for ${event} on ${date}. Please find our proposed styling package details below.`,
      `Following our conversation about ${event}, we're pleased to share a tailored quotation for your consideration.`,
      `As promised, here is our proposal for ${event} on ${date}, shaped around the brief you shared with us.`,
    ],
    "Booking Confirmation": [
      `We're thrilled to confirm your booking with CorDecor for ${event} on ${date}.`,
      `This is a lovely note to confirm that ${event} on ${date} is officially in our diary.`,
      `It's official — ${event} on ${date} is now confirmed with CorDecor, and we couldn't be more excited.`,
    ],
    "Deposit Reminder": [
      `We hope you're well. This is a friendly reminder that the deposit for ${event} on ${date} is due to secure your booking.`,
      `Just a gentle nudge — the deposit for ${event} is still outstanding on our side.`,
      `A quick note to check in on the deposit for ${event} on ${date}, which will lock in your date on our calendar.`,
    ],
    "Final Payment Reminder": [
      `As we look forward to ${event} on ${date}, this is a courteous reminder that the final balance is now due.`,
      `With ${event} approaching on ${date}, we wanted to check in about the outstanding final payment.`,
      `We're almost there — a quick reminder that the final balance for ${event} on ${date} is now payable.`,
    ],
    "Thank You Message": [
      `Thank you for choosing CorDecor to style ${event}. It was an absolute joy working with you.`,
      `What a beautiful ${input.eventType.trim() || "celebration"} that was — thank you for trusting us with your day.`,
      `From all of us at CorDecor, thank you for making ${event} such a memorable moment to be part of.`,
    ],
    "Custom Email": [
      `Thank you for getting in touch regarding ${event}.`,
      `We appreciate you reaching out about ${event}, and wanted to follow up with the details below.`,
      `Thank you for your message — here is the information you asked about for ${event}.`,
    ],
  };

  const bodies: Record<EmailTemplate, string[]> = {
    "New Enquiry Reply": [
      `To prepare the most accurate proposal, could you kindly confirm the following:\n\n  • Confirmed date and venue\n  • Approximate guest count\n  • Preferred colour palette or theme\n  • Any styling elements you already have in mind (backdrop, welcome board, table styling, etc.)\n\nOnce we have these details, we'll put together a tailored concept and quotation within 2–3 working days.`,
      `So that we can shape the right proposal, it would help to know:\n\n  • Your preferred date and the venue you have in mind\n  • Guest numbers and general age group\n  • The mood or references that inspire you\n  • Any must-have styling elements\n\nWe'll then send through a personalised concept, along with a clear quotation, within a few working days.`,
    ],
    "Quotation Email": [
      `Included in this proposal:\n\n  • Concept development and styling direction\n  • Décor items, backdrop and floral installation\n  • Setup, on-site management and pack-down\n  • Delivery within the greater metro area\n\nThis quotation is valid for 14 days. A 30% deposit secures your date, with the balance payable two weeks before ${date}.`,
      `Your proposal covers:\n\n  • A fully developed styling concept and mood board\n  • Backdrop, table styling, florals and signage\n  • Load-in, on-site styling and complete pack-down\n\nTo hold ${date} on our calendar, a 30% deposit is required, with the balance settled two weeks ahead of the event.`,
    ],
    "Booking Confirmation": [
      `Here is a quick summary of what we have on file:\n\n  • Event: ${event}\n  • Date: ${date}\n  • Deposit: received, thank you\n\nOur next step is a styling walk-through two weeks before the event to lock in the final details. We'll send a short questionnaire in the meantime so we can start bringing your ideas to life.`,
      `For your records:\n\n  • Event: ${event}\n  • Date: ${date}\n  • Deposit: received with thanks\n\nWe'll be in touch closer to the time to arrange a styling walk-through and to finalise the run-sheet. In the meantime, keep sending inspiration through — the more we see, the better.`,
    ],
    "Deposit Reminder": [
      `Kindly note that your date is only fully secured once the 30% deposit reflects in our account. If it's already on its way, please disregard this note. Otherwise, we're happy to resend our banking details or share alternative payment options.`,
      `Once the 30% deposit lands with us, ${date} will be locked in on the CorDecor calendar. Please let us know if you'd like us to resend banking details, or if a different payment method would be easier.`,
    ],
    "Final Payment Reminder": [
      `The outstanding balance is payable no later than 7 days before the event, so that we can finalise sourcing and logistics. Once received, we'll share the final run-sheet and setup schedule for your peace of mind.`,
      `Kindly settle the final balance at least a week ahead of ${date}. As soon as it reflects, we'll send through the finalised styling run-sheet and setup schedule.`,
    ],
    "Thank You Message": [
      `It was a privilege to be part of such a special occasion. We would be so grateful if you could share a short review or tag CorDecor in any photos — it really does help small creative studios like ours.\n\nWe've kept your mood board on file, so please keep us in mind for future celebrations.`,
      `Thank you again for the trust you placed in our team. A short review or a tag on social media would mean the world to us, and your mood board will stay safely on file for any future celebrations you're planning.`,
    ],
    "Custom Email": [
      `Please find the details below:\n\n${
        notes || "  • [ Add the specific points you would like to communicate ]"
      }`,
    ],
  };

  const persuasiveBoost =
    input.tone === "Persuasive"
      ? `We'd love to lock in your date soon — bookings around ${date} are filling up quickly, and we want to make sure ${event} gets the attention it truly deserves.`
      : "";

  const notesBlock =
    template !== "Custom Email" && notes
      ? `A few additional notes for your reference:\n\n${splitNotes(notes)
          .map((l) => `  • ${cap(l)}.`)
          .join("\n")}`
      : "";

  const sections = [
    `Subject: ${subject}`,
    greeting(input.tone, name),
    pick(openings[template]),
    pick(bodies[template]),
    ...(persuasiveBoost ? [persuasiveBoost] : []),
    ...(notesBlock ? [notesBlock] : []),
    "Please don't hesitate to reach out with any questions.",
    signoff(input.tone),
  ];

  const body = sections.join("\n\n");

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

/** Turn a raw note into a practical, planning-oriented recommendation. */
function noteToConsideration(note: string): string {
  const clean = cap(note.replace(/[.;]+$/, ""));
  const lower = note.toLowerCase();

  if (/kid|child|toddler|baby/.test(lower))
    return `${clean} — plan a child-friendly zone with low-height styling and soft, safe props.`;
  if (/allerg|nut|gluten|vegan|halal|kosher/.test(lower))
    return `${clean} — flag this clearly to the caterer and place discreet dietary labels on grazing stations.`;
  if (/rain|weather|outdoor|garden|marquee/.test(lower))
    return `${clean} — prepare a wet-weather plan and secure lightweight décor against wind.`;
  if (/budget|cost|save|affordable/.test(lower))
    return `${clean} — prioritise one hero moment and repurpose ceremony florals at the reception.`;
  if (/access|load|parking|lift|stairs/.test(lower))
    return `${clean} — confirm load-in logistics with the venue and allow extra setup time.`;
  if (/night|evening|dark|late/.test(lower))
    return `${clean} — layer warm lighting (candles, fairy lights, uplighters) for atmosphere.`;
  if (/vip|elder|senior|granny|grand/.test(lower))
    return `${clean} — reserve accessible seating close to the main action.`;
  if (/photo|photograph|instagram|shoot/.test(lower))
    return `${clean} — build in a dedicated photo moment and brief the team on styling for camera.`;
  if (/cultural|traditional|umbhaco|lobola|traditional attire/.test(lower))
    return `${clean} — reflect cultural elements in signage, textiles and welcome ritual.`;

  return `${clean} — factor this into the styling brief and share with the on-site team.`;
}

export async function generatePlan(
  template: PlanTemplate,
  i: PlanInputs,
  previous?: string,
): Promise<string> {
  await delay(300 + Math.random() * 300);
  return distinct(previous, () => buildPlan(template, i));
}

function buildPlan(template: PlanTemplate, i: PlanInputs): string {
  const name = fallback(i.eventName, "Your Event");
  const date = formatDate(i.eventDate, "TBC");
  const venue = fallback(i.venue, "the venue");
  const guests = fallback(i.guests, "TBC");
  const theme = fallback(i.theme, "your chosen theme");

  const header = `${template.toUpperCase()}\n${name} · ${date} · ${venue}\nGuests: ${guests}  |  Theme: ${theme}\n${"─".repeat(56)}\n`;

  const considerations = splitNotes(i.notes).map(noteToConsideration);
  const notesBlock = considerations.length
    ? `\n\nPLANNING CONSIDERATIONS\n${considerations
        .map((l) => `  • ${l}`)
        .join("\n")}`
    : "";

  const reminderPool = [
    "Confirm venue access times 48 hours prior.",
    "Charge all cordless lighting the night before.",
    "Keep a small emergency kit (scissors, cable ties, steamer, spare bulbs).",
    "Photograph the finished setup before guests arrive.",
    "Reconfirm florist and rental deliveries three days out.",
    "Print two copies of the run-sheet and share with the venue coordinator.",
    "Assign one team member solely to client liaison on the day.",
    "Pack an emergency stain kit for linen and attire.",
  ];
  const reminder = `\n\nHELPFUL REMINDERS\n${shuffle(reminderPool)
    .slice(0, 4)
    .map((l) => `  • ${l}`)
    .join("\n")}`;

  const body = (() => {
    switch (template) {
      case "Event Timeline": {
        const variants = [
          [
            "PRIORITISED TIMELINE",
            "  1. 8 weeks out — Confirm concept, palette and final quotation.",
            "  2. 6 weeks out — Source hero décor items and confirm florist.",
            "  3. 4 weeks out — Finalise seating plan and signage wording.",
            `  4. 2 weeks out — Walk-through at ${venue} with client.`,
            "  5. 1 week out — Confirm staff schedule and delivery logistics.",
            "  6. Day before — Pack vehicles, brief team, charge equipment.",
            "  7. Event day — Setup, styling, on-site management, pack-down.",
          ],
          [
            "PRIORITISED TIMELINE",
            "  1. 10 weeks out — Sign-off on mood board and confirm hero moments.",
            "  2. 7 weeks out — Lock in rental hire, florals and specialty linens.",
            `  3. 5 weeks out — Confirm final guest count and layout at ${venue}.`,
            "  4. 3 weeks out — Approve signage proofs and welcome board copy.",
            "  5. 10 days out — Final client walk-through and payment reconciliation.",
            "  6. 48 hours out — Full team briefing and vehicle pack.",
            `  7. ${date} — Load-in, styling, on-site management, pack-down.`,
          ],
        ];
        return pick(variants).join("\n");
      }
      case "Shopping Checklist":
        return [
          "SHOPPING CHECKLIST",
          "  ☐ Fresh florals (focal + filler blooms)",
          "  ☐ Candles, tapers and holders",
          "  ☐ Ribbon, twine and stationery",
          `  ☐ Table linen and runners in the ${theme} palette`,
          "  ☐ Signage board and hand-lettering supplies",
          "  ☐ Guest favours / party bucket contents",
          "  ☐ Balloons, foliage or greenery accents",
          "  ☐ Batteries, extension leads and gaffer tape",
          "  ☐ Backup: spare candles, spare ribbon, blank place cards",
        ].join("\n");
      case "Packing Checklist":
        return [
          "PACKING CHECKLIST",
          "  ☐ Backdrop frame, panels and fixings",
          "  ☐ Welcome board and easel",
          "  ☐ Table centrepieces (labelled per table)",
          "  ☐ Candles, lighters and drip trays",
          "  ☐ Toolkit: scissors, cable ties, tape, sewing kit",
          "  ☐ Steamer and spare linen",
          "  ☐ Clipboard with run-sheet and client contact card",
          "  ☐ First-aid kit, snacks and water for the team",
        ].join("\n");
      case "Setup Schedule": {
        const variants = [
          [
            "SETUP SEQUENCE",
            "  07:00  Team call and load-in briefing",
            `  08:00  Arrive at ${venue}, unload zone 1`,
            "  08:30  Backdrop and structural elements installed",
            "  09:30  Tables dressed with linen, chargers and glassware",
            "  10:30  Centrepieces, florals and candles placed",
            "  11:30  Welcome board, signage and lounge styling",
            "  12:30  Final walk-through with client",
            "  13:00  Team break before guest arrival",
          ],
          [
            "SETUP SEQUENCE",
            "  06:30  Vehicle load check and route confirmation",
            `  07:30  Arrive at ${venue}; unload heavy items first`,
            "  08:15  Backdrop, arch and hero installation up",
            "  09:15  Lighting rigged and tested",
            "  10:15  Tables dressed and stationery placed",
            "  11:30  Florals, candles and finishing details",
            "  12:30  Client sign-off and touch-ups",
            "  13:15  Team reset and quick meal before guests arrive",
          ],
        ];
        return pick(variants).join("\n");
      }
      case "Staff Task List":
        return [
          "STAFF RESPONSIBILITIES",
          "  • Lead Stylist — Concept integrity, client liaison, final sign-off.",
          "  • Assistant Stylist — Table styling, florals and candles.",
          "  • Setup Crew (x2) — Backdrop, heavy items and lighting.",
          "  • Runner — Fetching, packing and on-call throughout setup.",
          "  • Pack-Down Lead — Coordinates strike, inventory check and load-out.",
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

/** Parse user's colour input into individual named colours. */
function parseColours(raw: string): string[] {
  return raw
    .split(/[,;/&]+|\band\b/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Build a client-specific palette that complements the user's chosen colours. */
function complementaryPalette(userColours: string[]): {
  name: string;
  swatches: string[];
  why: string;
} {
  const primary = userColours[0] || "your primary tone";
  const secondary = userColours[1] || "a soft neutral";
  return {
    name: `Your Signature Blend`,
    swatches: [
      `${cap(primary)} — hero tone across backdrop and florals`,
      `${cap(secondary)} — supporting tone for linen and stationery`,
      `Warm ivory — softens the palette and reads beautifully on camera`,
      `Antique brass — metallic accent to add depth and warmth`,
    ],
    why: `Anchored on ${primary}${
      userColours[1] ? ` and lifted with ${secondary}` : ""
    }, this blend keeps your chosen palette centre-stage while adding two subtle supporting tones so the room feels layered rather than flat.`,
  };
}

export async function generateInspiration(
  template: InspirationTemplate,
  i: InspirationInputs,
  previous?: string,
): Promise<string> {
  await delay(300 + Math.random() * 300);
  return distinct(previous, () => buildInspiration(template, i));
}

function buildInspiration(
  template: InspirationTemplate,
  i: InspirationInputs,
): string {
  const rawEvent = i.eventType.trim();
  const event = naturalEvent(i.eventType, "your event");
  const theme = fallback(i.theme, "your theme");
  const coloursRaw = i.colours.trim();
  const colours = fallback(i.colours, "your chosen palette");
  const userColours = parseColours(coloursRaw);
  const primaryColour = userColours[0] || "the primary tone";
  const venue = fallback(i.venue, "the venue");

  const header = `${template.toUpperCase()}\nFor ${event} · Theme: ${theme} · Palette: ${colours}\n${"─".repeat(56)}\n`;

  const reqBlock = i.requirements.trim()
    ? `\n\nSPECIAL REQUIREMENTS CONSIDERED\n${splitNotes(i.requirements)
        .map((l) => `  • ${cap(l)}.`)
        .join("\n")}`
    : "";

  const budgetBlock = i.budget.trim()
    ? `\n\nBUDGET NOTE\n  • Concepts scaled to suit approximately ${i.budget.trim()}. Where helpful, swap fresh florals for dried and reuse ceremony pieces at the reception.`
    : "";

  const body = (() => {
    switch (template) {
      case "Colour Palette Suggestions": {
        const signature = complementaryPalette(userColours);

        const supportPool = [
          {
            name: "Warm Neutral Romance",
            swatches: [
              "Buttercream — soft base tone",
              "Sand — grounding mid-tone",
              "Toffee — depth for candles and stationery",
              "Cocoa — anchor for signage and framing",
            ],
            why: `Reads beautifully in warm venue lighting and complements ${primaryColour} without competing with it — ideal for ${event}.`,
          },
          {
            name: "Soft Botanical",
            swatches: [
              "Linen — clean backdrop tone",
              "Sage — organic supporting green",
              "Moss — florals and foliage depth",
              "Forest — signage and menu contrast",
            ],
            why: `Leans into the ${theme} feel and pairs naturally with ${primaryColour}, keeping the styling grounded and garden-fresh.`,
          },
          {
            name: "Modern Blush",
            swatches: [
              "Petal — airy base",
              "Rose — romantic mid-tone",
              "Terracotta — grounding warmth",
              "Wine — dramatic accent",
            ],
            why: `Adds romance to ${event} while the terracotta grounds ${primaryColour}, keeping the palette contemporary rather than saccharine.`,
          },
          {
            name: "Editorial Monochrome",
            swatches: [
              "Ivory — soft base",
              "Stone — supporting neutral",
              "Charcoal — sharp accent",
              "Matte black — signage and frames",
            ],
            why: `A tailored option when ${theme} calls for restraint — ${primaryColour} pops beautifully against the neutrals.`,
          },
        ];

        const supports = shuffle(supportPool).slice(0, 2);
        const all = [signature, ...supports];
        return all
          .map(
            (p, idx) =>
              `PALETTE ${idx + 1} — ${p.name}\n${p.swatches
                .map((s) => `  ▪ ${s}`)
                .join("\n")}\n  Why it works: ${p.why}`,
          )
          .join("\n\n");
      }

      case "Theme Inspiration": {
        const variants = [
          [
            `CONCEPT DIRECTIONS`,
            `  1. Modern Heirloom — Timeless silhouettes in ${colours}, layered linen, tapered candles and pressed florals suited to ${event}.`,
            `  2. Botanical Editorial — Sculptural greenery and oversized foliage that lean into ${theme}, staged for ${venue}.`,
            `  3. Soft Cinematic — Warm uplighting, mirrored surfaces and heirloom glassware to elevate ${venue}.`,
          ],
          [
            `CONCEPT DIRECTIONS`,
            `  1. Understated Luxe — Muted ${primaryColour}, brushed brass and floor-length linen for a refined take on ${theme}.`,
            `  2. Garden Storybook — Whimsical florals, dried grasses and hand-painted signage tailored to ${event}.`,
            `  3. Warm Modernist — Clean-lined furniture, sculptural blooms and a considered palette drawn from ${colours}.`,
          ],
        ];
        return pick(variants).join("\n");
      }

      case "Backdrop Styling Ideas":
        return [
          `BACKDROP IDEAS`,
          `  • Arched panel in ${primaryColour} with cascading florals on one shoulder, framed for guest arrival photos.`,
          `  • Textured fabric drape with warm uplighting behind — a soft, cinematic anchor for ${venue}.`,
          `  • Freestanding dried-floral wall with a hand-lettered plaque naming ${event}.`,
          `  • Suspended greenery installation over the top table for a photo-forward moment.`,
          `  • Balloon organic-garland archway in ${colours}, ideal if the brief calls for a joyful, celebratory feel.`,
        ].join("\n");

      case "Welcome Board Wording": {
        const eventPhrase = rawEvent ? rawEvent : "our celebration";
        return [
          `WELCOME BOARD OPTIONS`,
          `  1. "Welcome to ${eventPhrase} — where every detail was chosen with love."`,
          `  2. "So glad you're here. Find your seat, raise a glass, celebrate."`,
          `  3. "${cap(theme)}, together." — clean serif type on a matte board.`,
          `  4. "A gathering in honour of ___" — editorial, timeless, easy to personalise.`,
          `  5. "Please sign in and take a treat" — pair with a small favour station.`,
        ].join("\n");
      }

      case "Décor Styling Suggestions": {
        const c1 = userColours[0] || "your primary tone";
        const c2 = userColours[1] || "ivory";
        return [
          `STYLING SUGGESTIONS`,
          `  • Balloon combinations — Organic garland in ${c1}, ${c2} and antique brass, with a few oversized 90cm balloons for scale. Feels celebratory without tipping into childish, which suits ${event}.`,
          `  • Balloon styling — Anchor the garland asymmetrically over one shoulder of the backdrop and trail it down toward a plinth. This gives the photographer a natural focal point.`,
          `  • Backdrop concept — A soft arched panel in ${c1} with cascading florals on the upper corner, tailored to sit comfortably within ${venue}.`,
          `  • Floral accents — Focal blooms in ${primaryColour}, softened with foliage and a touch of dried texture inspired by ${theme}. Keeps the styling layered and camera-ready.`,
          `  • Furniture — Warm-wood tables, cross-back chairs and a small lounge vignette with a linen sofa; grounds ${venue} and gives guests a place to gather beyond the table.`,
          `  • Lighting — Warm uplighters against the backdrop, taper candles down the tables and fairy lights woven through greenery for a golden, cinematic mood after sunset.`,
          `  • Photo moment — A hand-lettered welcome board framed by florals near the entrance, plus a smaller vignette (bench + signage in ${c1}) for portrait shots.`,
          `  • Signage — Consistent hand-lettered menus, table numbers and directional signs; a small detail that lifts the whole event.`,
          `  • Finishing touches — Individually placed napkin sprigs, a personalised place card per guest and a scented candle at the entrance so the room smells as beautiful as it looks.`,
        ].join("\n");
      }


      case "Party Bucket & Gift Ideas":
        return [
          `GUEST FAVOUR IDEAS`,
          `  • Kraft box with artisan chocolate, a mini candle in ${primaryColour} and a handwritten thank-you card.`,
          `  • Seed-paper card guests can plant, printed to match ${theme}.`,
          `  • Small glass bottle of house-blend tea or coffee with a custom label referencing ${event}.`,
          `  • Child-friendly option: colouring set, sticker sheet and a small treat in a branded bucket.`,
          `  • Keepsake option: a mini framed print of the event signage — practical, personal and inexpensive at scale.`,
        ].join("\n");

      case "Photo Area Inspiration":
        return [
          `PHOTO AREA CONCEPTS`,
          `  • Signage + florals over a bench seat in ${primaryColour}, softly lit for evening portraits.`,
          `  • Mirror-and-neon combo with a short quote referencing ${theme}.`,
          `  • Framed floral window with props (hats, bouquets) for a playful moment at ${event}.`,
          `  • Polaroid station — guests pin their favourite shot onto a guest board as a live keepsake.`,
          `  • Balloon cloud in ${colours} suspended above a low bench — irresistible for group photos.`,
        ].join("\n");
    }
  })();

  return header + body + budgetBlock + reqBlock;
}
