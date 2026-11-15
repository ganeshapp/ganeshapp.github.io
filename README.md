# gapp.in

A minimal, hand-rolled Jekyll theme combining the blog, wiki, essays, projects, albums and now page into one site. No theme dependency, no framework — vanilla CSS and JS.

## Structure

```
_posts/       blog posts (URL: /blog/<slug>/)
_essays/      timeless writing (URL: /essays/<slug>/)
_projects/    portfolio entries (URL from `permalink` in front matter)
_wiki/        the wiki, one flat folder — digital-garden style (URL: /wiki/<Page-Name>/)
assets/albums/  photo albums (auto-scanned, see below)
now.md        the /now/ page
_plugins/     albums generator + baseurl link rewriter (run by GitHub Actions)
```

## Features

- Dark mode by default, light toggle (persisted in localStorage)
- Site-wide search: press `/` or click the magnifier (index built at compile time into `search.json`)
- Hover previews on every internal link (300 ms delay, fetched once, cached)
- Lightbox on album photos (arrow keys / swipe)
- RSS feed for blog posts at `/feed.xml`
- Fully responsive; album and project grids collapse to one column on phones

## Writing

**Math:** add `math: true` to a page's front matter to load KaTeX on that page only (nothing ships on pages that don't need it). Write inline math as `$...$` and display math as `$$...$$`.

**Easter eggs:** open devtools for a console greeting + a rot13 Fermi question; hover the `gapp` logo to flip it to 갭; on June 12 the title gets a birthday candle and the footer counts days alive; the 404 page has a mate-in-one chess puzzle.

**Blog post:** drop `YYYY-MM-DD-slug.md` in `_posts/` with `title:` and `date:` front matter.

**Wiki page:** drop a `.md` file straight into `_wiki/` — no folders, no filing decisions. Use normal markdown links (not `[[wikilinks]]`). Front matter needs `title:` and a `permalink:` like `/wiki/Page-Name/` (dashes for spaces). Topic hub pages (Running, Living in Korea, etc.) are just ordinary wiki pages with curated link lists; the start page at `wiki/index.md` links to the hubs. People navigate by hopping links or searching.

**Album:** create a folder under `assets/albums/`, e.g. `jeju_2026/`:
- `0001.jpg`, `0002.mp4`, … — the photos and videos, in filename order
- the **first image** is the album's cover on the /albums/ grid. There's no separate cover
  file — the cover is simply the first photo, and it appears in the album like any other.
- `album.json` — optional one-line `"summary"` (plain text, shown on the /albums/ card and under
  the album title) and per-photo captions (see below)
- `album.md` — optional long note in markdown (who came, the story), shown only on the album page
  between the summary and the photos

Folder name becomes the title (`jeju_2026` → "Jeju 2026"). Photos live in this repo and are served
directly, so there is no CDN and no second repo to keep in sync.

**Summary and captions** are optional. `album.json` looks like this, and is written by
[glickr](https://github.com/ganeshapp/glickr) — but it is plain JSON, one entry per line, so it is
easy to edit by hand:

```json
{
  "version": 1,
  "album": "jeju_2026",
  "pad": 4,
  "next": 3,
  "summary": "Jeju by bike, three days",
  "items": {
    "0001.jpg": "6am start, still dark",
    "0002.jpg": "Puncture #1"
  }
}
```

A photo with a caption shows it under the grid tile and in the lightbox, and uses it as the image's
alt text. A photo without one shows nothing extra.

**Uploading from a phone:** [glickr](https://github.com/ganeshapp/glickr) is an Android app that
writes albums to this repo through the GitHub API — it compresses and converts the media, numbers
the files, generates the cover, and commits a whole album in one go.

## Deploying

Built by `.github/workflows/deploy.yml` (GitHub Actions → GitHub Pages). In the repo settings, set **Pages → Source → GitHub Actions**.

- **Test deploy:** push to a repo named e.g. `test` → serves at `gapp.in/test`. The workflow passes the subpath as `--baseurl` automatically, and the `baseurl_links` plugin rewrites all root-relative links so everything works under the subpath.
- **Final deploy:** push to `ganeshapp.github.io`, then add a `CNAME` file containing `www.gapp.in` (don't add CNAME to the test repo — it would steal the domain).

## Local development

```
bundle install
bundle exec jekyll serve
```

## Analytics

The shared template supports [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/about/),
a free service for traffic and page-performance reporting. Your site stays on
GitHub Pages with its existing domain and DNS. Analytics is disabled until you
add the public beacon token to `_config.yml`:

```yaml
analytics:
  cloudflare:
    token: "YOUR_CLOUDFLARE_BEACON_TOKEN"
```

This is the `token` value from Cloudflare's `data-cf-beacon` snippet, **not a
Cloudflare API token or API key**. It appears in public page source and can be
committed. Leave it blank to turn analytics off.

### Create the account and connect this site

1. Create a free [Cloudflare account](https://dash.cloudflare.com/sign-up), or
   sign in to your existing account.
2. Open **Web Analytics → Add a site**, enter **www.gapp.in** as the hostname,
   select the matching entry, and choose **Done**. You do not need to move your
   domain, change nameservers, or switch hosting.
3. Open **Manage site** and find the JavaScript snippet. If Cloudflare offers
   automatic installation because your site is already proxied through it,
   choose **Enable with JS Snippet installation** so this template controls
   installation and you do not load the beacon twice.
4. Copy only the `token` value from `data-cf-beacon` into the config above. The
   template already inserts the script on every page; do not paste another copy.
5. Pull the latest posts, commit the config change, pull again before pushing,
   and push to the publishing branch. The existing GitHub Actions workflow
   builds with `JEKYLL_ENV=production` and deploys to GitHub Pages.
6. After deployment, visit a few pages, navigate away, then open your site's
   **Web Analytics** dashboard. Data may take a few minutes to appear. Browsers
   blocking analytics will not send visits, and earlier visits cannot be recovered.

Cloudflare's [setup guide](https://developers.cloudflare.com/web-analytics/get-started/)
covers the current dashboard screens.

### What the dashboard shows

- **Visits and page views:** traffic volume over your chosen date range. Visits
  are counted from external referrals or direct entries, not unique people.
- **Paths:** which blog posts, wiki pages, albums, and other URLs get traffic.
- **Referers:** which external sites sent visits.
- **Country, device type, browser, and operating system:** traffic breakdowns.
- **Page load time and Core Web Vitals:** how fast pages load and respond.

Cloudflare Web Analytics does **not** provide time spent reading each page or
individual visitor journeys. **Page load time measures loading speed, not time
spent on the site.** Search overlay interactions and album lightbox opens are
not separate page views or custom events in this integration. See the
[metrics](https://developers.cloudflare.com/web-analytics/data-metrics/high-level-metrics/)
and [dimensions](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/)
references for available reports.

Normal `bundle exec jekyll serve` previews do not load analytics. Any production
build with a token does, including test deployments; clear the token in a test
repo or override config to exclude those visits. Add `analytics: false` to an
individual page's front matter to exclude it.

## Roundup publishing

Roundups are a Jekyll collection stored in `_roundup/`. In Glean, select this repository, its publishing branch, and `_roundup` as the content folder. The website URL is `https://www.gapp.in`.

Each issue is a Markdown file with `layout: roundup`, a title, date, and stable permalink such as `/roundup/2026-W46/`. Its body preserves the card order selected in Glean. The index at `/roundup/` lists issues by date, and site search includes their content. Glean's `glean_issue` and `glean_revision` fields let the app verify that the uploaded version has reached the live website.
