<p align="center">
  <img height="300" src="https://github.com/atomiks/floating-ui/blob/main/website/assets/logo.png" alt="Floating UI">
<p>
  
> **Popper is now Floating UI! For Popper v2, visit [its dedicated branch.](https://github.com/floating-ui/popper-core/tree/v2.x)**

[![Rolling Versions](https://img.shields.io/badge/Rolling%20Versions-Enabled-brightgreen)](https://rollingversions.com/floating-ui/floating-ui)

[Website](https://floating-ui.com)

Floating UI is a low-level library for positioning "floating" elements like
tooltips, popovers, dropdowns, menus and more while intelligently keeping them
in view.

Challenges arise when positioning floating elements as they get taken out of the
normal layout flow of a document, leading to issues with clipping and overflow,
which is where this library can help!

- **Tiny**: 600-byte core with highly modular architecture for tree-shaking
- **Low-level**: Granular control over positioning behavior
- **Pure**: Predictable and side-effect free
- **Extensible**: Powerful middleware system
- **Platform-agnostic**: Runs on any JavaScript environment which provides
  measurement APIs, including the web and React Native

## Installation

To use it on the web:

```shell
npm install @floating-ui/dom
```

```shell
yarn add @floating-ui/dom
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

Floating UI is published with default, development, and
production builds, using Node's support for
[export conditions](https://nodejs.org/api/packages.html#packages_conditional_exports).

- `"default"`: uses `process.env.NODE_ENV`, in which
  your bundler handles the env variable, dead code elimination,
  and minification
- `"production"`: minified with no debug logging
- `"development"`: unminified with debug logging

If you're using a bundler like webpack, Vite, or Parcel, this is
handled for you **automatically**.

If this is not handled, you must opt into one of the builds in
tools that support export conditions. This is done differently
for each tool.

## React

- [React DOM](https://floating-ui.com/docs/react-dom)
- [React Native](https://floating-ui.com/docs/react-native) (\*experimental)

## Components

Right now, Floating UI focuses on positioning floating elements, but a package
that exposes higher-level primitives for building these elements more easily is
in development.

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

### Website

`npm -w website run dev` in the root will launch the website at
`localhost:3000`.

## License

MIT
