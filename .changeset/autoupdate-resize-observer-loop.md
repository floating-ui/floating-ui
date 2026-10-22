---
'@floating-ui/dom': patch
---

fix(autoUpdate): avoid "ResizeObserver loop completed with undelivered notifications" errors when an update triggered by the floating element's own resize changes its size again (e.g. `flip` + `size`). The floating element is now unobserved until the next frame after every resize-triggered update, not only after reference resizes
