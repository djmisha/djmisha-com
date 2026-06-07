# AGENTS.md — djmisha.com Codebase Rules

Rules and conventions for AI agents and contributors working on this Astro static site.

---

## Quick Reference

```bash
npm run dev          # Local dev server (port 4321)
npm run build        # Production build — must pass before any PR
npm run format       # Auto-fix formatting (Prettier)
npm run format:check # CI enforcement — fails if formatting is off
npm test             # Integration tests (Vitest + Cheerio)
```

---

## Project Overview

- **Framework**: Astro 5 (static output mode)
- **Language**: TypeScript
- **Styling**: Scoped `<style>` in components (preferred); legacy global CSS in `public/css/site.css`
- **Site**: https://djmisha.com — DJ portfolio/marketing site
- **Deploy**: GitHub Actions → FTP (push to `main` triggers deploy)

---

## File & Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase `.astro` | `HeroSection.astro` |
| Pages | `kebab-case/index.astro` | `services/wedding-dj-in-san-diego/index.astro` |
| Data files | `kebab-case.ts` or `.json` | `blog-posts.ts`, `reviews.json` |
| Utility/lib | `kebab-case.mjs` | `src/lib/utils.mjs` |
| Scripts | `kebab-case.mjs` | `scripts/build-reviews.mjs` |
| Layouts | PascalCase `.astro` | `PageLayout.astro` |

---

## Component Patterns

### Props typing

Always define props using an exported interface in the frontmatter block:

```astro
---
export interface Props {
  title: string;
  subtitle?: string;
}
const { title, subtitle } = Astro.props;
---
```

For shared/complex prop shapes, import from `src/types.ts`:

```astro
---
import type { PageLayoutProps } from '../types';
export type Props = PageLayoutProps;
const { title, description } = Astro.props;
---
```

### Component structure order

1. Imports
2. Interface/type definition
3. Prop destructuring
4. Computed values / logic
5. Template markup
6. Scoped `<style>` block (at the end)

---

## Data Layer Rules

- **Never hardcode** phone numbers, URLs, social links, or review counts. Import from `src/data/config.ts`.
- Blog posts are defined in `src/data/blog-posts.ts` — add new posts there, not inline.
- Reviews live in `src/data/reviews.json` — the `totalReviews` field drives all review count displays.
- JSON-LD schemas are in `src/data/schema.ts` — all image paths must be absolute URLs.
- Footer descriptions per-page are in `src/data/footer-descriptions.ts`.

---

## Routing Rules

- All pages use directory-based routing: `src/pages/[slug]/index.astro`
- Trailing slashes are enforced (`trailingSlash: 'always'` in `astro.config.mjs`)
- Internal links must always include trailing slash: `/about/` not `/about`
- Canonical URLs must use `https://djmisha.com` prefix (see config `SITE_URL`)

---

## Styling Rules

### New CSS: scoped styles (preferred)

All **new** component and page styles should use Astro's scoped `<style>` blocks:

```astro
<section class="feature-card">
  <h2>{title}</h2>
</section>

<style>
  .feature-card {
    padding: 2rem;
    background: var(--color-surface);
    border-radius: 8px;
  }

  .feature-card h2 {
    color: var(--color-accent);
  }
</style>
```

Scoped style rules:
- Place the `<style>` block at the bottom of the component file
- Use existing CSS custom properties from `site.css`'s `:root` block — do not introduce new color hex values inline
- Keep selectors simple — Astro scoping handles isolation
- If a style genuinely needs to be global (affects multiple unrelated pages), add it to `site.css` with a comment explaining why

### Legacy CSS: `public/css/site.css`

- The existing `site.css` is a legacy file from the HTML5 UP theme migration
- Do NOT add new styles to `site.css` unless they are truly global (e.g., base typography, CSS custom properties, grid utilities)
- Do not modify or remove existing `site.css` rules without testing all pages — many depend on them implicitly
- CSS custom properties (design tokens) remain defined in `site.css`'s `:root` and should be referenced from scoped styles

### General CSS rules

- Do not introduce Tailwind, CSS modules, or CSS-in-JS
- Do not add `!important` to any CSS rule
- The design system uses the HTML5 UP grid classes (`col-4`, `col-12-medium`, etc.) — continue using them for layout
- Run `npm run format` after CSS changes

### Key design tokens

```css
--color-accent: #ff2d8a;       /* primary accent (pink/magenta) */
--font-family: 'Poppins', sans-serif;
```

---

## TypeScript Rules

- Use explicit types for component props (always `export interface Props`)
- Shared types go in `src/types.ts` — do not create additional type files without justification
- Prefer `import type` syntax for type-only imports
- No `any` types — use `unknown` or proper type narrowing

---

## Code Formatting

- Prettier handles all formatting — do not manually adjust whitespace or quotes
- Single quotes, 2-space indentation, no tabs (configured in `.prettierrc`)
- Always run `npm run format` after changes
- CI enforces `npm run format:check` — PRs will fail if formatting is off

---

## JavaScript Rules

- New client-side interactivity should use **vanilla JS** — do not add jQuery dependencies
- Existing jQuery code is legacy (HTML5 UP theme) and should not be extended
- New JS files go in `public/js/` with `defer` attribute when loaded
- Do not introduce React, Vue, Svelte, or other frontend frameworks

---

## Layout Hierarchy

```
BaseLayout.astro          ← root HTML shell (head, scripts, meta)
├── PageLayout.astro      ← standard page with sidebar
├── FullWidthLayout.astro ← no sidebar
├── BlogLayout.astro      ← blog post pages
├── ContactLayout.astro   ← contact page
└── ReviewsLayout.astro   ← reviews page
```

- Homepage (`src/pages/index.astro`) uses `BaseLayout` directly due to unique structure
- All other pages use one of the sub-layouts
- Do not create new layouts without clear justification

---

## SEO Requirements

Every page must include:
- `title` — unique, descriptive page title
- `description` — meta description (under 160 chars)
- `canonicalUrl` — full absolute URL with trailing slash
- `ogTitle`, `ogDescription`, `ogImage` — Open Graph tags
- `jsonLd` — structured data array (at minimum, reference the site-wide schemas from `src/data/schema.ts`)

---

## Adding a New Page

1. Create `src/pages/[slug]/index.astro`
2. Choose the appropriate layout (`PageLayout` for standard, `FullWidthLayout` for no sidebar)
3. Include ALL required SEO props: `title`, `description`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImage`, `jsonLd`
4. Add page to navigation if it should appear in nav (`src/components/Navigation.astro`)
5. Add a footer description in `src/data/footer-descriptions.ts`
6. Verify the page appears in the sitemap (`src/pages/sitemap.xml.ts`)
7. Run full build verification

---

## Adding a New Component

1. Create `src/components/ComponentName.astro` (PascalCase)
2. Define `export interface Props` with all accepted properties
3. Add scoped `<style>` block at the bottom — reference design tokens from `:root`
4. Do not add styles to `site.css` for component-specific visuals
5. Run `npm run build` to verify no type errors

---

## Testing

- Test runner: Vitest (`npm test`)
- Tests live in `tests/` directory
- Integration tests build the site then validate HTML output with Cheerio
- After any structural change, run `npm run build && npm test` to verify
- New features should include test coverage validating the built output
- Reference spec requirement IDs in assertions (e.g., `// Req 1.10`)

---

## Build & Verification

Before considering any change complete:

```bash
npm run build        # Must pass without errors
npm run format       # Auto-fix formatting
npm run format:check # CI will fail if this fails
npm test             # Integration tests must pass
```

---

## Accessibility

- All pages must have a skip-to-content link (handled by `Navigation.astro`)
- Images require `alt` attributes — use descriptive text, not filenames
- Interactive elements must be keyboard accessible
- Color contrast must meet WCAG AA against the dark background
- Form inputs require associated `<label>` elements

---

## Performance

- Use `loading="lazy"` on images below the fold
- Scripts must use `defer` attribute
- Do not add new external font families — Poppins is the only web font
- Do not add large library dependencies without justification
- CSS is cache-busted via content hash (handled automatically by `BaseLayout`)

---

## Dependencies

- Do not add new dependencies without justification
- Prefer vanilla solutions over libraries for simple tasks
- Pin exact versions in `package.json` (no `^` or `~` ranges)
- No frontend frameworks (React, Vue, Svelte, etc.)
- No CSS frameworks (Tailwind, Bootstrap, etc.)

---

## Assets

- Images go in `public/images/` — use kebab-case filenames
- Always include descriptive `alt` text (not the filename)
- New images should be optimized before commit (WebP preferred for photos)
- Reference images with absolute paths in JSON-LD schemas: `https://djmisha.com/images/...`

---

## Secrets & Environment

- Never hardcode API keys, secrets, or credentials in source files
- PHP reCAPTCHA keys are injected by GitHub Actions at deploy time
- The `php/config.php` file is generated during CI — do not commit it
- For local dev, use Docker Compose which provides a mock mail server (MailHog)

---

## Git & Deploy

- Deployment is automatic on push to `main` — treat `main` as production
- Use feature branches for non-trivial changes
- Commit messages should be concise and describe the "why"
- Never commit secrets — PHP reCAPTCHA keys are injected at deploy time via GitHub Secrets
- Run the full build verification before pushing

---

## Things to Avoid

- Hardcoded phone numbers, URLs, or review counts (use `src/data/config.ts`)
- Adding new styles to `public/css/site.css` (use scoped `<style>` in components)
- New jQuery code or jQuery plugin additions
- Creating files in `dist/` (it's a build artifact, gitignored)
- Modifying `archived-theme/` (reference only)
- Adding `!important` to CSS rules
- Introducing new layout files without a clear structural need
- Using relative URLs for canonical/OG meta tags
- Adding dependencies with `^` or `~` version ranges


