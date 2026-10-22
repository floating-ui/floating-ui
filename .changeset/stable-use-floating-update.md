---
'@floating-ui/react-dom': patch
---

fix(useFloating): make `update` stable. Changing `placement`, `strategy` or `middleware` now recomputes the position without recreating `whileElementsMounted`, which caused "ResizeObserver loop completed with undelivered notifications" errors when it happened during a resize-triggered update
