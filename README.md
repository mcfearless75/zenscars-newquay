# ZensCars Newquay — static site

18-page static site for ZensCars Newquay private hire. No build step, no framework, no dependencies.

**Live (GitHub Pages):** see repo Settings → Pages
**Production domain (when DNS is pointed):** https://zenscars.co.uk/

## Structure

```
/                                 Home
/services/                        Services hub
  airport-transfers/              Cornwall Airport Newquay (NQY)
  train-station-transfers/        Newquay station, Par & Truro connections
  weddings-parties/               Wedding cars & party taxis
  school-contracts/               School run contracts
  hospital-clinic-transport/      Newquay → Treliske patient transport
  vip-chauffeur/                  VIP & chauffeur
/areas/                           Areas hub
  truro/ padstow/ wadebridge/ st-austell/ perranporth/
/about/  /reviews/  /faq/  /contact/
assets/css/style.css              Single stylesheet, all components
assets/js/main.js                 Scroll reveals, counters, accordion (progressive enhancement)
llms.txt                          Plain-language business summary for AI crawlers
robots.txt                        Explicitly allows GPTBot, ClaudeBot, Google-Extended, PerplexityBot
sitemap.xml                       Absolute URLs on zenscars.co.uk
```

## Paths

Internal links and assets use **depth-relative** paths (`../../assets/...`), so the site renders
correctly from a GitHub Pages project URL, Cloudflare Pages, a subfolder, or the root domain
without any rewriting.

Canonical URLs, `og:url`, `og:image` and `sitemap.xml` stay **absolute on `https://zenscars.co.uk/`**.
That is deliberate: the GitHub Pages preview tells search engines the real page lives on the
production domain, so the preview does not get indexed and compete with the live site.

## Deploying elsewhere

Drag the repo contents into Cloudflare Pages (no build command, output directory `/`).
Clean URLs work out of the box — every page is `index.html` inside its own folder.

## Contact form

No backend. The booking form composes a pre-filled WhatsApp message via a `wa.me` deep link.
Nothing to host, nothing to maintain. If submissions need logging later, that's a Cloudflare
Pages Function or a Formspree-style service.

A pre-launch checklist of client-side items to confirm is kept
out of source control in `NOTES.local.md`.
