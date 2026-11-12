---
'@floating-ui/react': patch
---

fix(useListNavigation): don't steal focus on item `pointerleave` when the floating element is closed or focus has already moved outside of it (e.g. an item that opens a dialog or an inline input)
