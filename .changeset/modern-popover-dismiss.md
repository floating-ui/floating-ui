---
"@floating-ui/react": patch
---

fix(useDismiss): avoid skipping outside-press dismissal when the target shares the same root ancestor as the floating element

When a floating element is rendered inline inside a modal portal (e.g. a Popover without its own `FloatingPortal` placed inside a `FloatingFocusManager` modal), pressing a sibling element outside the floating element was misidentified as a third-party element injected after the floating element rendered. This prevented the floating element from being dismissed. The root cause is that the target's root ancestor (the portal container) contained no `data-floating-ui-inert` markers, since the markers only live on subtrees outside the modal's portal. The fix adds a check so that when the target root ancestor contains the floating element, the press is treated as a normal outside press instead of being ignored.
