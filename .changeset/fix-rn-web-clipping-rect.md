---
'@floating-ui/react-native': patch
---

fix(react-native): use window dimensions for clipping rect on iOS and web (no impact on Android. On web, it fixes the issue of middleware failing to detect overflow correctly, and on iOS, it fixes issue on iPad with custom window sizes.)
