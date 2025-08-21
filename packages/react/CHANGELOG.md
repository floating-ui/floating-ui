# @floating-ui/react

## 0.27.16

### Patch Changes

- Update dependencies: `@floating-ui/react-dom@2.1.6`

## 0.27.15

### Patch Changes

- Update dependencies: `@floating-ui/react-dom@2.1.5`

## 0.27.14

### Patch Changes

- fix(FloatingFocusManager): allow marking ancestor nodes with `data-floating-ui-inert`. Fixes outside presses not working when clicking on a parent ancestor node.
- feat(FloatingPortal): support `ShadowRoot` containers
- fix(useRole): ensure `aria-selected=true` is present without being active with `select` role
- fix: only use blur capture to mark inside floating tree if `FloatingPortal` exists. Prevents blocking `closeOnFocusOut` behavior.
- fix(FloatingFocusManager): clear previously focused elements that are disconnected more often

## 0.27.13

### Patch Changes

- fix(FloatingFocusManager): ensure focus is always returned correctly in deep nested trees
- fix(markOthers): exclude elements with `role="status"` and `output` elements
- Update dependencies: `@floating-ui/utils@0.2.10`, `@floating-ui/react-dom@2.1.4`

## 0.27.12

### Patch Changes

- fix(FloatingFocusManager): ensure `aria-hidden`/`inert` are cleaned up correctly when mixing `outsideElementsInert` `true`/`false`
- fix(safePolygon): revert to checking if any nested child is open

## 0.27.11

### Patch Changes

- fix(FloatingFocusManager): check if target is connected for `restoreFocus` prop
- Update dependencies: `@floating-ui/react-dom@2.1.3`

## 0.27.10

### Patch Changes

- fix(safePolygon): handle pointer moving outside of all floating elements in a tree with a close delay
- fix(useDismiss): bail out of blur to mark inside react tree if floating tree exists

## 0.27.9

### Patch Changes

- fix(useListNavigation): reset internal `focusItemOnOpen` state when floating element is closed. This prevents the first item being highlighted on open under certain conditions when it shouldn't be.
- fix(FloatingOverlay): `lockScroll` detection on iPad
- fix(useListNavigation): avoid item rerenders upon open
- fix(FloatingFocusManager): check for blurring to nested elements inside the React tree without `FloatingTree`
- fix(FloatingFocusManager): always prevent scroll upon returning focus
- refactor(useHover): improve `handleClose` option and docs. You can now more easily write a custom event handler function, including exported types.
- feat(FloatingOverlay): add `lockScroll` scrollbar width CSS variable (`--floating-ui-scrollbar-width`)
- feat(useListNavigation, Composite): allow `disabledIndices` to be a function

## 0.27.8

### Patch Changes

- feat: export most utils under `@floating-ui/react/utils`. This makes it a lot easier to write your own custom interaction hooks, or copy/paste the existing ones to change the way they are implemented yourself without patching or waiting for features/breaking changes.
- perf(FloatingFocusManager): move manual tabindex handling on floating element to an event. Improves performance when the floating element has a large amount of content or the content changes frequently e.g. virtualized scrolling.
- fix(FloatingFocusManager): prioritize returning focus to reference if available
- feat(useListNavigation): add `parentOrientation` prop

## 0.27.7

### Patch Changes

- fix(useTransitionStatus): avoid browser from painting before floating element opens. With `FloatingDelayGroup`, this avoids a flicker when moving between floating elements to ensure one is always open with no missing frames.
- fix(useListNavigation): correctly scroll to the selected item on open when using a pointer and `FloatingFocusManager` `initialFocus` is not in use
- fix(useHover): clean up blockPointerEvents when opened with click after hover
- fix(useRole): improve "combobox" role
- fix(useRole): handle custom id attributes
- feat: experimental `NextFloatingDelayGroup` (and `useNextFloatingDelayGroup`). Unlike `FloatingDelayGroup`, this component doesn't cause a re-render of unrelated consumers of the context when the delay changes, improving performance. This will eventually become the new default for `FloatingDelayGroup` in v1 (`Next`), as [its API is different](https://github.com/floating-ui/floating-ui/pull/3274).
- perf(FloatingFocusManager): ignore manual tabindex handling for non-dialog role floating elements
- fix(useHover): prevent floating element unexpectedly closing when close to reference element when not using `safePolygon()` and a close delay
- perf(useFloating): refactor `events` emitter
- fix(FloatingFocusManager): ensure floating elements with no tabbable content are assigned `tabIndex=0` when `initialFocus` is -1
- fix(useListNavigation): handle list navigation for nested lists with mixed orientation

## 0.27.6

### Patch Changes

- fix(useFloating): prevent error when using `inline` middleware when passing a real DOM element to `refs.setPositionReference` due to `element.getClientRects()` not being handled
- fix: avoid marking root ancestor combobox with `aria-hidden` when nested virtual floating element opens
- fix(FloatingFocusManager): set `inert` attribute value to empty string instead of `"true"`
- fix(FloatingFocusManager): correct tabbing to different document contexts
- fix(useClick): fix toggle behavior with Enter key when reference element is anchor
- feat(FloatingFocusManager): `getInsideElements` prop. Allows you to specify elements that are considered as "inside" the floating element. These will avoid being marked with `aria-hidden` and `data-floating-ui-inert` attributes.
- fix(useFocus): improve `:focus-visible` checks

## 0.27.5

### Patch Changes

- fix(FloatingFocusManager): return focus on outside press if possible for non-context nested floating elements
- perf: improve performance by only clearing used timeouts
- fix(useMergeRefs): support React 19 ref cleanup
- fix(FloatingFocusManager): avoid returning to unrelated references

## 0.27.4

### Patch Changes

- fix(useListNavigation): use parent's orientation when opening/closing nested menus, correctly supporting grid submenus
- fix(FloatingList): avoid race condition between registering/unregistering nodes and setting indices

## 0.27.3

### Patch Changes

- feat(FloatingFocusManager): accept `FloatingRootContext` as the `context` prop
- fix(useListNavigation): check for virtual pointer on pointerenter
- refactor: use jsx runtime
- Update dependencies: `@floating-ui/utils@0.2.9`

## 0.27.2

### Patch Changes

- fix(FloatingFocusManager): prevent stale `inert`/`aria-hidden` attributes from being left on outside elements

## 0.27.1

### Patch Changes

- fix(FloatingFocusManager): correctly fallback to container
- fix(FloatingFocusManager): check for ancestor floating focus element during `closeOnFocusOut`
- fix(FloatingFocusManager): avoid marking tree ancestor floating nodes with `data-floating-ui-inert` when `modal=false`

## 0.27.0

### Minor Changes

- chore: deprecate `inner` and `useInnerOffset`. This technique of aligning an inner element to the reference has poor performance with longer lists, doesn't fit with the middleware paradigm, doesn't work on touch, and has a better custom alternative using native `onScroll` that is encouraged instead.
- breaking: drop React 16 support. 17 is the minimum supported version.
- fix(useId): add `| undefined` return type for React 17

### Patch Changes

- feat(FloatingFocusManager): add `outsideElementsInert` prop. This enables pointer modality without a backdrop.
- perf(useListNavigation): simplify focusing to remove unneeded asynchronicity
- fix(useDismiss): allow native clicks to work with `referencePress`
- fix(useDismiss): read target `overflow` style for scrollbar press check. Fixes an issue where outside presses would be incorrectly prevented if the target element that was pressed appeared scrollable but was actually not.
- fix(FloatingFocusManager): check for 'safe-polygon' reason on return focus

## 0.26.28

### Patch Changes

- fix(Composite): change focus to be sync
- fix(useClick): improve consistency when combining with `useHover()`
- feat(useClick): add `stickIfOpen` prop to determine whether to remain open upon first click when first opened by another event
- feat(Composite): add RTL support
- fix(FloatingFocusManager): ensure `returnFocus` is ignored correctly when using `disabled` prop
- fix(useListNavigation): incorrect behaviour with RTL grid

## 0.26.27

### Patch Changes

- fix(useListNavigation): ignore Home/End key press for typeable combobox references
- fix(useListNavigation): ensure submenu references are set as `virtualItemRef` on floating close
- fix(inner): use list ref length for fallback detection
- fix(FloatingPortal): allow `root` to be reactive from `null` to an element

## 0.26.26

### Patch Changes

- fix(useFloating): access `domReference` instead of `reference`
- feat(FloatingFocusManager): specify element to return focus to

## 0.26.25

### Patch Changes

- fix(useListNavigation): handle virtual nested Home/End key press
- fix(useHover): ignore insignificant movement when resetting `restMs`
- fix(useListNavigation): ignore duplicate arrow navigation when composing
- feat(useDelayGroup): add `enabled` option
- fix(useDismiss): handle IME keydown events on Escape
- fix(inner): round `max-height` only if not scrollable

## 0.26.24

### Patch Changes

- fix(FloatingOverlay): correct multiple locks behavior on iOS
- fix(FloatingFocusManager): avoid returning focus to nearest tabbable element of the reference if it gets removed when the floating element closes to avoid unwanted focus effects of unrelated elements firing. Tab index context remains preserved if the floating element is portaled.
- refactor: use `React.JSX.Element` types. Ensure you've upgraded to the latest `@types/react` patches (versions since May 6, 2023)
- fix(FloatingArrow): avoid requiring leading space for manually specified `transform` style property
- fix(inner): round `maxHeight` and apply `minItemsVisible` only when scrollable
- Update dependencies: `@floating-ui/react-dom@2.1.2`, `@floating-ui/utils@0.2.8`

## 0.26.23

### Patch Changes

- feat: add `onOpenChange` reason string for `FloatingFocusManager`'s `closeOnFocusOut` handling
- fix(inner): correctly handle borders
- fix(FloatingArrow): ignore `staticOffset` prop if floating element is shifted. Fixes an issue where the arrow could potentially point to nothing if it was shifted enough from its reference element.
- fix(useListNavigation, Composite): prevent `onNavigate` from potentially passing in an `undefined` value instead of `null`
- fix(useHover): `blockPointerEvents` no longer adds `pointer-events: none` to unintended `<body>` elements.
- fix: manage focus on element with floating props spread on it
- fix(FloatingFocusManager): support keepMounted behavior with `disabled` prop

## 0.26.22

### Patch Changes

- Update dependencies: `@floating-ui/utils@0.2.7`

## 0.26.21

### Patch Changes

- Update dependencies: `@floating-ui/utils@0.2.6`

## 0.26.20

### Patch Changes

- fix: wrap `focus` call in `act` in `useFocus` tests
- fix: focus always mounted nested lists with listNavigation
- fix(FloatingFocusManager): return focus to next tabbable after reference element if removed after floating element opens without other previously focused elements to use
- fix(useListNavigation): avoid reading ref in render
- Update dependencies: `@floating-ui/utils@0.2.5`

## 0.26.19

### Patch Changes

- refactor: use `scrollX`/`scrollY` instead of deprecated `pageXOffset`/`pageYOffset`
- chore: fix internal dependency versioning
- Update dependencies: `@floating-ui/utils@0.2.4`

## 0.26.18

### Patch Changes

- fix(useInteractions): split prop getter dependencies so that only the relevant element changes when necessary. Previously `reference` and `floating` prop getters had dependencies grouped.
- fix(useFocus): prevent SyntheticEvent warning on React <17
- fix(inner): allow to make Derivable
- fix(FloatingFocusManager): correctly close floating element when tabbing out of a modal combobox reference
- fix(types): export `FloatingPortalProps`, `CompositeProps`, `CompositeItemProps`
- chore: fix internal deps
- fix(FloatingArrow): allow close transitions to play on floating element when grouped in instant phase
- fix(useHover): prevent unnecessary delayed opens to preserve potential click open events. Fixes an issue when combining `useHover` and `useClick` hooks and a click occurred before the floating element could open on hover, it would unexpectedly close on `mouseleave` despite being triggered by a click.
- refactor: improve types and internal codebase consistency. All documented types are now exported.
- Update dependencies: `@floating-ui/utils@0.2.3`

## 0.26.17

### Patch Changes

- fix(FloatingFocusManager): place fallback focus on element with floating props
- feat(FloatingFocusManager): `restoreFocus` prop. This enables automatic restoration of focus to the nearest tabbable element if the element that currently has focus inside the floating element is removed from the DOM.
- fix(useHover): fix restMs options throwing SyntheticEvent warning on React < 17

## 0.26.16

### Patch Changes

- fix(useListNavigation): correct `scrollIntoView` and `focus` behavior with virtual focus and inner DOM-focused element + `FloatingList`
- fix(FloatingPortal): prevent `undefined` id with unconditional rendering in React <18
- fix(useListNavigation): prevent `selectedIndex` changes from stealing focus
- fix(FloatingDelayGroup): prevent hydration error with Suspense
- fix(useListNavigation, Composite): correct index calculations for grid navigation with nullish and disabled items when `disabledIndices` is inferred
- perf(markOthers): avoid applying attributes to `script` tags needlessly
- Update dependencies: `@floating-ui/react-dom@2.1.0`

## 0.26.15

### Patch Changes

- fix(useTransitionStatus): guard `isMounted` check and remove unneeded initiated state. Prevents an infinite loop when called in a component with an unstable callback ref.

## 0.26.14

### Patch Changes

- feat: add `useFloatingRootContext` Hook, which enables calling interaction hooks in a component higher in the tree than `useFloating` is called in. This supports spreading reference props onto an "external" reference element.

## 0.26.13

### Patch Changes

- fix(FloatingFocusManager): return focus to reference when applicable even if not focused on open
- fix(types): simplify React types
- fix(types): replace `React_2` with `React` in generated .d.ts files
- fix(types): revert `React.JSX.Element` back to `JSX.Element`
- fix(useHover): `restMs` + nullish open delay should respect `restMs`

## 0.26.12

### Patch Changes

- fix(useFloating): external element synchronization with domReference and positionReference
- fix(useFloating): set `dataRef` `openEvent` property to `undefined` on close. Fixes a minor issue when `useHover` `restMs` is combined with `useClientPoint` and focus modality was used before hover modality.
- fix(useId): avoid import error in new bundlers when using React <18, and also ensure id collisions don't occur when multiple independent versions of Floating UI are used with React <18.

## 0.26.11

### Patch Changes

- fix(useHover): ensure `mouseOnly` is respected when `restMs` is specified. Also ensure `restMs` is always `0` for touch input.
- fix(types): export `FloatingOverlayProps`
- feat(useDelayGroup): return the `GroupContext` value from the Hook, and don't require an `id` option to be passed. You only need to invoke `useDelayGroup()` and read the context data from it. As a result, `useDelayGroupContext()` has been deprecated as it no longer needs to be used.

## 0.26.10

### Patch Changes

- fix(FloatingFocusManager): return focus to the first tabbable descendant of the reference element if the reference element itself is not focusable

## 0.26.9

### Patch Changes

- fix(useFocus): avoid closing floating element when focus moves inside shadow roots

## 0.26.8

### Patch Changes

- Update dependencies: `@floating-ui/react-dom@2.0.8`

## 0.26.7

### Patch Changes

- chore: improve JSDocs
- fix(FloatingPortal): unconditional rendering with Suspense
- Update dependencies: `@floating-ui/react-dom@2.0.7`

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
