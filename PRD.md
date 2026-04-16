# Seneca Daily — PRD

**Author:** Karim
**Date:** April 16, 2026
**Status:** Draft v1

---

## 1. Overview

Seneca Daily is a mobile-first Progressive Web App for reading Seneca's *Moral Letters to Lucilius* one letter at a time. The app is a personal reading tool: no accounts, no backend, no social features. All 124 letters are bundled with the app. Users navigate forward and backward through the letters, highlight passages, and export those highlights as markdown to paste into their own note-taking system (e.g. Notion).

## 2. Goals

- Provide a distraction-free daily reading experience for Seneca's letters.
- Let the reader capture meaningful passages without friction.
- Own zero infrastructure beyond a static host (GitHub Pages).
- Work offline after first load.

## 3. Non-Goals

- No scheduled notifications or daily reminders.
- No user accounts, sync, or cross-device state.
- No cloud backend. No database. No serverless functions.
- No direct Notion API integration. Export is manual (copy/paste markdown).
- No social or sharing features.
- No in-app commentary, annotations beyond highlights, or discussion.

## 4. Target User

One user: Karim. Reads on iPhone (iOS Safari), wants something calm, serif, and stoic-feeling. Will occasionally migrate highlights to Notion manually. The app targets iPhone only — no need to optimize for Android or desktop browsers.

## 5. Content

- **Source:** Wikisource, *Moral letters to Lucilius* (Richard Mott Gummere translation, public domain).
- **Scope:** All 124 letters.
- **Scrape process:** One-time scrape during build. Each letter fetched from `https://en.wikisource.org/wiki/Moral_letters_to_Lucilius/Letter_N` for N = 1..124. Parse HTML, extract title and body text, strip footnotes, navigation, and Wikisource chrome. Output to a single `letters.json` file bundled with the app.
- **Letter shape:**
  ```json
  {
    "number": 3,
    "title": "On True and False Friendship",
    "paragraphs": [
      "You have sent a letter to me through the hand of a 'friend' of yours, as you call him...",
      "Second paragraph text...",
      "Third paragraph text..."
    ]
  }
  ```
  Body text is stored as an array of paragraphs (one string per paragraph) to preserve the original structure for rendering and for sentence-level highlight targeting.
- **No live fetching at runtime.** Content is static and shipped with the app.

## 6. Core Features

### 6.1 Reading View

- Displays one letter at a time.
- Header: letter number (Roman numeral, e.g. "Letter III") and letter title.
- Body: full letter text, readable serif typography, generous line height and margin.
- Footer / controls: forward arrow, back arrow, "Mark as read" toggle.
- **No progress bar or completion counter.** The goal is learning, not burning through the collection. Progress is visible only in the Letter Index (section 6.2), where read/unread state is shown per letter.
- On first launch, opens to Letter I.
- On subsequent launches, opens to the last letter the user was viewing.
- **Scroll position persistence:** the app saves scroll position (as a percentage) per letter. Returning to a letter — whether via navigation or reopening the app — restores the scroll position so the reader picks up exactly where they left off.

### 6.2 Navigation

- Forward / back arrows move one letter at a time.
- Wraps disabled: no wrap at letter 124 or before letter 1 (arrows become disabled at the ends).
- Letter index / jump-to-letter screen: scrollable list of all 124 letters showing number, title, and a read/unread indicator.

### 6.3 Highlighting

- **Two complementary mechanisms:**
  1. **Tap-to-highlight (primary):** Tapping a sentence highlights and saves it immediately. Simple, reliable, no selection handles to wrestle with on iOS Safari. Tapping a highlighted sentence again un-highlights it (deletes the highlight).
  2. **Long-press selection (secondary):** Native iOS text selection (long-press, drag handles) for highlighting partial sentences or multi-sentence spans. A floating "Save highlight" button appears above the selection.
- Saved highlights are visually indicated in the reading view (subtle background tint) so the reader can see what they've already captured when revisiting a letter.
- Each highlight is saved to IndexedDB, tagged with:
  - Letter number
  - Letter title
  - Timestamp (date)
  - The highlighted text
  - Paragraph index and character offsets (for rendering highlights in-place)

### 6.4 Highlights View

- Separate screen accessible from main navigation.
- Lists all saved highlights, grouped by letter, most recent letter first.
- Each highlight row shows: quote text, date highlighted.
- Actions per highlight: copy single quote to clipboard, delete.
- Bulk actions: "Copy all as markdown", "Export as .md file" (triggers a download).
- Empty state: friendly message if no highlights exist yet.

### 6.5 Markdown Export Format

```markdown
## Letter III — On True and False Friendship
*Highlighted April 16, 2026*

> The quote you highlighted goes here.

> Another quote from the same letter.

## Letter VII — On Crowds
*Highlighted April 17, 2026*

> Associate with those who will make a better man of you.
```

- `>` blockquote syntax chosen so Notion renders each as a styled quote block on paste.
- Letters grouped together; within a letter, quotes in chronological highlight order.

### 6.6 Settings

- **Font size:** S / M / L toggle. Persists across sessions.
- **Theme:** Light / Dark toggle. Persists across sessions.
- **Reset progress:** button to clear read status and current-letter pointer. Confirmation prompt. Does not delete highlights.
- **Clear highlights:** button to delete all highlights. Confirmation prompt.

## 7. Design / Aesthetic

- **Vibe:** stoic, minimal, calm. Feels like a piece of paper, not an app.
- **Light mode:** cream / parchment background (`#f4efe6` territory), warm dark text.
- **Dark mode:** warm off-black background, cream text.
- **Typography:** serif body (e.g. EB Garamond, Cormorant, or similar public-domain-adjacent serif). Sans-serif for UI chrome only if needed.
- **Whitespace:** generous. No dense UI.
- **Iconography:** minimal. Thin line icons where needed.
- **No imagery, no decorative elements, no color accents beyond a single subtle hue for the "mark as read" indicator.**

## 8. Technical Architecture

- **Framework:** React + Tailwind, single-page app.
- **Build target:** static files (HTML, JS, CSS, `letters.json`, manifest, service worker).
- **Storage:** IndexedDB for highlights, localStorage for settings and current-letter pointer.
- **Offline:** service worker caches all assets and `letters.json` on first load. App fully usable offline after.
- **PWA manifest:** installable to home screen, standalone display mode, custom icon and splash.
- **No dependencies on runtime network** after first load.

## 9. Hosting & Deployment

- **Host:** GitHub Pages.
- **Repo structure:** simple static site in the root of a public (or private with Pages enabled) repo.
- **Domain:** `username.github.io/seneca-daily` or similar. Custom domain optional.
- **HTTPS:** provided by GitHub Pages (required for PWA install and service worker).
- **Deploy:** commit to `main`, GitHub Pages serves the build output.

## 10. Data Loss & Recovery

- Highlights live only on-device. If the device is lost or browser data is cleared, highlights are lost.
- User has accepted this tradeoff. Mitigation is the user's own responsibility: manually copy highlights to Notion periodically via the export feature.
- Progress loss is also acceptable: user can re-open, tap through to whichever letter they were on, and continue. Highlights already exported to Notion serve as a rough bookmark.

## 11. Build Plan

1. **Scrape letters.** Write a Python script that fetches all 124 letters from Wikisource, parses HTML, cleans the text, and outputs `letters.json` with paragraph-level structure.
2. **Validate scraped content.** Automated checks: all 124 letters present, no empty paragraphs, no residual HTML tags, no Wikisource navigation artifacts, every letter has a title and at least one paragraph. Fail the build if validation fails.
3. **Build reading view + navigation.** React + Tailwind. Get the core reading loop working first: display a letter, navigate forward/back, letter index, scroll position persistence.
4. **Add highlighting + highlights view.** Tap-to-highlight, long-press selection, highlights view with export.
5. **Settings + PWA + service worker.** Font size, theme, reset/clear actions, offline caching, installable manifest.
6. **Design pass.** Typography, spacing, dark/light themes, font loading, icon.
7. **QA on device.** Install as PWA on iPhone. Test highlighting UX, offline behavior, scroll persistence, export.
8. **Deploy to GitHub Pages.** Create repo, push build, enable Pages, confirm HTTPS and PWA install flow.

## 12. Out of Scope (Future Ideas)

- Sync to Notion via a Cloudflare Worker proxy.
- Scheduled notifications / daily reminders.
- Search across all letters.
- Reading streaks / stats.
- Alternative translations.
- Cross-device sync via the user's VPS.

## 13. Open Questions

- Which specific serif font to use — decide during design pass.
- Whether to display letter numbers as Roman or Arabic numerals in the UI (currently: Roman in headers).
