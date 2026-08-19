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
- `album.md` — plain-text blurb, no front matter needed
- `album.json` — optional per-photo captions (see below)

Folder name becomes the title (`jeju_2026` → "Jeju 2026"). Photos live in this repo and are served
directly, so there is no CDN and no second repo to keep in sync.

**Captions** are optional and per photo. `album.json` looks like this, and is written by
[glickr](https://github.com/ganeshapp/glickr) — but it is plain JSON, one entry per line, so it is
easy to edit by hand:

```json
{
  "version": 1,
  "album": "jeju_2026",
  "pad": 4,
  "next": 3,
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
