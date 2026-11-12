---
'@floating-ui/react-native': patch
---

fix(android): omit redundant `StatusBar.currentHeight` adjustment on React Native 0.86+ where `measureInWindow` already includes the status bar height
