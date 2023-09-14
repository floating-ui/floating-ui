---
'@floating-ui/core': patch
---

fix(arrow): perform a reset if internal shifting is performed

This allows `shift()` to continue taking action when the arrow's internal
shifting of the floating element is performed (preventing potential
overflow/clipping of the floating element in certain scenarios), while still
allowing the arrow to point toward the reference when it is small if possible.
