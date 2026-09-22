# ZensCars Newquay — Accessibility Review & Design Critique

Audited against WCAG 2.2 AA on the live build at
`https://mcfearless75.github.io/zenscars-newquay/`. Every finding below was verified
in a real browser against the deployed pages, not inferred from source.

Standard: **WCAG 2.2 Level AA**. Severity reflects blocking risk to a client launch.

---

## BLOCKER — fails Level A

### 1. The FAQ accordion cannot be operated by keyboard

**WCAG 2.1.1 Keyboard (Level A)** · `assets/js/main.js`, `faq/index.html`

`.faq-q` is a `<div role="button" tabindex="0" aria-expanded="false">`. The markup is
right — focusable and correctly labelled. But `main.js` binds **only** a `click`
listener. A native `<button>` synthesises a click from Enter/Space; a `div[role=button]`
does not. There is no `keydown` handler anywhere in the file.

Verified on the live page — focus the first question, dispatch Enter then Space:

```
{ focused: true, ariaBefore: "false", ariaAfterKeyboard: "false",
  itemOpen: false, answerMaxHeight: "0px" }
```

Nothing opens. Every answer on `/faq/` is unreachable without a mouse. The page also
carries FAQPage schema, so Google indexes content a keyboard user cannot open.

**Fix** — in the FAQ block in `main.js`:

```js
q.addEventListener('keydown', function(e){
  if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
    e.preventDefault();      // stop Space scrolling the page
    q.click();
  }
});
```

Better still, make `.faq-q` a real `<button type="button">` and drop the
`role`/`tabindex` — keyboard behaviour then comes for free and cannot regress.

### 2. Collapsed answers stay in the accessibility tree

**WCAG 1.3.2 / 4.1.2** · `assets/css/style.css:263`

`.faq-a` collapses with `max-height:0; overflow:hidden`. That hides it visually but not
from screen readers — every answer is announced even when closed, so the accordion
reads as one undifferentiated wall of text. No links sit inside them today, so nothing
is focusable-but-invisible — but that breaks the moment a link is added.

**Fix** — toggle `hidden` alongside the `open` class, or add
`.faq-item:not(.open) .faq-a{visibility:hidden}` and flip `aria-hidden` in the handler.

---

## HIGH — fails Level AA

### 3. Gold on cream is 2.09:1 — the eyebrow label fails on every light section

**WCAG 1.4.3 Contrast (Minimum)** · `assets/css/style.css:59-62`

Measured from rendered `getComputedStyle` values, not from the tokens:

| Element | Colour | On | Ratio | Needs | Result |
|---|---|---|---|---|---|
| `.eyebrow` (12.5px) | `#c9a24b` | `#f4efe6` | **2.09:1** | 4.5:1 | **FAIL** |
| `.faq-q .chev` icon | `#c9a24b` | `#f4efe6` | **2.09:1** | 3:1 (1.4.11) | **FAIL** |
| `--green-check` | `#3f7a5c` | `#f4efe6` | 4.42:1 | 4.5:1 | marginal fail |
| `--red` as text | `#c2402e` | `#0b1b2b` | 3.37:1 | 4.5:1 | fail |

The eyebrow is the section kicker — "BOOK NOW", "SERVICE", "NEWQUAY — TRURO" — and it
appears on every light section sitewide. This is systemic, not one component.

The brief notes a contrast bug was caught and fixed during build (dark-on-dark CTA
subtext). That fix was real but partial; the gold-on-cream pairing survived it.

**The same gold reads 7.26:1 on ink and passes comfortably.** The palette is not broken
— it is being used on the wrong background. Darkening the accent only where it sits on
cream preserves the brand:

```css
:root{ --gold-on-light:#8a6a22; }   /* 5.99:1 on cream — passes AA */
.eyebrow{ color:var(--gold-on-light); }
.faq-q .chev{ color:var(--gold-on-light); }
```

Keep `--gold` exactly as-is for everything on ink.

### 4. The focus indicator is gold on white — 2.09:1

**WCAG 1.4.11 Non-text Contrast** · `assets/css/style.css:336`

`.form-field input:focus{outline:2px solid var(--gold)}` is the site's only custom focus
ring, and against the white input background it measures **2.09:1** where 3:1 is
required. The one place focus was explicitly styled is the one place it is hardest to see.

Everything else — 90 WhatsApp links, 84 phone links, nav, cards — relies on the browser
default ring. Nothing removes it (no `outline:none` anywhere, which is good), but a
default ring over a dark navy hero is unreliable.

**Fix** — one global rule plus a darker ring on light surfaces:

```css
:focus-visible{ outline:3px solid var(--gold-light); outline-offset:2px; }
.form-field input:focus-visible,
.form-field select:focus-visible,
.form-field textarea:focus-visible{ outline:3px solid var(--gold-on-light); }
```

### 5. The fixed header obscures anchor targets — including the skip link

**WCAG 2.4.11 Focus Not Obscured (Minimum)** · `assets/css/style.css:36, 85`

The nav is `position:fixed` at **76px** tall. `scroll-padding-top` is `auto` and
`scroll-behavior:smooth` is on, so any in-page jump lands with its target under the header.

That includes the skip link — `.skip-link` → `#main` — so the site's headline
accessibility feature drops keyboard users behind the very bar they skipped. On mobile
the 81px `.sticky-cta` does the same at the bottom edge.

**Fix** — two lines:

```css
html{ scroll-padding-top:calc(var(--nav-h) + 8px); }
@media (max-width:720px){ html{ scroll-padding-bottom:96px; } }
```

### 6. The brand tagline overlaps the WhatsApp button at 375px

**Layout defect** · `assets/css/style.css:94`

Measured at 375×812 on `/contact/`:

```
.brand        x 24 → 129
.brand small  x 68 → 160   (overflows its own parent by 31px, wraps to 2 lines)
.btn-primary  x 129 → 295  (WhatsApp)
```

`.brand small` runs **31px past** its parent's right edge and collides with the WhatsApp
pill — visible as a clipped "ZensCa…" wordmark with the gold pill over the tagline. The
tagline is also `font-size:.6rem` — **9.6px**, well under the 12px floor — with `.16em`
letter-spacing forcing it wider still.

**Fix** — hide it below the width where it stops fitting, and raise it above 12px where
it does show:

```css
.brand small{ font-size:.75rem; }          /* 12px */
@media (max-width:560px){ .brand small{ display:none; } }
```

---

## MEDIUM

### 7. The mobile menu has no Escape key and no focus containment

`assets/js/main.js`

Opening the menu sets `body.style.overflow='hidden'`, but focus is never moved into the
panel, Escape does not close it (there is no `keydown` handler in the file at all), and
Tab walks straight through into the page behind it.

**Fix** — close on Escape, move focus to the first link on open, return it to the toggle
on close.

### 8. 378 inline SVGs, none marked decorative

`aria-hidden="true"` appears on **0 of 378** inline `<svg>` elements. Decorative icons
inside already-labelled links get announced as "graphic", padding every link with noise.
Add `aria-hidden="true" focusable="false"` to every decorative icon.

### 9. Footer and card links are 16–20px tall

**WCAG 2.5.8 Target Size (Minimum)** needs 24×24 CSS px. 19 interactive elements measure
under that at mobile — service links at 20px, the Bluewater credit at 16px. The spacing
exception may cover some; raising line-height or adding vertical padding clears it
outright. `.nav-toggle` is 42×42, just under the 44×44 platform guidance.

### 10. The stat counter ignores `prefers-reduced-motion`

The CSS block at `style.css:316` correctly kills reveals and transitions. The
`requestAnimationFrame` counter in `main.js` is not gated — numbers still animate for
users who asked for no motion. The brief states motion respects the preference; that is
true of the CSS, not the JS.

```js
if(matchMedia('(prefers-reduced-motion: reduce)').matches){
  el.textContent = target + suffix; return;
}
```

---

## What is already right

Worth stating plainly, because a lot of it is:

- **Every image has alt text** — none missing, across all 18 pages.
- **Contrast on dark is excellent** — cream on ink 15.21:1, gold on ink 7.26:1, dimmed
  cream on ink 8.95:1. All AAA.
- **No `outline:none` anywhere.** Focus is never destroyed, only under-styled.
- A real **skip link**, landmark `aria-label`s (`Primary`, `Breadcrumb`), and
  `aria-expanded` correctly wired to the nav toggle.
- Titles and meta descriptions are **unique across all 18 pages**.
- `prefers-reduced-motion` handled in CSS, with `!important` so it actually wins.
- Semantic heading structure and breadcrumbs on every page.
- No horizontal scroll at 375px (`scrollWidth` 375 = viewport).

---

## Design critique

The visual direction is genuinely good, and I would not touch the palette or the type.
Fraunces over Inter reads premium without reading corporate, which is the right call for
a one-man operator competing against fleet-taxi sites. Ink navy and cream with a gold
accent sidesteps taxi-yellow cliché entirely. The route cards with distance and time
pills are the strongest component on the site — they answer the actual search query
("how far is Newquay to Truro") before the user has to scroll.

Three things hold it back, none of which require changing the direction:

1. **The gold is doing a job it cannot do on light backgrounds.** On ink it is a
   confident accent at 7.26:1. On cream it is decoration at 2.09:1 — legible to the
   designer, invisible to a 60-year-old booking a hospital transfer. One extra token fixes it.
2. **The mobile nav carries one element too many.** Wordmark, tagline, a 166px WhatsApp
   pill and a hamburger inside 375px is what produces the overlap. Drop the tagline under
   560px — the sticky bottom bar already carries WhatsApp, so nothing is lost.
3. **The sticky bottom bar is 81px but body padding reserves 74px.** The last 7px of
   every page sits under the bar.

---

## Priority

| # | Finding | WCAG | Severity | Effort |
|---|---|---|---|---|
| 1 | FAQ keyboard-inoperable | 2.1.1 (A) | Blocker | 5 lines |
| 3 | Gold on cream 2.09:1 | 1.4.3 (AA) | High | 1 token |
| 5 | Fixed header obscures focus | 2.4.11 (AA) | High | 2 lines |
| 4 | Focus ring 2.09:1 on white | 1.4.11 (AA) | High | 1 rule |
| 6 | Brand overlaps WhatsApp @375px | — | High | 2 rules |
| 2 | Collapsed answers still announced | 1.3.2 (A) | Medium | 1 rule |
| 7 | No Escape / focus trap on menu | 2.1.2 (A) | Medium | ~15 lines |
| 10 | Counter ignores reduced-motion | 2.3.3 (AAA) | Medium | 2 lines |
| 8 | 378 undecorated SVGs | 4.1.2 (A) | Medium | template pass |
| 9 | Targets under 24×24 | 2.5.8 (AA) | Low | padding |

Findings 1, 3, 4, 5 and 6 are the set to fix before this goes in front of a client.

---

## Method

WCAG ratios were computed from rendered `getComputedStyle` values with composited alpha,
against the sRGB relative-luminance formula — not from the design tokens — so
opacity-layered text is measured as it actually paints. Keyboard behaviour was tested by
dispatching real `KeyboardEvent`s at focused controls on the live pages. Layout was
measured with `getBoundingClientRect` at 375×812.

Guidance cross-checked against ui-ux-pro-max (`--domain ux`, `--domain icons`): Keyboard
Navigation, Focus States, Focus Not Obscured (Minimum and Enhanced), Touch Target Size,
Touch Spacing.

This is an automated and manual review, not a substitute for testing with actual screen
reader users. It does not cover AT-specific behaviour in NVDA, JAWS or VoiceOver.
