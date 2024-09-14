---
"@floating-ui/react": patch
---

fix(FloatingFocusManager): avoid returning focus to nearest tabbable element of the reference if it gets removed when the floating element closes to avoid unwanted focus effects of unrelated elements firing. Tab index context remains preserved if the floating element is portaled.
