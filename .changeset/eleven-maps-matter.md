---
"@floating-ui/react": patch
---

fix(useListNavigation): sync indexRef to `selectedIndex` on open. Fixes an issue where if `selectedIndex` changed after initial render before opening it would not sync the `activeIndex` correctly.
