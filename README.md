<p align="center">
  <img height="300" src="https://github.com/atomiks/floating-ui/blob/main/website/assets/logo.png" alt="Floating UI">
<p>
  
> **Popper is now Floating UI! For Popper v2, visit [its dedicated branch.](https://github.com/floating-ui/popper-core/tree/v2.x)**

[Website](https://floating-ui.com)

Floating UI is a low-level library for positioning "floating" elements like
tooltips, popovers, dropdowns, menus and more. Since these types of elements
float on top of the UI without disrupting the flow of content, challenges arise
when positioning them.

Floating UI exposes primitives which enable a floating element to be positioned
next to a given reference element while appearing in view for the user as best
as possible. Features include overflow prevention (or collision awareness),
placement flipping, and more.

- **Tiny**: 600-byte core with highly modular architecture for tree-shaking
- **Low-level**: Hyper-granular control over positioning behavior
- **Pure**: Predictable, side-effect free behavior
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

## React

- [React DOM](https://floating-ui.com/docs/react-dom)
- [React Native](https://floating-ui.com/docs/react-native) (\*experimental)

## Components

Right now, Floating UI focuses on positioning floating elements, but a package
that exposes higher-level primitives for building these elements more easily is
in development.

## Contributing

This project is a monorepo written in TypeScript using npm workspaces. The website
is using Next.js SSG and Tailwind CSS for styling.

- Clone the repo
- Install dependencies in root directory with `npm install`
- `npm run dev` in the root will launch the `@floating-ui/dom` development
  visual tests at `http://localhost:1234/spec`. You can fiddle around with each
  test file in `packages/dom/test/visual/spec/`. Reload the page to see your
  changes.

## License

MIT
