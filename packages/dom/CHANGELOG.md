# @floating-ui/dom

## 1.6.0

### Minor Changes

- fix: handle CSS `:top-layer` elements inside containing blocks. It's no longer
  necessary to implement the middleware workaround outlined in
  https://github.com/floating-ui/floating-ui/issues/1842#issuecomment-1872653245.

### Patch Changes

- Update dependencies: `@floating-ui/core@1.6.0`

## 1.5.4

### Patch Changes

- 4c04669: chore: exports .d.mts types, solves #2472
- 0d18e37: refactor: avoid $ appearing in rects dimensions
- Updated dependencies [4c04669]
- Updated dependencies [afb7e5e]
  - @floating-ui/utils@0.2.0
  - @floating-ui/core@1.5.3

## 1.5.3

### Patch Changes

- a6c72f50: fix(getOverflowAncestors): avoid traversing into iframes for
  clipping detection
- Updated dependencies [a6c72f50]
- Updated dependencies [0ef68ffa]
  - @floating-ui/utils@0.1.3
  - @floating-ui/core@1.4.2

## 1.5.2

### Patch Changes

- 3426bc27: fix: traverse into iframe parents when finding overflow ancestors
