# @floating-ui/core

## 1.7.3

### Patch Changes

- fix(flip): ensure perpendicular axis flips with crossAxis alignment

## 1.7.2

### Patch Changes

- perf: reduce memory allocations
- Update dependencies: `@floating-ui/utils@0.2.10`

## 1.7.1

### Patch Changes

- fix(flip): only allow fallback to the perpendicular axis if all placements on the preferred side axis overflow the main axis with `crossAxis: 'alignment'`

## 1.7.0

### Minor Changes

- feat(flip): add `"alignment"` string value for `crossAxis` option. This value determines if cross axis overflow checking is restricted to the `alignment` of the placement only. This prevents `fallbackPlacements`/`fallbackAxisSideDirection` from too eagerly changing to the perpendicular side (thereby preferring `shift()` if overflow is detected along the cross axis, even if `shift()` is placed after `flip()` in the middleware array).

## 1.6.9

### Patch Changes

- Update dependencies: `@floating-ui/utils@0.2.9`

## 1.6.8

### Patch Changes

- fix(size): fill viewport along an axis if shift is enabled on that axis
- fix(offset): avoid NaN when mainAxis or crossAxis is undefined
- Update dependencies: `@floating-ui/utils@0.2.8`

## 1.6.7

### Patch Changes

- Update dependencies: `@floating-ui/utils@0.2.7`

## 1.6.6

### Patch Changes

- Update dependencies: `@floating-ui/utils@0.2.6`

## 1.6.5

### Patch Changes

- Update dependencies: `@floating-ui/utils@0.2.5`

## 1.6.4

### Patch Changes

- Update dependencies: `@floating-ui/utils@0.2.4`

## 1.6.3

### Patch Changes

- fix(flip): adjust `bestFit` algorithm to only use `initialPlacement` or `y` side axis with `fallbackAxisSideDirection`
- chore: fix internal deps
- refactor: improve types and internal codebase consistency. All documented types are now exported.
- Update dependencies: `@floating-ui/utils@0.2.3`

## 1.6.2

### Patch Changes

- fix(size): correctly constrain floating element to avoid overflowing outside viewport with `shift({crossAxis: true})`

## 1.6.1

### Patch Changes

- fix: avoid spreading rects to support `DOMRect` types

## 1.6.0

### Minor Changes

- fix: handle CSS `:top-layer` elements inside containing blocks. It's no longer
  necessary to implement the middleware workaround outlined in
  https://github.com/floating-ui/floating-ui/issues/1842#issuecomment-1872653245.

## 1.5.3

### Patch Changes

- 4c04669: chore: exports .d.mts types, solves #2472
- Updated dependencies [4c04669]
- Updated dependencies [afb7e5e]
  - @floating-ui/utils@0.2.0

## 1.5.2

### Patch Changes

- 23f32f5d: fix(types): avoid ts 4.2+ syntax

## 1.5.1

### Patch Changes

- 88bf9768: fix(offset): avoid doubling calculation on same placement reset when
  `arrow` changes alignment of floating element

## 1.5.0

### Minor Changes

- d7e07fba: feat(arrow): add `alignmentOffset` data

### Patch Changes

- fd3c19ac: fix(flip): skip if arrow has performed internal shifting

## 1.4.2

### Patch Changes

- 0ef68ffa: fix(arrow): perform a reset if internal shifting is performed

  This allows `shift()` to continue taking action when the arrow's internal
  shifting of the floating element is performed (preventing potential
  overflow/clipping of the floating element in certain scenarios), while still
  allowing the arrow to point toward the reference when it is small if possible.

- Updated dependencies [a6c72f50]
  - @floating-ui/utils@0.1.3
