---
"@floating-ui/react": patch
---

fix(useListNavigation): sync internal `indexRef` to `selectedIndex` on open. Fixes an issue where if `selectedIndex` changed after initial render before opening, `activeIndex` would not be correctly synced.
