---
'@floating-ui/react': patch
---

fix: only use blur capture to mark inside floating tree if `FloatingPortal` exists. Prevents blocking `closeOnFocusOut` behavior.
