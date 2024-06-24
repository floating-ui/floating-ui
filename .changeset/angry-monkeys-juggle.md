---
"@floating-ui/react": patch
---

fix(useInteractions): split prop getter dependencies so that only the relevant element changes when necessary. Previously `reference` and `floating` prop getters had dependencies grouped.
