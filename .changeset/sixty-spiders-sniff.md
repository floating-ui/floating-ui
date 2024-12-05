---
'@floating-ui/react': patch
---

fix(useDismiss): read target `overflow` style for scrollbar press check. Fixes an issue where outside presses would be incorrectly prevented if the target element that was pressed appeared scrollable but was actually not.
