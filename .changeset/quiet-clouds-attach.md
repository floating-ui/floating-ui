---
'@floating-ui/vue': patch
---

Initialize positioning and `whileElementsMounted` when the element refs are already populated when `useFloating` is called. Clean up the attachment even if its callback synchronously disposes the owning scope.
