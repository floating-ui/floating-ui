---
'@floating-ui/react': patch
---

feat: add `useFloatingRootContext` Hook, which enables calling interaction hooks in a component higher in the tree than `useFloating` is called in. This supports spreading reference props onto an "external" reference element.
