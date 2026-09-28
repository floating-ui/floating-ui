---
"@floating-ui/dom": patch
---

Fix incorrect positioning when CSS `zoom` is applied to `<body>` or `<html>`.

In Chrome 128+, the standardised CSS `zoom` property causes
`getBoundingClientRect()` to return coordinates in zoomed viewport pixels,
while layout values (`offsetLeft`, `scrollLeft`, CSS `width`, etc.) remain in
unzoomed CSS pixels. When the element's `offsetParent` resolves to `window`
(because `<body>`/`<html>` are statically positioned), the existing scale
correction was skipped entirely, leaving floating elements misplaced by the
zoom factor.

- Adds `getCSSZoom` utility that computes the cumulative `zoom` factor from
  an element up to the document root.
- `getBoundingClientRect` now uses `getCSSZoom` as the scale divisor when
  `offsetParent` is a `Window`.
- `getHTMLOffset` divides the `<html>` element's bounding rect by its own
  computed `zoom` so that scroll offset arithmetic stays in unzoomed pixels,
  fixing the edge case where `zoom` is placed on `<html>` rather than `<body>`.
