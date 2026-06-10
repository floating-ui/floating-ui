---
'@floating-ui/core': patch
---

fix(flip): prefer overflow toward the scrollable direction in `bestFit` when no placement fits

When the floating element cannot fit on any placement, the `bestFit` fallback now breaks ties between placements with equal overflow by preferring the one that overflows toward the scrollable direction (`bottom`/`right`) over the clipped origin direction (`top`/`left`), keeping the floating element reachable instead of inaccessibly clipped.
