---
'@floating-ui/dom': patch
---

fix(autoUpdate): observe the border box so a padding or border change on either element triggers an update. The position is measured with `getBoundingClientRect`, which is the border box, but the observer was left on its default content box and missed the change
