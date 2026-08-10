---
'@floating-ui/core': patch
'@floating-ui/dom': patch
---

fix: support the CSS `zoom` property, correcting positioning and overflow detection when the floating element's `offsetParent` resolves to the `Window`
