---
"@floating-ui/react": patch
---

fix(FloatingFocusManager): suppress :focus-visible on pointer-initiated close

When a floating element is closed via a pointer interaction (e.g. clicking a menu item), the returned focus on the reference element no longer incorrectly shows :focus-visible styling. Keyboard-initiated closes (e.g. Escape) still correctly apply :focus-visible.
