---
"@floating-ui/react-dom": minor
"@floating-ui/dom": minor
"@floating-ui/vue": minor
"@floating-ui/react": patch
---

feat: export `topLayer` platform method to handle positioning for CSS `:top-layer` elements (e.g. native dialogs/popovers) when inside a containing block (such as a `transform` style on an ancestor). Pass it to the `platform` option for `computePosition` or `useFloating`.

```js
import {platform, topLayer} from '@floating-ui/dom';

// or `useFloating`
computePosition(referenceEl, floatingEl, {
  platform: {
    ...platform,
    topLayer,
  }
});
```
