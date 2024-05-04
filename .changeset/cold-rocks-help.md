---
'@floating-ui/utils': patch
'@floating-ui/dom': patch
---

fix: correctly calculate `<svg>` arrow element `offsetParent`. Fixes arrow positioning when styling an inner element of the floating element and it has a border.
