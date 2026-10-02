---
'@floating-ui/react-dom': patch
---

fix(react-dom): keep positioning updates stable when placement, strategy, or middleware changes to avoid recreating auto-update observers during ResizeObserver delivery.
