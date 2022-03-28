<p align="center">
  <img height="560" src="https://github.com/floating-ui/floating-ui/blob/master/website/assets/floating-ui-banner.png" alt="Floating UI">
<p>

> **Popper is now Floating UI! For Popper v2, visit
> [its dedicated branch.](https://github.com/floating-ui/floating-ui/tree/v2.x)**

[Floating UI](https://floating-ui.com) is a low-level library for creating
"floating" elements like tooltips, popovers, dropdowns, menus, and more.

The library provides two key functionalities:

- **Positioning primitives**: Ensure your floating element is positioned
  optimally in the viewport for the user (placement, overflow
  prevention/clipping detection, and more).
- **Interaction primitives**: Add accessible interactions that power floating
  elements (event listeners, dismissing, ARIA attributes, focus trapping, list
  navigation, and more).

The positioning engine features a tiny 600-byte core with strong tree-shaking
support, is extensible through custom middleware, and can support any platform.

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

## Development and production builds

Floating UI is published with default, development, and production builds, using
Node's support for
[export conditions](https://nodejs.org/api/packages.html#packages_conditional_exports).

- `"default"`: uses `process.env.NODE_ENV`, in which your bundler handles the
  env variable, dead code elimination, and minification
- `"production"`: minified with no debug logging
- `"development"`: unminified with debug logging

If you're using a bundler like webpack, Vite, or Parcel, this is handled for you
**automatically**.

If this is not handled, you must opt into one of the builds in tools that
support export conditions. This is done differently for each tool.

## Contributing

This project is a monorepo written in TypeScript using npm workspaces. The
website is using Next.js SSG and Tailwind CSS for styling.

- Fork and clone the repo
- Install dependencies in root directory with `npm install`
- Build initial package dist files with `npm run build`

### Testing grounds

`npm run dev` in the root will launch the `@floating-ui/dom` development visual
tests at `http://localhost:1234`. The playground uses React to write each test
route, bundled by Parcel. When making changes to `packages/core` or
`packages/dom`, Parcel will hot reload the app and display the changes.

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
