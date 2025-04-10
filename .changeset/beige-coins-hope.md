---
'@floating-ui/react': patch
---

fix(useTransitionStatus): avoid browser from painting before floating element opens. With `FloatingDelayGroup`, this avoids a flicker when moving between floating elements to ensure one is always open with no missing frames.
