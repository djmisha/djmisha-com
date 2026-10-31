Plan: Instagram stories showcase component
Handoff brief for an AI coding agent. Build one new, self-contained website component that showcases three Instagram story posts and links out to each.
Goal
A section titled “See DJ Misha in action” with the subheadline “Peak hour moments”, followed by three cards. Each card shows an Instagram thumbnail and a short caption preview. Clicking a card opens that exact Instagram post in a new tab.
Hard constraints
• Self-contained. The component owns its markup, styles, and data. It must not depend on, import from, or modify any existing component, stylesheet, or config beyond reading shared tokens.
• Do not touch existing code. Only add new files. Do not edit pages, layouts, routes, global CSS, config, package files, or lockfiles. Do not mount the component on any page; the owner will do that. Finish with a short usage snippet showing how to mount it.
• Follow the repo’s established patterns. Match file location, naming, framework idioms, styling approach, and code style of comparable existing section components. Do not introduce new dependencies.
• Match the existing site style. Use the colors, fonts, spacing, and tokens the site already defines. No rounded borders or rounded corners anywhere, including cards, images, buttons, and focus outlines. Set radius to zero explicitly if any inherited style would round them.
• Placeholders for now. The owner will add real images, captions, and post links manually, so make that a one-place edit.
• No Instagram scraping or API calls. Everything is static data.
Step 1: Learn the repo before writing code
Inspect, and do not assume:
• Framework, language, and build tooling.
• Where section-level components live and how they are named and exported.
• How styling is done (CSS modules, utility classes, styled components, plain CSS) and where design tokens for color, type, and spacing are defined.
• Which existing component is closest in shape (a titled section containing a grid of cards) and use it as the pattern to follow.
• The site’s breakpoint convention, heading levels, link and focus styles, and lint, format, and test setup.
• How images are stored and referenced (public folder, imports, an image component).
Briefly record what you found in your final summary so the owner can check your assumptions.
Step 2: Build the component
Content
• Headline: “See DJ Misha in action”
• Subheadline: “Peak hour moments”
• Use the heading level that fits the pages this will sit on; confirm from existing sections.
Layout
• Desktop: three cards across in one row, each with a tall, vertical (story-style, about 9:16) thumbnail.
• Mobile: cards stacked in a single column. A shorter thumbnail ratio such as 4:5 is acceptable if 9:16 is too tall on small screens.
• Use the site’s existing breakpoint for the switch; if none exists, use about 768px.
• Each card, top to bottom: thumbnail, the handle “@djmishasd”, caption preview.
Behavior
• The whole card is a single link to that story’s Instagram URL, with target="\_blank" and rel="noopener noreferrer".
• Do not nest other links or buttons inside the card. “more” at the end of a truncated caption is plain text, not a separate link.
• Hover and focus states should reuse the site’s existing link and focus styling. Keep any motion subtle and respect reduced-motion preferences.
Caption preview
• Collapse whitespace, then cut at 125 characters (approximately where Instagram clips captions in the feed) and append “… more” when cut. Captions at or under the limit show in full.
• Put the limit in a named constant so it is easy to tune.
• Render caption text as plain text, never as HTML.
Data and placeholders
• Keep the three stories in one array at the top of the component file, each with url, image, and caption.
• Placeholder url: the profile link https://www.instagram.com/djmishasd/, with a clear comment to replace it with the specific post link (/p/... or /reel/...).
• Placeholder image: leave empty and render a neutral placeholder block built from the site’s existing colors. Place the images in the repo’s normal asset location and note the path in the code comment. If an image path is set but fails to load, fall back to the placeholder.
• Placeholder captions: use clearly labeled dummy text, with one over the limit, one under, and one well over, so truncation is visible.
Accessibility
• Semantic list of three items inside a labeled section.
• Meaningful alt text on images, and an accessible name on each link that says it opens Instagram in a new tab.
• Visible keyboard focus, and sufficient color contrast using existing tokens.
Code comments
• At the top of the component file, state that this is a standalone, self-contained component, and explain how to swap in real assets and links.
Step 3: Style rules
• Take every color, font family, font size, weight, spacing value, and border from the site’s existing tokens or styles. Do not hard-code new hex values or add new fonts if equivalents exist.
• Scope styles to the component so nothing leaks in or out, using the repo’s own scoping approach.
• Square corners everywhere. Borders, if used, follow the site’s existing border treatment.
• The earlier prototype (dj-misha-stories.html, if the owner provides it) is a reference for layout and behavior only. Do not copy its colors, fonts, or its rounded corners.
Edge cases
• Empty caption: render the card without the caption paragraph.
• Very long unbroken words or URLs in captions must wrap and not overflow the card.
• If the data array has fewer or more than three items, the layout should still behave sensibly.
• Missing or broken image: show the placeholder.
Out of scope
Fetching data from Instagram, carousels, lightboxes, video playback, analytics, a follow button, and editing any existing page.
Acceptance checklist
[ ] Only new files were added; the diff shows no modified or deleted existing files.
[ ] File location, naming, and style match comparable existing components.
[ ] The headline and subheadline match the copy above.
[ ] Three cards across on desktop and one column on mobile.
[ ] Each card opens its Instagram URL in a new tab with safe rel attributes.
[ ] Caption preview truncates at the named limit and shows “… more” only when cut.
[ ] No border radius anywhere, and no new colors or fonts.
[ ] Placeholders are easy to replace in one array, and the fallback works.
[ ] Lint, type check, and build (whichever the repo uses) pass.
[ ] Checked visually at mobile, tablet, and desktop widths.
Final summary to return
List the files created, the patterns you followed and from which existing components, any assumptions, the usage snippet for mounting the component, and the exact places the owner must edit to add real images, captions, and post links.
