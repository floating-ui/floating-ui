# @floating-ui/react-dom

## 2.1.6

### Patch Changes

- Update dependencies: `@floating-ui/dom@1.7.4`

## 2.1.5

### Patch Changes

- Update dependencies: `@floating-ui/dom@1.7.3`

## 2.1.4

### Patch Changes

- Update dependencies: `@floating-ui/dom@1.7.2`

## 2.1.3

### Patch Changes

- fix(useFloating): correct `transform` default doc (`@default true` instead of `@default false`)

## 2.1.2

### Patch Changes

- fix(useFloating): avoid setting `isPositioned` to true when `open` is false

## 2.1.1

### Patch Changes

- refactor: improve types and internal codebase consistency. All documented types are now exported.

## 2.1.0

### Minor Changes

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

## 2.0.9

### Patch Changes

- fix(types): replace `React_2` with `React` in generated .d.ts files

## 2.0.8

### Patch Changes

- Update dependencies: `@floating-ui/dom@1.6.1`

## 2.0.7

### Patch Changes

- Update dependencies: `@floating-ui/dom@1.6.0`

## 2.0.6

### Patch Changes

- d3a773b: fix: make `whileElementsMounted` reactive with respect from changing from a function to `undefined`

## 2.0.5

### Patch Changes

- 4c04669: chore: exports .d.mts types, solves #2472
- Updated dependencies [4c04669]
- Updated dependencies [0d18e37]
  - @floating-ui/dom@1.5.4

## 2.0.4

### Patch Changes

- 9d22d831: fix: package type import

## 2.0.3

### Patch Changes

- c1965f65: refactor: minor jsdoc/type improvements
