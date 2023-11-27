# @floating-ui/react

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
