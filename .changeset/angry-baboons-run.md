---
"@floating-ui/react": patch
---

fix(useListNavigation): reset internal `focusOnOpen` state when floating element is closed. This prevents the first item being highlighted on open under certain conditions when it shouldn't be.
