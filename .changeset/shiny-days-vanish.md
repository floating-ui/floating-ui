---
'@floating-ui/react': patch
---

feat: experimental `NextFloatingDelayGroup` (and `useNextFloatingDelayGroup`). Unlike `FloatingDelayGroup`, this component doesn't cause a re-render of unrelated consumers of the context when the delay changes, improving performance. This will eventually become the new default for `FloatingDelayGroup` in v1 (`Next`), as [its API is different](https://github.com/floating-ui/floating-ui/pull/3274).
