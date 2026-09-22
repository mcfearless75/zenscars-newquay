# ZensCars Newquay — Accessibility Review & Design Critique

Audited against WCAG 2.2 AA on the live build at
`https://mcfearless75.github.io/zenscars-newquay/`. Every finding below was verified
in a real browser against the deployed pages, not inferred from source.

Standard: **WCAG 2.2 Level AA**. Severity reflects blocking risk to a client launch.

> **Status: findings 1, 3, 4, 5 and 6 are FIXED** and verified on the live build
> **All ten findings are now fixed and verified on the live build**, along with
> 11 and 11b (reported after launch) and 12 and 13 below, found while fixing them.
>
> **Correction to an earlier revision of this document:** it gave `#8a6a22` as
> 5.99:1 on cream. The true figure is **4.40:1 — below the 4.5:1 AA threshold**.
> The shipped token is `#7a6025` (5.20:1 on cream, 4.53:1 on cream-dim), same hue
> and saturation, one step darker.

---

## BLOCKER — fails Level A

### 1. ~~The FAQ accordion cannot be operated by keyboard~~ — FIXED

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

### 2. ~~Collapsed answers stay in the accessibility tree~~ — FIXED

**WCAG 1.3.2 / 4.1.2** · `assets/css/style.css:263`

`.faq-a` collapses with `max-height:0; overflow:hidden`. That hides it visually but not
from screen readers — every answer is announced even when closed, so the accordion
reads as one undifferentiated wall of text. No links sit inside them today, so nothing
is focusable-but-invisible — but that breaks the moment a link is added.

**Fix** — toggle `hidden` alongside the `open` class, or add
`.faq-item:not(.open) .faq-a{visibility:hidden}` and flip `aria-hidden` in the handler.

---

## HIGH — fails Level AA

### 3. ~~Gold on cream is 2.09:1 — the eyebrow fails on every light section~~ — FIXED

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
:root{ --gold-on-light:#7a6025; }   /* 5.20:1 on cream, 4.53:1 on cream-dim */
.eyebrow{ color:var(--gold-on-light); }
.faq-q .chev{ color:var(--gold-on-light); }
.hero .eyebrow,.page-hero .eyebrow,
.band-dark .eyebrow,.cta-band .eyebrow{ color:var(--gold); }
```

`--gold` is unchanged for everything on ink. The dark-context override must include
`.page-hero` — inner pages use that class, not `.hero`, and omitting it would have
turned every service and area eyebrow dark-on-dark.

**Verified live:** light-context eyebrows and FAQ chevrons 5.20:1; `.band-dark`
eyebrow still 7.26:1.

### 4. ~~The focus indicator is gold on white — 2.09:1~~ — FIXED

**WCAG 1.4.11 Non-text Contrast** · `assets/css/style.css:336`

`.form-field input:focus{outline:2px solid var(--gold)}` is the site's only custom focus
ring, and against the white input background it measures **2.09:1** where 3:1 is
required. The one place focus was explicitly styled is the one place it is hardest to see.

Everything else — 90 WhatsApp links, 84 phone links, nav, cards — relies on the browser
default ring. Nothing removes it (no `outline:none` anywhere, which is good), but a
default ring over a dark navy hero is unreliable.

**Fix** — one global rule plus a darker ring on light surfaces:

```css
:focus-visible{ outline:3px solid var(--gold-on-light); outline-offset:2px; }
.hero :focus-visible,.page-hero :focus-visible,.band-dark :focus-visible,
.cta-band :focus-visible,.nav :focus-visible,.sticky-cta :focus-visible,
.footer :focus-visible{ outline-color:var(--gold-light); }
```

Light surfaces are the default and dark contexts opt into the lighter ring, mirroring
how `.eyebrow` is handled.

**Verified live with a real Tab press** (programmatic `.focus()` does not trigger
`:focus-visible`): nav link `#e3c274` at 10.15:1 on ink; form input `#7a6025` at
5.95:1 on white.

### 5. ~~The fixed header obscures anchor targets — including the skip link~~ — FIXED

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

### 6. ~~The brand tagline overlaps the WhatsApp button at 375px~~ — FIXED

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

Hiding the tagline alone was **not sufficient** — the `.brand` wordmark itself still
overflowed by the same 31px, because the 166px WhatsApp pill squeezes `.brand` below
its content width. The nav button is redundant at that size anyway: the sticky bottom
bar already carries both WhatsApp and Call.

```css
.brand small{ font-size:.75rem; white-space:nowrap; }   /* 12px */
@media (max-width:560px){
  .brand small{ display:none; }
  .nav-cta .btn-primary{ display:none; }
  .brand{ flex:none; }
}
```

**Verified live at 375px:** wordmark overflow 0px, no horizontal scroll.

---

## HIGH — reported by the client after launch

### 11. ~~The page pans left-right on mobile~~ — FIXED

**WCAG 1.4.10 Reflow (AA)** · `index.html`, `about/index.html`, `assets/css/style.css:54`

`body{overflow-x:hidden}` was masking this. It clamps `scrollWidth` to the viewport,
so an automated check reads clean while a real phone still pans — which is why my
first pass reported "no horizontal scroll at 375px" and was wrong. With the guard
disabled the page measured **404px against a 375px viewport: 29px of overflow**.

Root cause, isolated by hiding candidates one at a time until `scrollWidth` dropped
to 375: the Wayne portrait carries an **inline** `style="max-width:380px"` (420px on
About) — which is why it never appeared in a CSS grep.

Grid items default to `min-width:auto`, so that replaced element sets a min-content
floor wider than its own track. The authored rule is correct — `.split` is
`grid-template-columns:1fr` below 880px — but the single `1fr` track resolved to
**380px inside a 327px container**:

```
.split          boxW 327   grid-template-columns: 380px   <- track wider than the box
.split-media    minContent 380
  └─ img        minContent 380   max-width: 380px (inline)
```

**Fix** — let the image shrink while keeping its desktop cap, and stop the whole class
of bug recurring:

```css
img{ max-width:100%; height:auto; display:block; }
.grid > *,.split > *,.steps > *,.two-col > *{ min-width:0; }
```
```html
<img ... style="max-width:min(380px,100%)">
```

**Verified live with `overflow-x` disabled: 24 checks — 6 pages × 320/360/375/414px —
0 overflow on all of them.**

### 11b. The same portrait was stretched to twice its height

Found while fixing the above. `img` had `max-width:100%` but **no `height:auto`**, and
the markup carries `width="900" height="1058"`. With the width constrained to 380px the
height attribute still applied literally, rendering the portrait **380×1058** against a
natural 430×506 — more than double its correct height.

`height:auto` in the rule above fixes it. **Verified:** now 327×385, rendered aspect
0.850 against natural 0.850.

---

## MEDIUM

### 7. ~~The mobile menu has no Escape key and no focus containment~~ — FIXED

`assets/js/main.js`

Opening the menu sets `body.style.overflow='hidden'`, but focus is never moved into the
panel, Escape does not close it (there is no `keydown` handler in the file at all), and
Tab walks straight through into the page behind it.

**Fix** — close on Escape, move focus to the first link on open, return it to the toggle
on close.

### 8. ~~378 inline SVGs, none marked decorative~~ — FIXED

`aria-hidden="true"` appears on **0 of 378** inline `<svg>` elements. Decorative icons
inside already-labelled links get announced as "graphic", padding every link with noise.
Add `aria-hidden="true" focusable="false"` to every decorative icon.

### 9. ~~Footer and card links are 16–20px tall~~ — FIXED

**WCAG 2.5.8 Target Size (Minimum)** needs 24×24 CSS px. 19 interactive elements measure
under that at mobile — service links at 20px, the Bluewater credit at 16px. The spacing
exception may cover some; raising line-height or adding vertical padding clears it
outright. `.nav-toggle` is 42×42, just under the 44×44 platform guidance.

### 10. ~~The stat counter ignores `prefers-reduced-motion`~~ — FIXED

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

## Found while fixing the above

### 12. ~~Eleven FAQ answers were invisible on the service pages~~ — FIXED

**WCAG 1.4.3 (AA)** · `assets/css/style.css`

`.faq-a p` hardcodes `--ink-2`. On `/faq/` the accordion sits on cream, so it reads
fine — but on the six service pages the FAQ sits inside `.band-dark`, putting
`#122436` on `#0b1b2b`: **1.1:1**. Eleven answers were effectively invisible unless
you selected the text. The chevron and the item's bottom rule were light-surface
assumptions too.

```css
.band-dark .faq-a p{color:rgba(244,239,230,.85)}   /* 11.2:1 */
.band-dark .faq-q .chev{color:var(--gold)}          /* 7.26:1 */
.band-dark .faq-item{border-bottom-color:rgba(244,239,230,.16)}
```

### 13. ~~The trust card heading was cream on white~~ — FIXED

**WCAG 1.4.3 (AA)** · reported by the client

`.float-card` sets `background:#fff` but no `color`, so inside `.band-dark` — which
sets `color:var(--cream)` — its `<strong>` inherited cream onto white: **1.15:1**.
The `<span>` beneath it escaped only because it sets its own colour, which is why
half the card was readable and half was not. Now `color:var(--ink)` on the card
itself, so it cannot inherit from whatever it is placed on. **17.41:1.**

Findings 12 and 13 are the same defect as the CTA-band bug the brief says was caught
during build: a component with a hardcoded colour dropped onto a surface of the
opposite tone. Worth a rule going forward — **any component with its own background
must also set its own colour.**

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
- ~~No horizontal scroll at 375px~~ — **this was wrong**, see finding 11.
  `body{overflow-x:hidden}` clamps `scrollWidth`, so the measurement could not
  detect the 29px of real overflow. Now genuinely clean, verified with the guard off.

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

| # | Finding | WCAG | Severity | Status |
|---|---|---|---|---|
| 1 | FAQ keyboard-inoperable | 2.1.1 (A) | Blocker | **Fixed** |
| 3 | Gold on cream 2.09:1 | 1.4.3 (AA) | High | **Fixed** |
| 5 | Fixed header obscures focus | 2.4.11 (AA) | High | **Fixed** |
| 4 | Focus ring 2.09:1 on white | 1.4.11 (AA) | High | **Fixed** |
| 6 | Brand overlaps WhatsApp @375px | — | High | **Fixed** |
| 2 | Collapsed answers still announced | 1.3.2 (A) | Medium | **Fixed** |
| 7 | No Escape / focus trap on menu | 2.1.2 (A) | Medium | **Fixed** |
| 10 | Counter ignores reduced-motion | 2.3.3 (AAA) | Medium | **Fixed** |
| 8 | 378 undecorated SVGs | 4.1.2 (A) | Medium | **Fixed** |
| 9 | Targets under 24×24 | 2.5.8 (AA) | Low | **Fixed** |
| 11 | Page pans horizontally on mobile | 1.4.10 (AA) | High | **Fixed** |
| 11b | Portrait stretched 2x height | — | High | **Fixed** |
| 12 | 11 FAQ answers invisible on dark | 1.4.3 (AA) | High | **Fixed** |
| 13 | Trust card heading cream on white | 1.4.3 (AA) | High | **Fixed** |

Findings 1, 3, 4, 5 and 6 are fixed and verified on the live build. The remaining
five are quality items, none of them launch-blocking.

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
