# @floating-ui/dom

## 2.0.0

### Major Changes

- breaking: remove `@floating-ui/utils` package in favor of a sub-path on `@floating-ui/core` and `@floating-ui/dom`. `@floating-ui/utils` is now `@floating-ui/core/utils` and `@floating-ui/utils/dom` is now `@floating-ui/dom/utils`.
- breaking: `computePosition` is now a sync function by default - `computePositionAsync` is a new export to handle async plaform methods
- chore: new bundling strategy. UMD artifacts have been removed.
- breaking: remove top-level `getOverflowAncestors` export (this is now exported under utils)

### Patch Changes

- refactor(next)!: `main/crossAxis`→ `side/alignAxis`
- feat: re-export utils across packages
- Update dependencies: `@floating-ui/core@2.0.0`
