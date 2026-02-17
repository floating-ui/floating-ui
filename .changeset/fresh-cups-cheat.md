---
'@floating-ui/react-native': minor
---

breaking: rename `sameScrollView` to `measureInWindow` and default it to `true`; on Android, `measureInWindow: false` is broken due to upstream React Native measurement issues ([react-native#29712 comment](https://github.com/facebook/react-native/issues/29712#issuecomment-1086475698), [floating-ui#2904](https://github.com/floating-ui/floating-ui/issues/2904)).
