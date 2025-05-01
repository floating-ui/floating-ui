---
'@floating-ui/core': minor
---

feat(flip): add `"alignment"` string value for `crossAxis` option. This value determines if cross axis overflow checking is restricted to the `alignment` of the placement only. This prevents `fallbackPlacements`/`fallbackAxisSideDirection` from too eagerly changing to the perpendicular side (thereby preferring `shift()` if overflow is detected along the cross axis, even if `shift()` is placed after `flip()` in the middleware array).
