# @floating-ui/core

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
