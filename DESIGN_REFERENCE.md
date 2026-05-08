# OdontoEhTec Design Reference Guide

## Color Palette

### Primary Colors (Surgical Green)

```
--oet-primary-900: #06262B   (Darkest - text on light)
--oet-primary-800: #0A2F36   (Very dark - surface-ink background)
--oet-primary-700: #0E4F4A   ★ BRAND PRIMARY (buttons, headers, sidebar)
--oet-primary-600: #14655F   (Hover state)
--oet-primary-500: #1F8478   (Accents on dark backgrounds)
--oet-primary-300: #7DB7AE   (Light tints)
--oet-primary-100: #D7E8E5   (Very light - selection backgrounds)
```

### Accent Colors (Warm Amber)

```
--oet-accent-700: #B47D3E   (Darkest - hover)
--oet-accent-600: #C8914B   (Secondary hover)
--oet-accent-500: #D9A86C   ★ BRAND ACCENT (CTAs, badges, highlights)
--oet-accent-300: #ECCFA5   (Light)
--oet-accent-100: #F7E9D4   (Very light backgrounds)
```

### Neutral Colors

```
Canvas:       #FAF6EE (Main background)
Mist:         #EDE7DA (Secondary background, dividers)
Surface-1:    #FFFCF5 (Card background)
Surface-2:    #FFFFFF (Elevated/modal background)
Surface-ink:  #0A2F36 (Dark background for premium sections)
```

### Text Colors

```
--fg-1:       #1B2A2C (Primary text - 100% black equivalent)
--fg-2:       #3F5256 (Secondary text - descriptions)
--fg-3:       #6B7C7F (Tertiary - captions, meta)
--fg-4:       #9AA8AA (Quaternary - placeholders)
--fg-on-primary: #FFFCF5 (Text on primary/dark backgrounds)
--fg-on-accent:  #1B2A2C (Text on accent)
```

### Semantic Colors

```
Success:  #4A8E6E (✓ Confirmed, paid, active)
Warning:  #C68A2E (⚠ Pending, attention)
Danger:   #C25E4D (✗ Error, overdue, declined)
Info:     #4685A8 (ⓘ Information, notice)
```

## Typography

### Font Families

- **Display/Serif**: "Instrument Serif" – Editorial, premium, high hierarchy
  - Used for: Hero titles, large headings, KPI numbers
  - Weight: 400 (regular), 400 italic
- **UI/Sans**: "Manrope" – Clean, geometric, UI-friendly
  - Used for: Body text, buttons, form labels, navigation
  - Weights: 400, 500, 600, 700, 800

### Type Scale (Major Third 1.25x)

```
Display XL:  84px / 92px   (Hero headline)
Display LG:  64px / 72px   (Page title)
Display MD:  48px / 56px   (Section title)
H1:          36px / 44px   (Main heading)
H2:          28px / 36px   (Subheading)
H3:          22px / 30px   (Section header)
H4:          18px / 28px   (Card title)
Body LG:     18px / 28px   (Lead paragraph)
Body:        16px / 24px   (Default body text)
Body SM:     14px / 20px   (Secondary text)
Caption:     12px / 16px   (Meta, labels)
Eyebrow:     12px / 16px   (Uppercase labels)
KPI:         64px / 1     (Numbers - tabular)
```

### Tracking

- Tight: -0.02em (headings, branded text)
- Normal: 0em (body)
- Wide: 0.04em (wide spacing)
- Caps: 0.08em (uppercase labels)

## Spacing System (Base 4px)

```
--space-1:  4px    (tiny gaps, inline spacing)
--space-2:  8px    (icon spacing, small gaps)
--space-3:  12px   (form field gaps)
--space-4:  16px   (padding, component gaps)
--space-5:  20px   (card padding)
--space-6:  24px   (section padding, buttons)
--space-7:  32px   (major gap)
--space-8:  40px   (large gap)
--space-9:  48px   (very large)
--space-10: 64px   (section spacing)
--space-11: 96px   (hero spacing)
--space-12: 128px  (extreme spacing)
```

## Border Radius

```
--radius-xs:    4px    (minimal rounding)
--radius-sm:    8px    (slight rounding)
--radius-md:    12px   (standard input/component)
--radius-lg:    16px   (soft buttons/cards)
--radius-xl:    24px   (card corners)
--radius-2xl:   32px   (large roundness)
--radius-pill:  999px  (fully rounded - buttons, badges)
```

## Shadows

```
Shadow 1 (subtle):   0 1px 2px rgba(14,79,74,0.04), 0 2px 8px rgba(14,79,74,0.06)
Shadow 2 (light):    0 4px 14px rgba(14,79,74,0.08), 0 2px 4px rgba(14,79,74,0.04)
Shadow 3 (medium):   0 10px 30px rgba(10,47,54,0.12), 0 4px 8px rgba(10,47,54,0.06)
Shadow 4 (strong):   0 24px 60px rgba(10,47,54,0.18), 0 8px 16px rgba(10,47,54,0.08)
Focus Shadow:        0 0 0 2px var(--bg-canvas), 0 0 0 4px var(--oet-primary-500)
Input Inset:         inset 0 1px 0 rgba(14,79,74,0.04)
```

## Motion & Animation

```
Easing:
  --ease-out:      cubic-bezier(0.22, 1, 0.36, 1)    (smooth exit)
  --ease-in:       cubic-bezier(0.4, 0, 1, 1)         (smooth entry)
  --ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1)       (smooth both)

Duration:
  --dur-fast:      120ms   (hover, small interactions)
  --dur-base:      180ms   (standard transitions)
  --dur-screen:    320ms   (full screen changes)
  --dur-hero:      480ms   (hero animations)

Animations:
  oet-rise:        fade + slide up (entrance)
  oet-fade-in:     opacity transition
  oet-spin:        rotation (loading)
```

## Component Style Guide

### Buttons

```
Primary:   Green background, white text, 48px height
Secondary: White background, dark text, light border
Accent:    Amber background, dark text (CTAs)
Ghost:     Transparent, green text (secondary actions)

States:
  Hover:   Darker shade + slight transform
  Active:  Scale 0.98 (pressed effect)
  Disabled: 50% opacity, not-allowed cursor
  Loading: Spinner icon
```

### Input Fields

```
Height:     48px
Padding:    0 16px
Border:     1px solid --oet-border-firm
Focus:      Border green, shadow with tint
Radius:     12px
Placeholder: Gray 400 color
```

### Cards

```
Background:  --oet-surface-1 or --oet-surface-2
Border:      1px --oet-border-soft
Radius:      24px
Padding:     20px
Shadow:      Shadow 1 (default), Shadow 2 (hover)
Transition:  Transform + shadow on hover
```

### KPI Display

```
Value:       Display font, large (64px+)
Label:       Caption gray, uppercase
Delta:       Small text with ↑/↓ arrow
Color:       Green (up), Orange (down)
```

## Responsive Breakpoints

- Mobile: < 640px (touch-friendly, single column)
- Tablet: 640px - 1024px (optimized layout)
- Desktop: > 1024px (full multi-column)

## Accessibility

- Minimum text contrast: 4.5:1 (WCAG AA)
- Focus indicators: Always visible (4px ring)
- Touch targets: Minimum 44x44px
- Semantic HTML: Proper heading hierarchy, form labels
- Keyboard navigation: Tab order logical

## Brand Tone

- **Visual**: Clinical, calm, premium, trustworthy
- **Interaction**: Smooth, responsive, understated
- **Error states**: Clear but not alarming (warm amber)
- **Success states**: Affirming green (professional)

## Usage Examples

### Hero Section

```html
<!-- Primary + Accent together for maximum impact -->
<h1>Headline with accent color</h1>
<a href="/" class="btn btn-primary">Primary CTA</a>
<a href="/" class="btn btn-accent">Secondary CTA</a>
```

### Dashboard Card

```html
<div class="oet-card">
  <h3>Title</h3>
  <p class="oet-body-sm">Description</p>
  <div class="oet-kpi">42</div>
</div>
```

### Form

```html
<input class="oet-input" placeholder="Email..." />
<button class="oet-btn oet-btn--primary">Submit</button>
```

### Status Badge

```html
<span style="background: var(--oet-success-100); color: var(--oet-success-700);"> ✓ Paid </span>
```
