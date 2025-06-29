# @floating-ui/core

## 2.0.0

### Major Changes

- breaking: remove `@floating-ui/utils` package in favor of a sub-path on `@floating-ui/core` and `@floating-ui/dom`. `@floating-ui/utils` is now `@floating-ui/core/utils` and `@floating-ui/utils/dom` is now `@floating-ui/dom/utils`.
- breaking(flip): rename `fallbackStrategy` to `failureStrategy`
- breaking: `computePosition` is now a sync function by default - `computePositionAsync` is a new export to handle async plaform methods
- chore: new bundling strategy. UMD artifacts have been removed.
- breaking: split `placement` into `side` and `align` strings
- breaking: camelCase to kebab-case strings:

- `hide` middleware: `referenceHidden` → `reference-hidden`
- `flip` middleware: `bestFit` → `best-fit`
- `flip` middleware: `initialPlacement` → `initial-placement`
- `boundary` option: `clippingAncestors` → `clipping-ancestors`
- breaking: remove top-level `rectToClientRect` export (this is now exported under utils)
- breaking(platform): `convertOffsetParentRelativeRectToViewportRelativeRect` → `convertToViewportRelativeRect`

### Patch Changes

- feat: logical sides
- refactor(next)!: `main/crossAxis`→ `side/alignAxis`
- feat: re-export utils across packages
