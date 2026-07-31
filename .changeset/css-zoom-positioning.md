---
'@floating-ui/core': patch
'@floating-ui/dom': patch
---

fix: support the CSS `zoom` property. Positioning was incorrect whenever the
floating element's `offsetParent` resolved to the `Window`, since
`getBoundingClientRect()` reports zoomed viewport pixels while `left`/`top` are
resolved in the element's own unzoomed coordinate space. This also corrects
`shift()` overshooting and `size()` reporting wrong available space under
`zoom`.
