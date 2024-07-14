---
'@floating-ui/utils': patch
---

fix(getContainingBlock): reorder `isTopLayer` check. Fixes regression when a top layer element like `<dialog>` is a containing block (e.g. it has a `transform` style) and a floating element is being positioned inside of it.
