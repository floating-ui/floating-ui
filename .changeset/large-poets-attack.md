---
'@floating-ui/core': minor
'@floating-ui/dom': minor
---

feat: add `'layoutViewport'` string option to `rootBoundary`. Unlike the visual `'viewport'` boundary, it remains stable while pinch-zooming or when a mobile software keyboard is open, and unlike a manually passed `Rect` of the documentElement's client size, it accounts for space reserved by `scrollbar-gutter: stable`.
