# dotmind blog

Personal blog built with [Hugo](https://gohugo.io/) using the [Anubis2](https://github.com/Junyi-99/hugo-theme-anubis2) theme. Generates fully static HTML from Markdown in milliseconds and deploys on Vercel.

Live at [dotmindblog.vercel.app](https://dotmindblog.vercel.app)

---

## What's here

Content focused on AI engineering, agentic systems, and developer tools. Posts are written in both Portuguese (PT-BR) and English so AI crawlers and search engines index technical terms in both languages (skills, mcp, agentic engineering, engenharia agentica, etc).

The blog itself also serves as an experiment to observe AI crawler behavior. There's a data dashboard icon at the bottom of the site for monitoring access stats in real time.

---

## Stack

- **Hugo** — static site generator, builds the entire site in ~300ms
- **Anubis2** — minimal theme with light/dark mode
- **Vercel** — deploy with CDN and Web Analytics
- **Umami** — privacy-friendly analytics (share dashboard linked in footer)
- **Giscus** — GitHub Discussions-based comments

---

## Structure

```
content/        # Posts in Markdown (en + pt per file)
layouts/        # Custom partials and overrides
static/images/  # Post images
assets/         # SCSS and JS
i18n/           # Translation strings
hugo.toml       # Site configuration
```

---

## Running locally

```bash
hugo server -D
```

Requires Hugo extended edition. See [hugo.io/installation](https://gohugo.io/installation/).

---

## Notable post

[Agentic Engineering: Skills Stack, MCP, and Project Context](https://dotmindblog.vercel.app/posts/2026/ai/agentic-engineering-guide/) — a practical guide on structuring AI agents with Skills, MCP, and the Plan → Execute → Verify loop.
