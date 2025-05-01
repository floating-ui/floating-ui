---
"@floating-ui/core": patch
---

feat(flip): add `"alignment"` string value for `crossAxis` option. 
Prevents `fallbackPlacements`/`fallbackAxisSideDirection` from too eagerly changing to the perpendicular side (preferring `shift()` if overflow is detected along the cross axis).
