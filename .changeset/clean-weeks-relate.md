---
'@floating-ui/react': patch
---

perf(FloatingFocusManager): move manual tabindex handling on floating element to an event. Improves performance when the floating element has a large amount of content or the content changes frequently e.g. virtualized scrolling.
