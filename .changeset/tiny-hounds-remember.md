---
'@floating-ui/core': major
---

fefactor: refine APIs

- camelCase strings are now kebab-cased: `clippingAncestors` → `clipping-ancestors`, `bestFit` → `best-fit`, `initialPlacement` → `initial-placement`, `referenceHidden` → `reference-hidden`.
- `mainAxis` and `crossAxis` are now `side` and `align`. For the `shift()` middleware, `mainAxis` is now `align`, and no longer unexpectedly inverted from the other middleware.
