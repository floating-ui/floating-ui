---
'@floating-ui/react': patch
---

fix(useId): avoid import error in new bundlers when using React <18, and also ensure id collisions don't occur when multiple independent versions of Floating UI are used with React <18.
