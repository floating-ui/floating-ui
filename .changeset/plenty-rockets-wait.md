---
"@floating-ui/react": patch
---

fix(FloatingArrow): ignore `staticOffset` prop if floating element is shifted. Fixes an issue where the arrow could potentially point to nothing if it was shifted enough from its reference element.
