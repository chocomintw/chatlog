# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

GTA World roleplay server players and staff. They've just finished (or are documenting) an in-character scene and need to turn a raw, plain-text chatlog paste into a styled screenshot that looks like an authentic in-game GTA World chat box — for forum reports, staff tickets, Discord highlights, or social sharing.

## Product Purpose

Paste raw GTA World chatlog text and get back an accurately colorized, in-game-styled render of it, exportable as a PNG or copied directly to the clipboard as an image. Success is a screenshot indistinguishable in styling from an actual in-game chat capture, without needing to take a real screenshot in-game.

## Positioning

A modern, free, open alternative to Blanco Chatlog Magician. The mechanism a generic "paste text, get pretty image" tool couldn't truthfully copy: a large (45-rule) prioritized regex engine that reproduces GTA World's actual in-game chat color/format conventions line-by-line (radio channels, panic alarms, OOC/PM formatting, admin actions, item/money/drug strings, multilingual speech verbs, embedded `~r~`/`!{#HEX}` color codes), plus character-aware highlighting that dims other characters' dialogue relative to the user's own — matching how the real client renders it, not a generic chat skin.

## Operating Context

Single-page tool: paste chatlog text → live preview renders instantly with authentic colors → adjust font size / background color (or transparent) / character name for highlighting → export via "Copy Image" or "Download PNG". No accounts, no server round-trip; runs entirely client-side as a statically exported site.

## Capabilities and Constraints

- Fully static export (`next.config.ts` → `output: 'export'`); there is no backend and no accounts. Pasted chatlog text and the character-name list never leave the user's browser (chat text lives only in memory; character name/list persist via `localStorage`).
- Export is client-side image generation (`html-to-image` → PNG, `file-saver` for download, Clipboard API for copy).
- Color rules and the in-game color codex are GTA World-specific (real radio/department/alert conventions) and intentionally kept separate from the app's own UI theme tokens — they are content-authentic, not brand chrome.
- Deployed as a static site under a `/chatlog` base path (GitHub Pages-style deployment via `.github/workflows`).

## Brand Commitments

Name: "Chatlog Editor" / "Chatlog Screenshot Editor". Positioned explicitly as a Blanco Chatlog Magician alternative — its rule/color behavior is a deliberate compatibility target, not incidental.

## Evidence on Hand

The bundled sample log (`src/lib/sample-logs.ts`) is a synthetic but representative GTA World chatlog exercising most of the 45 parsing rules; it is demo content, not a real user transcript, and should not be presented as one.

## Product Principles

1. **Authenticity over generality.** When a choice trades "works for any RP server" against "matches GTA World's real client output exactly," authenticity wins.
2. **Nothing leaves the browser.** No feature should require sending chatlog content or character names to a server.
3. **The paste-to-export loop stays fast and frictionless.** No accounts, no save step, no dialogs between paste and export.
4. **Character-aware highlighting is a first-class differentiator**, not a minor toggle — it's what makes a user's own screenshots easy to read at a glance.

## Accessibility & Inclusion

No formal accessibility standard was specified as a product requirement; treat WCAG 2.2 AA as the working bar for the app's own UI chrome (toolbars, forms, controls). The authentic in-game chat text rendering (`.chatlog-line`) is exempt from this bar by design — it deliberately reproduces the real game's non-accessible text-shadow rendering as the product's core value, and should not be "fixed" toward generic accessible styling.
