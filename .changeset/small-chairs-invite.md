---
'@floating-ui/react': patch
---

fix(useListNavigation): apply `aria-activedescendant` prop on floating element
only for non typeable-combobox reference elements. Fixes issues with Firefox
VoiceOver on Mac forcing DOM focus into the listbox.
