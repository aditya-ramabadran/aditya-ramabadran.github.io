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

Native posts automatically get a table of contents when they contain at least two section headings. Add `toc: false` to the front matter to hide it for a particular post.

Section headings also get permalink controls that scroll to the section and copy its URL. Hero images and figures open in an in-page expanded view with mouse, touch, or keyboard controls; add `lightbox: false` to disable that behavior for a particular post.

On larger screens, articles with at least two headings also get a compact right-edge outline. It tracks the current section and expands into a clickable section list on hover or keyboard focus; the in-article table of contents remains available at smaller widths.

## Add a link-only X article

Create the same kind of dated file, but add `external_url` and `external_only: true`. The writing indexes will link the title directly to X instead of opening a local post.

```markdown
---
title: "Article title"
date: YYYY-MM-DD
format: X article
description: "One sentence shown in the writing index."
external_url: "https://x.com/a_ramabadran/status/..."
external_only: true
---
```

The body can be left empty for external-only entries.

## Add a post hosted here and on X

Add `external_url` without `external_only`, then write the complete post body. The writing indexes will open the native post, and its page will show a prominent link to the X version.

```markdown
---
title: "Article title"
date: YYYY-MM-DD
format: Article + X
description: "One sentence shown in the writing index."
external_url: "https://x.com/a_ramabadran/status/..."
hero_image: "/assets/images/writing/article-name/hero.jpg"
hero_alt: "Description of the hero image"
math: true
---

Post body in Markdown.
```

`hero_image`, `hero_alt`, and `math` are optional. Set `math: true` when a post uses LaTeX notation.

## Structure

- `index.md`: homepage biography, timeline, papers, and projects
- `writing.md`: complete writing index
- `_posts/`: native, external-only, and hybrid posts
- `_layouts/`: shared page and post layouts
- `assets/css/style.scss`: all site styling
- `assets/js/`: theme preference and article interactions

The previous Academic Pages repository is preserved privately as
`aditya-ramabadran.github.io-archive`.
