# Tessera Brand Assets

This package contains the core brand assets for Tessera.

## Contents

| File | Description |
|------|-------------|
| `brand-guidelines.html` | Self-contained single-page brand guidelines document. Open in any browser. Covers logo usage, color palette, typography, component specs, spacing, and usage rules. |
| `color-palette.css` | Exportable CSS custom properties file. Import this into any project to get all Tessera brand tokens (colors, gradients, shadows, spacing, radii, typography stacks). All properties are prefixed with `--tessera-` to avoid conflicts. |
| `logo.svg` | Primary logo mark (navy strokes, cobalt circles) for use on light backgrounds. |
| `logo-dark.svg` | Reversed logo mark (white strokes, lighter cobalt circles) for use on dark backgrounds. |

## Quick Start

### Using the CSS tokens

```html
<link rel="stylesheet" href="color-palette.css">
```

Or import in your stylesheet:

```css
@import url('color-palette.css');

.my-button {
  background: var(--tessera-grad-action);
  border-radius: var(--tessera-r-md);
  box-shadow: var(--tessera-shadow-btn);
  font-family: var(--tessera-font-sans);
}
```

### Using the logo

```html
<img src="logo.svg" alt="Tessera" width="36" height="36">
```

For dark backgrounds, use `logo-dark.svg` instead.

### Viewing the guidelines

Open `brand-guidelines.html` directly in a browser. It is fully self-contained with inline CSS and embedded fonts (loaded from Google Fonts CDN).
