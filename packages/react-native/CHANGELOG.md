# @floating-ui/react-native

## 0.10.7

### Patch Changes

- fix: correctly calculate y-coordinate on Android

## 0.10.6

### Patch Changes

- fix(types): re-export all missing core types
- feat: support dependency array as a second argument of all middleware. This ensures stateful options can be kept reactive when making them derived (passing a function that returns the options):

```js
const [value, setValue] = React.useState(0);

const offset1 = offset(value); // reactive
const offset2 = offset(() => value); // NOT reactive
const offset3 = offset(() => value, [value]); // reactive
```

This also includes `size`'s `apply` function:

```js
size(
  {
    apply() {
      value; // reactive
    },
  },
  [value],
);
```

## 0.10.5

### Patch Changes

- fix(types): replace `React_2` with `React` in generated .d.ts files

## 0.10.4

### Patch Changes

- Update dependencies: `@floating-ui/core@1.6.0`

## 0.10.3

### Patch Changes

- 7d201f7: fix: check for virtual elements when measuring

## 0.10.2

### Patch Changes

- 4c04669: chore: exports .d.mts types, solves #2472
- Updated dependencies [4c04669]
  - @floating-ui/core@1.5.3
