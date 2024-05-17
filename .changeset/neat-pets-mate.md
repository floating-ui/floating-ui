---
'@floating-ui/react-dom': minor
'@floating-ui/react-native': patch
---

feat: support dependency array as a second argument of all middleware. This ensures stateful options can be kept reactive when making them derived (passing a function that returns the options):

```js
const [value, setValue] = React.useState(0);

const offset1 = offset(value); // reactive
const offset2 = offset(() => value); // NOT reactive
const offset3 = offset(() => value, [value]); // reactive
```
