# aditya-ramabadran.github.io

Personal website and writing archive for Aditya Ramabadran. The site is a small Jekyll project hosted by GitHub Pages.

## Preview locally

```sh
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000>.

## Add a post hosted on this site

Create `_posts/YYYY-MM-DD-short-title.md`:

```markdown
---
title: "Post title"
date: YYYY-MM-DD
format: Essay
description: "One sentence shown in the writing index."
---

Post body in Markdown.
```

## Add a link-only X article

Create the same kind of dated file, but add `external_url`. The writing indexes will link the title directly to X instead of opening a local post.

```markdown
---
title: "Article title"
date: YYYY-MM-DD
format: X article
description: "One sentence shown in the writing index."
external_url: "https://x.com/a_ramabadran/status/..."
---
```

The body can be left empty for external-only entries.

## Structure

- `index.md`: homepage biography, timeline, papers, and projects
- `writing.md`: complete writing index
- `_posts/`: native posts and external-link entries
- `_layouts/`: shared page and post layouts
- `assets/css/style.scss`: all site styling
- `assets/js/theme.js`: light/dark theme preference

The previous Academic Pages repository is preserved privately as
`aditya-ramabadran.github.io-archive`.
