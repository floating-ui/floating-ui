---
'@floating-ui/react': patch
---

feat(useRole): add `select` and `combobox` component roles and allow
dynamic/derivable item props based on `active` and `selected` states. Also adds
`menuitem` role for nested `menu` reference elements, and automatically adds an
`id` to the item props for the new component roles for virtual focus.
