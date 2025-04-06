---
"@floating-ui/react": patch
---

feat: `FloatingDelayGroupOptimized` (and `useDelayGroupOptimized`). Unlike `FloatingDelayGroup`, this component doesn't cause a re-render of unrelated consumers of the context when the delay changes, improving performance. This will become the new default in v1 while the previous implementation will be deprecated.
