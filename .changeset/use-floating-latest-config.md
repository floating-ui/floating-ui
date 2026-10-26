---
'@floating-ui/react-dom': patch
---

fix(useFloating): use the latest `placement`, `strategy` and `middleware` when `update` is called from a child's layout effect in the same commit that changes them (React 18+). Previously the stale computation could resolve last and leave the floating element at the old position
