# @floating-ui/utils

## 0.2.10

### Patch Changes

- refactor: small performance improvements
- perf: reduce memory allocations

## 0.2.9

### Patch Changes

- fix(getContainingBlock): detect `translate`, `rotate`, `scale` shorthand properties

## 0.2.8

### Patch Changes

- fix: make element utils ssr-friendly

## 0.2.7

### Patch Changes

- fix(getFrameElement): ensure `win.parent` is an object

## 0.2.6

### Patch Changes

- fix: test if `frameElement` is readable to avoid errors in Safari and MSEdge with cross-origin iframes

## 0.2.5

### Patch Changes

- feat(getContainingBlock): allow `CSSStyleDeclaration` as an argument
- fix(getContainingBlock): reorder `isTopLayer` check. Fixes regression when a top layer element like `<dialog>` is a containing block (e.g. it has a `transform` style) and a floating element is being positioned inside of it.

## 0.2.4

### Patch Changes

- refactor: use `scrollX`/`scrollY` instead of deprecated `pageXOffset`/`pageYOffset`

## 0.2.3

### Patch Changes

- fix(getContainingBlock): detect top layer elements
- fix(types): add optional `getClientRects()` method to `VirtualElement`
- refactor: improve types and internal codebase consistency. All documented types are now exported.

## 0.2.2

### Patch Changes

- fix: avoid spreading rects to support `DOMRect` types

## 0.2.1

### Patch Changes

- 270a075: fix: remove `react` peer dependency

## 0.2.0

### Minor Changes

- afb7e5e: chore(utils): remove `/react` path

### Patch Changes

- 4c04669: chore: exports .d.mts types, solves #2472

## 0.1.6

### Patch Changes

- 0debd691: fix: restore /react path

## 0.1.5

### Patch Changes

- 28659c4d: refactor: move react utils to @floating-ui/react/utils

## 0.1.4

### Patch Changes

- 3d8b9c65: fix(getOverflowAncestors): handle traverseIframes correctly when
  there are clipping ancestors in the inner frame

## 0.1.3

### Patch Changes

- a6c72f50: fix(getOverflowAncestors): avoid traversing into iframes for
  clipping detection

## 0.1.2

### Patch Changes

- cb48d956: fix(dom): traverse into iframe parents when finding overflow
  ancestors
