<p align="center">
  <img max-height="560" src="https://github.com/floating-ui/floating-ui/blob/master/website/assets/floating-ui-banner.png" alt="Floating UI">
<p>

> **Popper is now Floating UI! For Popper v2, visit
> [its dedicated branch.](https://github.com/floating-ui/floating-ui/tree/v2.x)**

[Floating UI](https://floating-ui.com) is a tiny, low-level library for creating
"floating" elements like tooltips, popovers, dropdowns, menus, and more.

The library provides two key functionalities:

### 1. Anchored positioning primitives

CSS is currently missing a feature called “anchored positioning” — the ability
to anchor an element (like a tooltip) to another one (like a button) while
simultaneously keeping it in view as best as possible by avoiding clipping and
overflow.

Attempting to do fully dynamic anchored positioning with today’s plain CSS is
not possible. Floating UI provides a JavaScript implementation of this feature.

### 2. User interaction primitives

When creating a popover, dropdown menu, select, or combobox component that
follows WAI-ARIA authoring practices, the complexity increases dramatically.
Focus traps, indexed navigation, and typeahead are difficult to get right.

This functionality is currently available for React DOM but will be made
agnostic in the future.

## Install

Choose the package that suits you.

### Vanilla DOM positioning engine

Use with vanilla JavaScript or a non-React framework
([view tutorial](https://floating-ui.com/docs/tutorial)).

```shell
npm install @floating-ui/dom
```

### React DOM positioning engine

Use with React DOM ([view docs](https://floating-ui.com/docs/react-dom)).

```shell
npm install @floating-ui/react-dom
```

### React DOM interactions and positioning engine

Primitive hooks and components, in addition to the positioning engine, to use
with React DOM
([view docs](https://floating-ui.com/docs/react-dom-interactions)).

```shell
npm install @floating-ui/react-dom-interactions
```

### React Native positioning engine

Use with React Native ([view docs](https://floating-ui.com/docs/react-native)).

```shell
npm install @floating-ui/react-native
```

### Canvas or other platforms

Learn about creating a [Platform](https://floating-ui.com/docs/platform).

```shell
npm install @floating-ui/core
```

## Quick start

```js
import {computePosition} from '@floating-ui/dom';

const referenceElement = document.querySelector('#button');
const floatingElement = document.querySelector('#tooltip');

function applyStyles({x = 0, y = 0, strategy = 'absolute'}) {
  Object.assign(floatingElement.style, {
    position: strategy,
    left: `${x}px`,
    top: `${y}px`,
  });
}

applyStyles();

computePosition(referenceElement, floatingElement, {
  placement: 'right',
}).then(applyStyles);
```

[Visit the docs for detailed information](https://floating-ui.com/docs/computePosition).

## Package entry points

> Using webpack, Vite, or Parcel? Skip this section as modern bundlers handle
> this for you.

Floating UI uses `process.env.NODE_ENV` to determine whether your build is in
development or production mode. This allows us to add console warnings and
errors during development to help you but ensure they get stripped out in
production to keep the bundle size small.

This causes an error in Rollup and low/no-build setups. To solve this, Floating
UI exports browser-ready ES modules. Leverage the "browser" package export
condition to use these modules.

<details>
  <summary>Rollup example</summary>

The `browser` option in the `nodeResolve()` plugin will select browser versions
of packages if available.

```js
import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
  // ...
  plugins: [
    nodeResolve({
      browser: true,

      // Add this line for development config, omit for
      // production config
      exportConditions: ['development'],
    }),
  ],
};
```

</details>

## Contributing

This project is a monorepo written in TypeScript using npm workspaces. The
website is using Next.js SSG and Tailwind CSS for styling.

- Fork and clone the repo
- Install dependencies in root directory with `npm install`
- Build initial package dist files with `npm run build`

### Testing grounds

`npm -w packages/dom run dev` in the root will launch the `@floating-ui/dom`
development visual tests at `http://localhost:1234`. The playground uses React
to write each test route, bundled by Parcel.

Each route has screenshots taken of the page by Playwright to ensure all the
functionalities work as expected; this is an easy, reliable and high-level way
of testing the code.

Below the main container are UI controls to turn on certain state and options.
Every single combination of state is tested visually via the snapshots to cover
as much as possible.

## Credits

The floating shapes in the banner image are made by the amazing artists
[@artstar3d](https://figma.com/@artstar3d),
[@killnicole](https://figma.com/@killnicole) and
[@liiiiiiii](https://www.figma.com/@liiiiiii) on Figma — check out their work!

## License

MIT
