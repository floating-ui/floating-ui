---
'@floating-ui/core': patch
---

fix(flip): prefer the scrollable overflow direction in the `bestFit` fallback strategy

When the floating element cannot fit on any placement, the `bestFit` fallback now prefers a placement whose overflow can be scrolled into view (toward `bottom`, and `right` — or `left` in RTL) over one that overflows toward the clipping boundary's scroll origin, where the floating element is clipped and can never be reached. When `size()` is also used, the floating element can be resized to fit instead, so the least-overflowing placement continues to win as before.
