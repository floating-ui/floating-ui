---
'@floating-ui/react': patch
---

fix(FloatingFocusManager): avoid returning focus to an untrapped combobox after a physical outside press, which could reopen it
