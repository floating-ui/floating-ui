---
'@floating-ui/react-native': patch
---

fix(react-native): use window dimensions for clipping rect on iOS and web (no impact on Android. On web, it fixes the issue of flip/autoPlacement middleware failing to detect overflow, and on iOS, it fixes issue on iPad with custom window sizes.)
