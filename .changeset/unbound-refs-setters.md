---
'@floating-ui/react': patch
---

fix(types): type `refs` setters as properties so `@typescript-eslint/unbound-method` doesn't flag `ref={refs.setFloating}`
