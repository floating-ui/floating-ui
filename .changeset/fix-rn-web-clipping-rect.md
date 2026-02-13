---
"@floating-ui/react-native": patch
---

fix(react-native): use window dimensions for clipping rect on React Native Web

On React Native Web, Dimensions.get('screen') returns full monitor size while Dimensions.get('window') returns the viewport. When screen and window differ (e.g. devtools open), flip/autoPlacement middleware failed to detect overflow. Now uses window dimensions on web only; native Android/iOS logic unchanged.
