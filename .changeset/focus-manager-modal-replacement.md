---
'@floating-ui/react': patch
---

fix(FloatingFocusManager): don't return focus to the previous reference when a modal is replaced by another one in the same render and focus has already moved into the new one
