---
"@floating-ui/core": patch
---

fix(inline): use max group height as line-detection threshold in `getRectsByLine`

When a short rect (e.g. a superscript or small inline element) appears after a
taller rect within the same line group, `prevRect.height` becomes very small.
Subsequent rects that are still within the taller rect's vertical extent were
incorrectly placed in a new group because `prevRect.height / 2` was too small
a threshold.

Track the maximum rect height seen so far in the current group
(`maxGroupHeight`) and use that as the threshold instead of `prevRect.height`.
