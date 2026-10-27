---
'@floating-ui/react': minor
---

feat(useRole): deprecate the `label` role

The `label` role sets `aria-labelledby` on the reference element only while the floating element is shown, which screen readers and accessibility tooling don't reliably pick up. It is now deprecated and logs a development warning pointing to `aria-label` on the reference element instead.
