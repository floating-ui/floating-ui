# @floating-ui/core

## 0.2.2

### Patch Changes

- fix(limitShift): crossAxis offset (#1457)
- fix(size): center alignment along crossAxis (#1459)
- fix(autoPlacement): better algo (#1458)
  - 🚨 Removed `crossAxis` option as a result
- refactor(offset): use Options instead of Offset type
- perf(core): add pure annotation for allPlacements const (#1437)
- fix: more helpful platform error (#1449)
- perf: import math fns from utils

## 0.2.1

### Patch Changes

- perf: save some bytes and execution
- fix: CJS build

## 0.2.0

### Minor Changes

feat(size): pass rects to `apply`

## 0.1.5

### Patch Changes

- fix: revert back to ES module
- fix(core): specify `0` default option in `offset` middleware
- fix(shift): improve limitShift.offset type

## 0.1.4

### Patch Changes

- fix(core): limitShift type

## 0.1.3

### Patch Changes

- fix: VirtualElement type
