---
"@floating-ui/utils": patch
---

fix(utils): deduplicate `getExpandedPlacements` result for base placements

`getExpandedPlacements` called with a non-aligned placement (e.g. `'top'`)
returned the original placement itself and a duplicate entry
(`['top', 'bottom', 'bottom']`). This happens because
`getOppositeAlignmentPlacement` is a no-op when there is no alignment suffix,
causing both the first and third elements to equal `'top'` and `'bottom'`
respectively.

The fix filters out the input placement and removes duplicates so that
`getExpandedPlacements('top')` now correctly returns `['bottom']`.
Aligned placements are unaffected.
