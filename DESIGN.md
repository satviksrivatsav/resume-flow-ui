---
name: "Resume Flow"
description: "Design tokens and intent for Resume Flow UI — self-contained, mode-aware tokens and guidance."
tokens:
  color:
    modes:
      light:
        background:
          value: "hsl(40 30% 95%)"
          description: "Soft warm-cream page background"
        foreground:
          value: "hsl(220 25% 18%)"
          description: "High-contrast slate text"
        card:
          value: "hsl(40 20% 98%)"
          foreground: "hsl(220 25% 18%)"
        popover:
          value: "hsl(40 20% 98%)"
          foreground: "hsl(220 25% 18%)"
        primary:
          value: "hsl(221 83% 53%)"
          foreground: "hsl(0 0% 100%)"
        secondary:
          value: "hsl(40 20% 90%)"
          foreground: "hsl(220 25% 18%)"
        muted:
          value: "hsl(40 15% 88%)"
          foreground: "hsl(220 15% 40%)"
        accent:
          value: "hsl(40 20% 90%)"
          foreground: "hsl(220 25% 18%)"
        destructive:
          value: "hsl(0 70% 55%)"
          foreground: "hsl(0 0% 100%)"
        border:
          value: "hsl(40 15% 82%)"
        input:
          value: "hsl(40 15% 85%)"
        ring:
          value: "hsl(221 83% 53%)"
        sidebar:
          background: "hsl(40 25% 94%)"
          foreground: "hsl(220 25% 18%)"
          primary: "hsl(221 83% 53%)"
          primary-foreground: "hsl(0 0% 100%)"
          accent: "hsl(40 20% 90%)"
          accent-foreground: "hsl(220 25% 18%)"
          border: "hsl(40 15% 82%)"
          ring: "hsl(221 83% 53%)"
      dark:
        background:
          value: "hsl(240 10% 4%)"
          description: "Near-black canvas for dark mode"
        foreground:
          value: "hsl(0 0% 98%)"
        card:
          value: "hsl(240 10% 8%)"
          foreground: "hsl(0 0% 98%)"
        popover:
          value: "hsl(240 10% 8%)"
          foreground: "hsl(0 0% 98%)"
        primary:
          value: "hsl(221 83% 53%)"
          foreground: "hsl(0 0% 100%)"
        secondary:
          value: "hsl(240 10% 15%)"
          foreground: "hsl(0 0% 98%)"
        muted:
          value: "hsl(240 10% 15%)"
          foreground: "hsl(240 5% 65%)"
        accent:
          value: "hsl(240 10% 15%)"
          foreground: "hsl(0 0% 98%)"
        destructive:
          value: "hsl(0 62% 30%)"
          foreground: "hsl(0 0% 98%)"
        border:
          value: "hsl(240 10% 20%)"
        input:
          value: "hsl(240 10% 20%)"
        ring:
          value: "hsl(221 83% 53%)"
        sidebar:
          background: "hsl(240 10% 8%)"
          foreground: "hsl(0 0% 98%)"
          primary: "hsl(0 0% 98%)"
          primary-foreground: "hsl(240 10% 8%)"
          accent: "hsl(240 10% 15%)"
          accent-foreground: "hsl(0 0% 98%)"
          border: "hsl(240 10% 20%)"
          ring: "hsl(221 83% 53%)"
  gradient:
    start: { value: "hsl(40 30% 95%)" }
    mid: { value: "hsl(262 70% 60%)" }
    end: { value: "hsl(200 80% 55%)" }
    accent: { value: "hsl(145 70% 45%)" }
  glass:
    bg: { value: "hsl(40 25% 98% / 0.85)" }
    border: { value: "hsl(40 15% 65% / 0.25)" }
  shadow:
    colorful: { value: "hsla(220,25%,18%,0.1)" }
    elevation-1: { value: "0 1px 2px hsla(220,25%,18%,0.04)" }
    elevation-2: { value: "0 6px 18px hsla(220,25%,18%,0.06)" }
    elevation-3: { value: "0 20px 40px hsla(220,25%,18%,0.08)" }
  radii:
    base: { value: "0.5rem" }
    md: { value: "0.375rem" }
    sm: { value: "0.25rem" }
  motion:
    easing:
      standard: { value: "cubic-bezier(0.4, 0, 0.2, 1)" }
    duration:
      short: { value: "300ms" }
      long: { value: "400ms" }
    accordion:
      duration: { value: "200ms" }
      easing: { value: "ease-out" }
  typography:
    font-family:
      body: { value: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }
    scale:
      body: { value: "16px", lineHeight: "1.5" }
      small: { value: "14px", lineHeight: "1.4" }
      h1: { value: "32px", weight: 700, lineHeight: "1.2" }
      h2: { value: "24px", weight: 700, lineHeight: "1.25" }
      h3: { value: "20px", weight: 600, lineHeight: "1.3" }
  spacing:
    xs: { value: "0.25rem" }
    sm: { value: "0.5rem" }
    md: { value: "1rem" }
    lg: { value: "1.5rem" }
    xl: { value: "2rem" }
    container-padding: { value: "2rem" }
  accessibility:
    focus-ring: { value: "hsl(221 83% 53%)" }
---

## Look & feel

Resume Flow presents a warm, approachable writing and editing environment that balances professional clarity with human-friendly warmth. The overall palette leans toward warm cream backgrounds in light mode, contrasted with a clear, muted slate for text and microcopy. The accent color is a saturated blue used for primary actions and interactive highlights; destructive actions use a vivid red for clear affordance.

- Visual tone: soft, low-contrast surfaces (cards, popovers) sitting on a warm-cream canvas to reduce eye fatigue during long editing sessions.
- Accent behavior: primary blue is bright and reserved for CTAs, emphasis, and active states. Muted greys/creams are for preview backgrounds, subtle dividers, and low-priority UI.
- Motion: transitions are gentle and economical — purposefully short for small controls (300ms) and slightly longer for canvas/background changes (400ms) to produce a smooth, pleasant theme shift.
- Elevation: depth is subtle; use low, warm shadows for floating cards and stronger, softer shadows for large overlays.
- Glass: a light glass utility exists for translucent panels; use sparingly for header bars, preview overlays, or optional decorative layers.

## Tokens intent and usage

- Colors
  - Use `color.modes.light.background` as the base page background. Reserve `card` and `popover` for elevated surfaces. `muted` is intended for subtle preview areas and non-interactive surfaces.
  - `primary` should be used for main CTAs, active navigation, and interactive highlights. The `primary.foreground` token is the intended text/icon color for primary-filled controls.
  - `destructive` is the single token for destructive actions and confirmations.

- Typography
  - The system font stack uses `Inter` as the primary UI face, with a neutral scale optimized for legibility at 16px body copy. Headings rise in scale and weight to clearly separate sections in the resume builder.

- Spacing & Layout
  - Use the spacing scale for consistent rhythm. `container-padding` mirrors the layout container's 2rem padding used across the site.

- Radii & Form
  - Components use a base radius of 0.5rem for approachable rounded corners; small controls may use `sm` to maintain compactness.

- Motion & Accessibility
  - Respect reduced-motion preferences: when `prefers-reduced-motion` is enabled, reduce or eliminate non-essential transitions. Keep focus outlines suppressed visually but provide a clear `focus-ring` for keyboard navigation using the `ring` token color.

## Practical examples

- Buttons
  - Primary (filled): background = `primary.value`, color = `primary.foreground`, border-radius = `radii.base`, shadow = `shadow.elevation-1` on hover.
  - Secondary (ghost/outline): border-color = `border.value`, background = transparent, text = `secondary.foreground`.

- Cards & Panels
  - Surface background = `card.value`, text = `card.foreground`, border = `border.value`, box-shadow = `shadow.elevation-2` for modal-like prominence.

- Forms & Inputs
  - Input background = `input.value`, border = `border.value`. Focus state uses `accessibility.focus-ring` with `motion.duration.short` easing.

## Dark mode guidance

Switching to dark mode inverts the canvas to `color.modes.dark.background` and promotes light foreground text. Maintain the same spacing, radii, and motion tokens; prefer darker variants of `muted` for subdued areas. The `primary` accent remains unchanged between modes to retain brand recognition.

## Implementation notes

- Tokens are intentionally named semantically (primary, muted, card) to keep implementation flexible and to allow swapping raw values without changing component logic.
- Keep glass, gradient, and utility classes reserved for high-impact visuals (hero headers, onboarding screens). Avoid heavy use of gradients in dense editing interfaces.
- Print styles: avoid non-essential backgrounds for printed resumes; maintain high contrast text color and exact color printing where required.

## When to deviate

- If a UI pattern requires stronger contrast for accessibility (WCAG), prefer increasing foreground lightness/darkness rather than changing the base palette.
- Use the `destructive` token only for actions that permanently remove or overwrite user content.

## Glossary

- Card: elevated readable surface used for grouped content.
- Popover: transient surface for menus, tooltips, and in-context editors.
- Glass: translucent pane with blur and subtle border.

---

This file is intentionally self-contained: the tokens above are the canonical reference for colors, spacing, motion, radii, shadows and typography used across Resume Flow's UI.
