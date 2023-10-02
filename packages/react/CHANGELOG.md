# @floating-ui/react

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
