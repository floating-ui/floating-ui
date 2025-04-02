---
"@floating-ui/react": patch
---

fix(useFloating): prevent error when using `inline` middleware when passing a real DOM element to `refs.setPositionReference` due to `element.getClientRects()` not being handled
