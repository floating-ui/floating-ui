---
'@floating-ui/react': patch
---

fix(useFloating): set `dataRef` `openEvent` property to `undefined` on close. Fixes a minor issue when `useHover` `restMs` is combined with `useClientPoint` and focus modality was used before hover modality.
