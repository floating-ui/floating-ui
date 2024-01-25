---
'@floating-ui/core': minor
'@floating-ui/dom': minor
---

fix: handle CSS `:top-layer` elements inside containing blocks. It's no longer
necessary to implement the middleware workaround outlined in
https://github.com/floating-ui/floating-ui/issues/1842#issuecomment-1872653245.
