---
"@floating-ui/react": patch
---

fix(FloatingArrow): ignore staticOffset if floating element is shifted. Fixes an issue where the arrow could potentially point to nothing if it was shifted enough from its reference element.
