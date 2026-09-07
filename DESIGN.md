---
name: Chatlog Editor
description: A quiet dark-mode tool shell that renders authentic GTA World in-game chat colors on export.
colors:
  ui-background: "hsl(240 5% 7%)"
  ui-foreground: "hsl(0 0% 95%)"
  ui-card: "hsl(240 5% 10%)"
  ui-secondary: "hsl(240 4% 15%)"
  ui-muted-foreground: "hsl(240 4% 60%)"
  ui-accent: "hsl(240 4% 18%)"
  ui-destructive: "hsl(0 65% 50%)"
  ui-border: "hsl(240 4% 16%)"
  ui-ring: "hsl(240 4% 80%)"
  ui-primary: "hsl(0 0% 98%)"
  ui-primary-foreground: "hsl(240 5% 10%)"
  chat-default: "#FFFFFF"
  chat-me: "#C2A3DA"
  chat-toyou: "#FF00BC"
  chat-death: "#F00000"
  chat-green: "#56D64B"
  chat-blue: "#3896F3"
  chat-yellow: "#FBF724"
  chat-orange: "#EDA841"
  chat-pm: "#F6EA00"
  chat-ooc-grey: "#A6ACAF"
  chat-lime-green: "#32CD32"
  chat-radio-primary: "#FFEC8B"
  chat-radio-secondary: "#A19558"
  chat-dep: "#CCCA15"
typography:
  ui-heading:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  ui-body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
  ui-label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
  ui-caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.3
  ui-caption-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.3
  chat-line:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.32
    letterSpacing: "0"
rounded:
  sm: "4px"
  md: "6px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "0.875rem"
  md: "1rem"
  lg: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.ui-primary}"
    textColor: "{colors.ui-primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  button-outline:
    backgroundColor: "{colors.ui-background}"
    textColor: "{colors.ui-foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  card:
    backgroundColor: "{colors.ui-card}"
    textColor: "{colors.ui-foreground}"
    rounded: "{rounded.lg}"
  input:
    backgroundColor: "{colors.ui-background}"
    textColor: "{colors.ui-foreground}"
    rounded: "{rounded.md}"
    height: "36px"
---

# Design System: Chatlog Editor

## Overview

**Creative North Star: "The Authentic Terminal"**

The app is deliberately two visual worlds sharing one screen. The tool chrome — cards, toolbars, buttons, sliders — is a quiet, dark-first, near-monochrome utility surface built from a standard shadcn/Radix component set on tight HSL neutrals. It has almost no personality of its own on purpose: its job is to disappear so the second world reads clearly.

The second world is the chat canvas itself: bold, saturated, high-contrast text reproducing GTA World's actual in-game chat colors and rendering quirks (heavy weight, hard-edged black outline instead of anti-aliasing, no theme awareness at all). This is the product's real payload, and it is intentionally exempt from the app's own design-token discipline — it must match the game client, not the app shell.

Density is high but organized: every content panel is built from the same three-band pattern (a muted toolbar strip, a content area, a muted footer strip), so the eye learns the rhythm once and reuses it across the Preview and Input panels.

**Key Characteristics:**
- Dark-mode-first neutral shell (near-black background, near-white text) with light mode as a fully supported but secondary variant.
- Two independent color systems: app chrome tokens (HSL, theme-aware) vs. the in-game chat palette (fixed hex, theme-agnostic).
- Three-band card composition (toolbar / content / footer) repeated across every panel.
- Minimal elevation — borders and muted-background strips do the separating work, not shadows.

## Colors

The chrome palette is a tight, near-monochrome dark neutral scale (light mode is the same structure inverted, not a separate design). The chat palette is a fixed, real-world-sourced set of ~30 hex colors matching GTA World's actual client output; it never changes with theme.

### Primary
- **Bright Primary** (`hsl(0 0% 98%)` dark / `hsl(240 6% 10%)` light): the single high-contrast action color, used for the primary "Download PNG" button and focus rings. Inverts with theme rather than having its own hue.

### Neutral (app chrome)
- **Terminal Black** (`hsl(240 5% 7%)`): app background, dark mode.
- **Paper White** (`hsl(0 0% 98%)`): app background, light mode.
- **Panel** (`hsl(240 5% 10%)` dark / `hsl(0 0% 100%)` light): card/panel surface — the `ui-card` role behind Preview and Input.
- **Strip** (`hsl(240 4% 15%)` dark / `hsl(240 5% 94%)` light): the `ui-secondary`/`ui-muted` toolbar and footer band background, always at partial opacity (`/20`–`/40`) over the panel.
- **Quiet Text** (`hsl(240 4% 60%)` dark / `hsl(240 4% 45%)` light): the `ui-muted-foreground` role for secondary labels, counts, and hints.
- **Hairline** (`hsl(240 4% 16%)` dark / `hsl(240 5% 88%)` light): the `ui-border` role separating toolbar/content/footer bands.
- **Alert** (`hsl(0 65% 50%)` dark / `hsl(0 75% 55%)` light): destructive-only, used sparingly (clear/delete affordances on hover).

### In-Game Chat Palette (content-authentic, not brand)
- **Default White** (`#FFFFFF`): standard shouted/normal-volume speech, the chat baseline.
- **Me/Action Lilac** (`#C2A3DA`): `*action*`/`/me` lines.
- **Directed-At-You Magenta** (`#FF00BC`): the `[!]` prefix marking a line addressed to the viewer's character.
- **Damage Red** (`#F00000`): death, gunshot damage, robbery, failed attempts.
- **Success Green** (`#56D64B`): successful attempts, unlocks, weather.
- **Info Blue** (`#3896F3`): `[INFO]`, police MDC, panic alarms, character-kill tag.
- **Call/SMS Yellow** (`#FBF724`): incoming calls, phone prompts, megaphone.
- **Warning Orange** (`#EDA841`): whispers, item-placed/SMS-sent notices.
- **Private Message Yellow** (`#F6EA00`): `(( PM to/from ... ))` — distinct from call yellow by role, not just hue.
- **OOC Grey** (`#A6ACAF`): local out-of-character brackets.
- **Item Lime** (`#32CD32`): local OOC speaker name, item/refuel actions.
- **Radio Gold (own channel)** (`#FFEC8B`) vs. **Radio Bronze (other channel)** (`#A19558`): the character-aware radio-channel split.
- **Department Olive** (`#CCCA15`): inter-department radio (`[LSPD -> LSSD]`).

### Named Rules
**The Two-Palette Rule.** Chrome colors and chat colors never cross. Chrome always resolves through the HSL custom properties in `globals.css`; chat text always resolves through the fixed hex values in `chat-colors.ts`. Neither system should ever reference the other's tokens.

## Typography

**Body Font:** Inter (with `system-ui, sans-serif` fallback), loaded via `next/font/google` with stylistic sets `cv02 cv03 cv04 cv11` enabled globally.

**Character:** Inter is used two ways in the same app — as a restrained, small-size UI face (12–18px, weights 400–600) for chrome, and as the heavy, outlined face for chat text. The pairing reads as "one typeface, two jobs" rather than a display/body contrast.

### Hierarchy
- **Heading** (600, 1.125rem/18px, 1.2 line-height, -0.01em tracking): the single `<h1>` app title.
- **Body** (400, 0.875rem/14px, 1.4 line-height): default chrome text.
- **Label** (500, 0.75rem/12px): toolbar labels, section headers within popovers.
- **Caption** (400, 10–11px): footer stats, detected-rule badges, popover hints — the smallest, densest text in the app; used only for secondary/tertiary metadata, never for a control's primary label.
- **Chat Line** (700, user-adjustable 11–32px via the font-size slider, default 15px, 1.32 line-height, 0 letter-spacing): the signature component. Renders with `-webkit-font-smoothing: none` and a 4-direction 1px black `text-shadow` outline instead of anti-aliasing — a deliberate, exact reproduction of the in-game font rendering, not a stylistic choice available to other text in the app.

### Named Rules
**The Outline-Not-Shadow Rule.** `.chatlog-line`'s `text-shadow` is a hard 1px outline in four cardinal directions, not a soft drop shadow. It exists to keep light-colored chat text legible over any background color the user picks, mimicking the game's own rendering — never soften it into a blur.

## Layout

Single-column, centered container (`max-w-4xl`, `px-4`, `py-8`) holding exactly two stacked panels (`space-y-4`): the live Preview above the raw-text Input, mirroring the "see result, then edit source" order.

Each panel is a `rounded-xl border shadow-sm` card divided into up to three horizontal bands:
1. **Toolbar strip** — `bg-muted/40`, `px-3.5 py-2.5`, `border-b border-border/70`, contents laid out `flex flex-wrap items-center justify-between gap-3` so controls reflow onto a second line on narrow viewports rather than overflowing.
2. **Content area** — the canvas or textarea, `p-3.5`–`p-4`.
3. **Footer strip** — `bg-muted/20`–`/30`, `px-3.5 py-1.5`–`py-2.5`, `border-t border-border/70`, holding stats and secondary actions at `text-[11px]`.

The preview canvas itself scrolls horizontally (`overflow-x-auto`) rather than wrapping the page, so an unusually wide rendered line never breaks the outer layout. When "Transparent" is active, the canvas shows a neutral grey `repeating-conic-gradient` checkerboard (`rgba(128,128,128,0.18/0.28)`) as a transparency indicator — this is a functional utility pattern, not a palette color, and is exempt from the token system for that reason.

Responsive behavior is reflow-based, not breakpoint-heavy: `flex-wrap` on every toolbar row plus a handful of `sm:` width bumps (e.g. the character-name input, the font-size slider) are the only adaptations — there is no distinct mobile layout, only a narrower version of the same one.

## Elevation & Depth

Flat by design. The only shadow in the system is `shadow-sm` on the two main panel cards; everything else — toolbar/footer strips, dividers between bands — is conveyed with a `bg-muted/NN` opacity wash and a 1px `border-border/70` hairline, not elevation. Radix overlays (Popover, Tooltip) are the exception and carry real `shadow-md`/default shadows because they float above the flat page.

### Shadow Vocabulary
- **Panel** (`shadow-sm`): the two main cards only.
- **Overlay** (Radix default): Popover and Tooltip content, which sit outside the page's flat z-plane.

### Named Rules
**The Band-Not-Box Rule.** Structure within a panel is shown by alternating background wash and hairline borders between horizontal bands, never by nesting additional bordered/shadowed boxes inside a card.

## Shapes

- **Panels**: `rounded-xl` (12px) — the largest radius in the system, reserved for the two top-level cards.
- **Controls** (buttons, inputs, popovers): `rounded-md` (6px), with `rounded` (4px, `sm`) not currently used but defined in the token scale.
- **Swatches & toggles**: `rounded-full` — used exclusively for the background-color preset swatches and the custom-color input, making "circle = a color you can pick" a consistent affordance.
- The chat text itself has no shape language — it's plain inline text, unboxed.

## Components

### Buttons
- **Shape:** `rounded-md` (6px), 5 variants via CVA (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`).
- **Primary:** inverted-neutral fill (`ui-primary`/`ui-primary-foreground`) — reserved for the single highest-intent action per view (Download PNG).
- **Ghost/Outline:** the default for toolbar actions (Copy Image, Clear, Sample Log, all icon buttons) — chrome stays quiet until hovered.
- **Icon buttons:** consistently paired with `aria-label` even though most also carry a Tooltip.
- **Sizing:** toolbar icon buttons run small (28–32px) — see Do's and Don'ts.

### Inputs
- **Style:** `rounded-md`, `border-input`, transparent background, `focus-visible:ring-1 ring-ring`.
- **Icon-adornment pattern:** the character-name field (`CharacterHighlight`) embeds a leading icon and trailing action buttons inside the input's padding — the only input in the app that does this, reserved for the character-identity field specifically.
- **Textarea variant:** the chatlog textarea drops its own border/radius (`border-0 rounded-none`) to sit flush inside its panel's content band instead of looking like a boxed field.

### Popover / Tooltip
- **Popover:** used once, for the saved-characters list — `w-72` (though the trigger content is narrower, `w-56` in practice), standard Radix slide/fade/zoom transition.
- **Tooltip:** dark-filled (`bg-primary`/`text-primary-foreground`), used liberally on every icon-only control to supply the accessible name a sighted user can also read.

### Chatlog Line (signature component)
The product's core visual unit. A single parsed line renders as one or more `<span>`s colored per the matched rule (45 rules, checked in priority order), always inside a `.chatlog-line` wrapper carrying the bold/outlined/no-antialiasing treatment described in Typography. Multi-color rules (radio tags, transaction amounts, embedded `~r~`/`!{#HEX}` codes) split a single line into several spans rather than picking one dominant color — this per-token coloring, not per-line, is what makes the output pass as authentic.

## Do's and Don'ts

### Do:
- **Do** keep chat-line colors resolving only through `chat-colors.ts`, regardless of the active app theme.
- **Do** build any new panel from the toolbar/content/footer three-band pattern already used by Preview and Input.
- **Do** pair every icon-only control with both an `aria-label` and a Tooltip.
- **Do** use `rounded-full` exclusively for color-swatch/selector affordances, never for general buttons.

### Don't:
- **Don't** apply `/70`–`/80` opacity modifiers to `text-muted-foreground` for body copy — it drops contrast below WCAG AA, worst in light mode (see `/impeccable audit`).
- **Don't** size interactive controls below 24×24px, and treat 44×44px as the real target on touch — the current 20–32px toolbar icon buttons are a known gap, not the intended standard.
- **Don't** introduce hardcoded Tailwind palette colors (e.g. `amber-500`, `emerald-600`) outside small inline icon accents; route new UI color through the HSL token set.
- **Don't** let the chat canvas inherit theme-aware styling — its whole purpose is to look identical regardless of light/dark mode.
