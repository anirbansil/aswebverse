# ASW Digital Studio

A premium, fully responsive marketing website for ASW Digital Studio — an IT, AI, and software development company. Built with plain HTML, CSS, and JavaScript (plus Bootstrap for base utilities), no build step required.

## Pages

| File | Description |
| --- | --- |
| `index.html` | Homepage — hero, services, industries, process, case studies, stats, testimonials, FAQ |
| `about.html` | Company story, values, team, stats |
| `services.html` | Detailed breakdown of all 8 service lines |
| `industries.html` | Detailed breakdown of all 8 industries served |
| `case-studies.html` | Extended case study grid |
| `insights.html` | Blog / insights listing |
| `contact.html` | Contact form and info |
| `privacy.html` / `terms.html` | Legal pages |

## Structure

```
assets/
  css/style.css        Design system + all component/section styles
  js/main.js            Mega menu, mobile drawer, scroll reveal, counters,
                        testimonial slider, FAQ accordion, contact form
  images/               Photography (AVIF) + logo/favicons
  fonts/inter/           Self-hosted Inter font files (woff2)
  vendor/bootstrap/      Self-hosted Bootstrap CSS/JS (no CDN dependency)
```

Everything is self-hosted — no external CDN calls at runtime, so the site works fully offline.

## Running locally

No build step. Just serve the folder with any static server, for example:

```bash
python3 -m http.server 8080
# then open http://localhost:8080/index.html
```

## Design system

Colors, typography, spacing, and animation timing are defined as CSS custom properties at the top of `assets/css/style.css` (`:root`). Update tokens there to retheme the whole site consistently.

## Notes

- All imagery lives in `assets/images/` and is referenced directly — no placeholder/remote images.
- Motion respects `prefers-reduced-motion`.
- Mega menu (desktop) / accordion (mobile) covers Services and Industries navigation.
- The contact form is front-end only (no backend) — wire `assets/js/main.js`'s `#contactForm` submit handler to your endpoint of choice.
