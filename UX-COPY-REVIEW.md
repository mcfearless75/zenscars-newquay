# ZensCars Newquay — UX Copy Review

Reviewed against the brief's Section 5 (tone and GEO intent). Section 6 governs which
facts are locked, so this pass is about **voice, consistency, clarity and CTA quality**,
not re-litigating distances or dates.

Copy extracted from all 18 live pages: every H1, lede, H2, eyebrow, button label and
form string.

---

## 1. The same action has four different labels — BLOCKER for consistency

This is the largest issue on the site. Counting every button across 18 pages:

**WhatsApp — one action, four labels**

| Label | Count | Where |
|---|---|---|
| `WhatsApp` | 55 | nav, sticky bar |
| `Book with WhatsApp` | 17 | service and area page CTAs |
| `Book on WhatsApp` | **1** | **homepage hero — the single highest-value CTA on the site** |
| `Say hello on WhatsApp` | 1 | contact |

**Phone — one action, four labels**

| Label | Count |
|---|---|
| `Call` | 19 |
| `Call Now` | 18 |
| `Call 07376 299060` | 17 |
| `07376 299060` (bare) | 12 |

A user moving between pages sees the same button renamed each time. It reads as four
different products rather than one operator, and it quietly undermines the
"one driver, one number" story the rest of the copy works hard to tell.

**Recommended**

| Context | Use | Why |
|---|---|---|
| Primary booking CTA | **Book on WhatsApp** | "book *on* WhatsApp" is the natural British phrasing; "book *with* WhatsApp" reads as booking the app itself |
| Phone CTA, full | **Call 07376 299060** | verb-led and the number is visible — best for a service where people do still ring |
| Compact bars (nav, sticky) | **WhatsApp** / **Call** | space-constrained, icon-paired; keep short but pick one and hold it |

The homepage hero is currently the **only** page using the better phrasing. Align the
other 17 up to it rather than flattening the hero down.

**Also:** the 12 bare `07376 299060` links have no verb. With the icon now correctly
`aria-hidden`, a screen reader announces only a string of digits with no indication
it dials. `Call 07376 299060` fixes both.

---

## 2. "Ready to book vip & chauffeur?" — template artifact

The closing CTA band on each service page is generated from the service name, and the
seams show:

| Page | Current | Problem |
|---|---|---|
| VIP & Chauffeur | `Ready to book vip & chauffeur?` | **lowercase "vip"**, and the noun is incomplete |
| Weddings & Parties | `Ready to book weddings & parties?` | you don't "book a wedding" from a taxi firm |
| Hospital & Clinic | `Ready to book hospital & clinic runs?` | acceptable but clumsy |
| Airport / Train / School | `Ready to book airport transfers?` etc. | fine |

**Recommended** — write these six by hand rather than generating them:

| Page | Copy |
|---|---|
| Airport transfers | Ready to book your airport transfer? |
| Train station | Ready to book your station transfer? |
| Weddings & parties | Planning a wedding or a night out? |
| School contracts | Ready to set up a school contract? |
| Hospital & clinic | Ready to book a hospital run? |
| VIP & chauffeur | Ready to book a chauffeur? |

Singular ("your airport transfer") is warmer than the plural service-category name and
matches how a customer would actually say it.

---

## 3. Two voices are fighting, and the weaker one owns the homepage

The rebuild's voice is genuinely good — concrete, British, understated, confident
without straining:

> "A driver who answers his own phone"
> "No call centre, no rota of strangers — just a fixed quote and a driver who shows up."
> "Questions, answered directly" · "it's Wayne who answers, not a script"

Retained from the old site is a second, very different register:

> "every customer treated as **supremely special**"
> "You'll receive **ultra topnotch** service, in all ways possible"
> "you'll have had **five-star treatment** the whole way through"
> "I **sincerely** look forward to giving you **exemplary** private hire service."
> "There is no mere 'good enough' from ZensCars"

Stacked superlatives read as *cheaper*, not more premium — they are the register of a
discount listing, and they work against the positioning the design is carrying. The
first voice sells the premium; the second undercuts it.

**The problem is where it sits.** On `/about/` this copy is explicitly framed by an
eyebrow reading **"In his own words"** — that is a quote, it is authentic, and it should
stay exactly as it is. People buy from Wayne, not from a brand.

But the **homepage hero lede** uses the same lines *unattributed, as site voice*:

> "From the moment Wayne answers your call, you'll know you've made the right choice.
> Airport transfers, weddings, hospital runs and late-night rescues across Newquay and
> Cornwall — every customer treated as supremely special."

That is the most-read sentence on the site, and it is the weakest copy on it.

**Recommended hero lede**

| | Copy | Tone |
|---|---|---|
| **A** (recommended) | From a 5am airport run to a wedding nobody wants to leave to chance — one driver, a fixed quote, and a phone that Wayne answers himself. | Concrete, matches the site's strongest existing voice, keeps the proof points |
| **B** | Airport transfers, weddings, hospital runs and late-night rescues across Newquay and Cornwall. One driver, start to finish — and it's Wayne who answers the phone. | Keeps the current service list; safest minimal change |
| **C** | Wayne answers the phone, quotes you a fixed price, and drives you himself. That's the whole business. | Boldest; leans hardest into the differentiator |

All three drop "supremely special" while keeping the promise it was reaching for.

**Note:** "five-star treatment" on `/about/` is puffery rather than a rating claim, so
it is not in the same class as the "100% outstanding Google Reviews" line already
removed. But given that line was pulled, it is worth a look — it sits one word away
from implying a rating the business has not evidenced.

---

## 4. Arrow glyphs inside button labels

Area pages use `&rarr;` in the accessible name of a link:

```html
<a class="btn btn-dark" ...>Book Newquay &rarr; Truro</a>
```

Screen readers announce this as "Book Newquay **rightwards arrow** Truro". The H2
directly above it already reads "Book Newquay **to** Truro" — so the page contradicts
itself, and the accessible version is the worse one.

**Recommended:** `Book Newquay to Truro` in the label. Keep the arrow in the *eyebrow*
(`Newquay → Padstow`) where it is decorative and scannable, but not in an interactive
element's name. Applies to all five area pages.

---

## 5. "What you actually get" — ×6

Appears identically as the H2 on all six service pages. "Actually" is quietly
defensive: it implies a comparison to someone who doesn't deliver, which the brand
otherwise never stoops to. It is also the one heading a reader meets six times.

Low priority — it is punchy and it does earn its place. But **"What's included"** or
**"What the job includes"** says the same thing without the edge, and varying it per
service would help the pages feel individually written.

---

## What is already strong

Worth recording, because it is most of the copy:

- **`Get a fixed quote`** (11×) is the best CTA on the site — verb-led, specific, and it
  names the benefit rather than the mechanism. Consider promoting it over generic
  "Book this service" (6×).
- **The contact form sets expectations properly**: *"Fill this in and it opens straight
  into WhatsApp, ready to send — nothing gets lost in a contact-form inbox."* That is
  exactly the pattern — it tells the user the form leaves the site, and why that is
  better for them. No change needed.
- **Form labels and placeholders are genuinely useful** — "Anything else? (passengers,
  luggage, flight number)" prompts the information Wayne actually needs, and the
  placeholders are real examples ("e.g. Fri 3 Oct, 6:30am"), not restated labels.
- **Area page ledes open with the quotable fact** — "Truro is Cornwall's only city —
  roughly 12 miles and 20 minutes from Newquay". This is exactly right for the GEO
  intent in Section 5: liftable whole into an AI answer.
- **`Questions, answered directly`** and *"it's Wayne who answers, not a script"* — the
  FAQ page voice is the site at its best.
- **Eyebrow casing** is mixed in source (`Book Now` vs `Send a booking request`) but
  `.eyebrow` applies `text-transform:uppercase`, so this is invisible to users. Not a
  defect — noted only so it is not "fixed" twice.

---

## Priority

| # | Finding | Impact | Effort | Whose call |
|---|---|---|---|---|
| 1 | Four labels per action | High — consistency, trust | Mechanical | Mine |
| 2 | "Ready to book vip & chauffeur?" | High — visible defect | Mechanical | Mine |
| 4 | Arrow in accessible name | Medium — a11y + contradiction | Mechanical | Mine |
| 3 | Hero lede in the weaker voice | High — most-read copy | Rewrite | **Client's** |
| 5 | "What you actually get" ×6 | Low | Rewrite | **Client's** |

Findings 1, 2 and 4 are consistency and correctness — no brand judgement involved.
Finding 3 changes how the business sounds, and part of it is Wayne's own words, so it
is his to approve, not mine to quietly rewrite.
