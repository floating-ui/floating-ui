---
'@floating-ui/react-native': patch
---

fix: use viewport coordinates for overflow detection when a native reference and floating element share a parent. Account for the measured parent origin without changing parent-relative positioning, and keep the clipping rectangle at the viewport origin when scrolling.
