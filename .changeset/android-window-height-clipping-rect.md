---
'@floating-ui/react-native': patch
---

fix(react-native): use window dimensions for clipping rect across platforms, improving middleware overflow behavior on web/iOS and avoiding oversized clipping rects on Android.
