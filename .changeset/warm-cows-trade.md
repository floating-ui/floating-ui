---
'@floating-ui/react': patch
---

feat(useDelayGroup): return the `GroupContext` value from the Hook, and don't require an `id` option to be passed. You only need to invoke `useDelayGroup()` and read the context data from it. As a result, `useDelayGroupContext()` has been deprecated as it no longer needs to be used.
