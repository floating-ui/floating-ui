---
'@floating-ui/react': patch
---

fix(useHover): prevent unnecessary delayed opens to preserve potential click open events. Fixes an issue when combining `useHover` and `useClick` hooks and a click occurred before the floating element could open on hover, it would unexpectedly close on `mouseleave` despite being triggered by a click.
