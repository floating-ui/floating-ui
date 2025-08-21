# @floating-ui/dom

## 1.7.4

### Patch Changes

- fix(getViewportRect): account for space left by `scrollbar-gutter: stable`

## 1.7.3

### Patch Changes

- Update dependencies: `@floating-ui/core@1.7.3`

## 1.7.2

### Patch Changes

- perf: reduce memory allocations
- Update dependencies: `@floating-ui/utils@0.2.10`, `@floating-ui/core@1.7.2`

## 1.7.1

### Patch Changes

- Update dependencies: `@floating-ui/core@1.7.1`

## 1.7.0

### Minor Changes

- feat(flip): add `"alignment"` string value for `crossAxis` option. This value determines if cross axis overflow checking is restricted to the `alignment` of the placement only. This prevents `fallbackPlacements`/`fallbackAxisSideDirection` from too eagerly changing to the perpendicular side (thereby preferring `shift()` if overflow is detected along the cross axis, even if `shift()` is placed after `flip()` in the middleware array).

### Patch Changes

- fix: correct position when document scrollbar is on left side with fixed strategy
- Update dependencies: `@floating-ui/core@1.7.0`

## 1.6.13

### Patch Changes

- fix(autoUpdate): work around `IntersectionObserver` issue that sometimes fails to detect movement of reference element
- Update dependencies: `@floating-ui/utils@0.2.9`

## 1.6.12

### Patch Changes

- fix: handle relative html offset clipping rect
- fix(getClippingRect): allow passing `DOMRect` as a `boundary`

## 1.6.11

### Patch Changes

- fix: handle html relative offset
- Update dependencies: `@floating-ui/utils@0.2.8`

## 1.6.10

### Patch Changes

- Update dependencies: `@floating-ui/utils@0.2.7`

## 1.6.9

### Patch Changes

- fix: test if `frameElement` is readable to avoid errors in Safari and MSEdge with cross-origin iframes
- Update dependencies: `@floating-ui/utils@0.2.6`

## 1.6.8

### Patch Changes

- Update dependencies: `@floating-ui/utils@0.2.5`

## 1.6.7

### Patch Changes

- chore: fix internal dependency versioning
- Update dependencies: `@floating-ui/utils@0.2.4`

## 1.6.6

### Patch Changes

- fix(getContainingBlock): detect top layer elements
- fix(types): add optional `getClientRects()` method to `VirtualElement`
- chore: fix internal deps
- refactor: improve types and internal codebase consistency. All documented types are now exported.
- Update dependencies: `@floating-ui/utils@0.2.3`

## 1.6.5

### Patch Changes

- fix: correctly calculate `<svg>` arrow element `offsetParent`. Fixes arrow positioning when styling an inner element of the floating element with a border.
- fix: ignore `clippingAncestors` collision boundary for top layer elements
- fix(types): correct `OffsetOptions` alias

## 1.6.4

### Patch Changes

- fix: avoid spreading rects to support `DOMRect` types
- fix(types): use DOM Derivable type
- perf(autoUpdate): reduce layoutShift update checks while reference is clipped from view

## 1.6.3

### Patch Changes

- fix: calculate reference element offset relative to `offsetParent` iframe. Fixes issue with positioning in nested iframes, such as the following:

```html
<html>
  <iframe>
    <div>floating</div>
    <iframe>
      <div>reference</div>
    </iframe>
  </iframe>
</html>
```

## 1.6.2

### Patch Changes

- fix: top layer element positioning and collision detection when using `absolute` strategy

## 1.6.1

### Patch Changes

- perf: avoid `getContainingBlock` call for non-top layer elements

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
