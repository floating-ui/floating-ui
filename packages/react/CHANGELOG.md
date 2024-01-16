# @floating-ui/react

## 0.26.6

### Patch Changes

- c9c5058: fix(useListNavigation): sync internal `indexRef` to `selectedIndex` on open. Fixes an issue where if `selectedIndex` changed after initial render before opening, `activeIndex` would not be correctly synced.
- 8b3c93b: fix(utils): check if env is JSDOM for `isVirtualPointerEvent`. Fixes issue when testing `visibleOnly` prop in `useFocus`.
- Updated dependencies [d3a773b]
  - @floating-ui/react-dom@2.0.6

## 0.26.5

### Patch Changes

- 672e458: feat(useListNavigation, Composite): support grid navigation over items with variable sizes
- 4c04669: chore: exports .d.mts types, solves #2472
- 6af9808: fix(react/utils): cross-browser `isVirtualPointerEvent`
- Updated dependencies [4c04669]
- Updated dependencies [afb7e5e]
  - @floating-ui/react-dom@2.0.5
  - @floating-ui/utils@0.2.0

## 0.26.4

### Patch Changes

- 7dc269cf: feat(useRole): add `select` and `combobox` component roles and allow
  dynamic/derivable item props based on `active` and `selected` states. Also
  adds `menuitem` role for nested `menu` reference elements, and automatically
  adds an `id` to the item props for the new component roles for virtual focus.
- d9be2481: fix(useListNavigation): apply `aria-activedescendant` prop on
  floating element only for non typeable-combobox reference elements. Fixes
  issues with Firefox VoiceOver on Mac forcing DOM focus into the listbox.

## 0.26.3

### Patch Changes

- 9170b9e6: fix(useDismiss): `targetRootAncestor` check for third party outside
  presses

  The Grammarly extension no longer closes upon clicking when inside floating
  elements.

- 66efdaf8: fix(FloatingFocusManager): return focus to last connected element

## 0.26.2

### Patch Changes

- c1965f65: refactor: minor jsdoc/type improvements
- 3bd42f24: feat: reason strings as third param of onOpenChange
- 14cb1681: fix(FloatingFocusManager): avoid returning focus to reference if
  focus moved elsewhere
- 628fd119: feat(useRole): add label role
- Updated dependencies [c1965f65]
  - @floating-ui/react-dom@2.0.3

## 0.26.1

### Patch Changes

- ac17abb7: feat(Composite): allow controlled mode with `activeIndex` and
  `onNavigate` props
- c3bfd04e: fix(useFocus): improve `visibleOnly` detection
- 43725a2c: feat(useDismiss): add `capture` option and default `outsidePress` to
  `true`

## 0.26.0

### Minor Changes

- 0668ed61: feat(useFocus): replace `keyboardOnly` option with `visibleOnly`
  (matches :focus-visible CSS selector)

### Patch Changes

- 07d8e853: fix(useDismiss): handle dragging outside/inside floating element
  with click `outsidePressEvent`
- 841eb03a: fix(useFocus): close on blur only if focus remains in document
- e6d80efb: fix(FloatingFocusManager): treat untrapped combobox reference as
  non-modal guards
- 4144204a: fix: virtual event check for Android
- 28659c4d: refactor: move react utils to @floating-ui/react/utils
- Updated dependencies [28659c4d]
  - @floating-ui/utils@0.1.5

## 0.25.4

### Patch Changes

- 8bf6e826: fix(Composite): loop false
- 8d576645: feat(useListNavigation): support nested virtual navigation
