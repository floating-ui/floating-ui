---
"@floating-ui/react": patch
---

Fixed FloatingArrow rendering a visible edge-doubling artifact when using a semi-transparent fill color with `strokeWidth > 0`, by adding `paintOrder="stroke fill"` to the fill path.
