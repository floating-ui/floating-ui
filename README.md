<!-- <HEADER> // IGNORE IT -->
<p align="center">
  <img src="https://rawcdn.githack.com/popperjs/popper-core/8805a5d7599e14619c9e7ac19a3713285d8e5d7f/docs/src/images/popper-logo-outlined.svg" alt="Popper" height="300px"/>
</p>

<div align="center">
  <h1>Tooltip & Popover Positioning Engine</h1>
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/@popperjs/core">
    <img src="https://img.shields.io/npm/v/@popperjs/core?style=for-the-badge" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/@popperjs/core">
    <img src="https://img.shields.io/endpoint?style=for-the-badge&url=https://runkit.io/fezvrasta/combined-npm-downloads/1.0.0?packages=popper.js,@popperjs/core" alt="npm downloads per month (popper.js + @popperjs/core)" />
  </a>
  <a href="https://rollingversions.com/popperjs/popper-core">
    <img src="https://img.shields.io/badge/Rolling%20Versions-Enabled-brightgreen?style=for-the-badge" alt="Rolling Versions" />
  </a>
</p>

<br />
<!-- </HEADER> // NOW BEGINS THE README -->

Popper is a low-level, pure, and functional positioning engine for "poppers" —
floating elements which are positioned relative to another element (such as
tooltips, popovers, dropdowns, and more).

Its sole goal is to correctly position your floating element next to a given
reference (or target) element. It has no opinions on how those elements function
regarding their behavior. Positioning these elements correctly in any scenario
is the difficult part, which is the focus of this library!

- **Platform-agnostic:** runs anywhere JavaScript does: the web, React Native,
  etc.
- **Unopinionated:** Popper employs an inversion-of-control API, leaving the
  application of styles up to you. It only calculates the necessary coordinates
  and provides useful data for you to use.
- **Highly extensible:** modify the positioning coordinates or add any data via
  modifiers.
- **Tree-shakeable:** tiny 600B core with a highly modular architecture, keeping
  your JavaScript bundles small.
- **Gradual adoption:** Add features as you need them, no unexpected or
  hard-to-configure positioning logic.

## Demo

[![Popper visualized](https://i.imgur.com/F7qWsmV.jpg)](https://popper.js.org)

## Docs

- [v3.x (latest)](https://popper.js.org/docs/v3/)
- [v2.x](https://popper.js.org/docs/v2/)
- [v1.x](https://popper.js.org/docs/v1/)

### Migration

- [Migrate from Popper 2 to Popper 3](https://popper.js.org/docs/v3/migration-guide/)
- [Migrate from Popper 1 to Popper 2](https://popper.js.org/docs/v2/migration-guide/)

To contribute to the Popper website and documentation, please visit the
[dedicated repository](https://github.com/popperjs/website).

## Why not use pure CSS?

- **Clipping and overflow issues**: Pure CSS poppers will not be prevented from
  overflowing clipping boundaries, such as the viewport. It will get partially
  cut off or overflows if it's near the edge since there is no dynamic
  positioning logic. When using Popper, your popper will always be positioned in
  the right place without needing manual adjustments.
- **No flipping**: CSS poppers will not flip to a different placement to fit
  better in view if necessary. While you can manually adjust for the main axis
  overflow, this feature cannot be achieved via CSS alone. Popper automatically
  flips the tooltip to make it fit in view as best as possible for the user.
- **No virtual positioning**: CSS poppers cannot follow the mouse cursor or be
  used as a context menu. Popper allows you to position your tooltip relative to
  any coordinates you desire.
- **Slower development cycle**: When pure CSS is used to position popper
  elements, the lack of dynamic positioning means they must be carefully placed
  to consider overflow on all screen sizes. In reusable component libraries,
  this means a developer can't just add the component anywhere on the page,
  because these issues need to be considered and adjusted for every time. With
  Popper, you can place your elements anywhere and they will be positioned
  correctly, without needing to consider different screen sizes, layouts, etc.
  This massively speeds up development time because this work is automatically
  offloaded to Popper.
- **Lack of extensibility**: CSS poppers cannot be easily extended to fit any
  arbitrary use case you may need to adjust for. Popper is built with
  extensibility in mind.

## Why Popper?

With the CSS drawbacks out of the way, we now move on to Popper in the
JavaScript space itself.

Naive JavaScript tooltip implementations usually have the following problems:

- **Scrolling containers**: They don't ensure the tooltip stays with the
  reference element while scrolling when inside any number of scrolling
  containers.
- **DOM context**: They often require the tooltip move outside of its original
  DOM context because they don't handle `offsetParent` contexts.
- **Compatibility**: Popper handles an incredible number of edge cases regarding
  different browsers and environments (mobile viewports, RTL, scrollbars enabled
  or disabled, etc.). Popper is a popular and well-maintained library, so you
  can be confident positioning will work for your users on any device.
- **Configurability**: They often lack advanced configurability to suit any
  possible use case.
- **Size**: They are usually relatively large in size, or require an ancient
  jQuery dependency.
- **Performance**: They often have runtime performance issues and update the
  tooltip position too slowly.

Popper solves all of these key problems in an elegant, performant manner.

## Installation

### 1. Package Manager

```bash
# With npm
npm i @popperjs/dom

# With Yarn
yarn add @popperjs/dom
```

### 2. CDN

```html
<!-- Development version -->
<script src="https://unpkg.com/@popperjs/core@3/dist/popper-core.js"></script>
<script src="https://unpkg.com/@popperjs/dom@3/dist/popper-dom.js"></script>

<!-- Production version -->
<script src="https://unpkg.com/@popperjs/core@3"></script>
<script src="https://unpkg.com/@popperjs/dom@3"></script>
```

### 3. Direct Download?

Managing dependencies by "directly downloading" them and placing them into your
source code is not recommended for a variety of reasons, including missing out
on feat/fix updates easily. Please use a versioning management system like a CDN
or npm/Yarn.

## Usage

The most straightforward way to get started is to import Popper from the `unpkg`
CDN.

Here is a complete example:

```html
<!DOCTYPE html>
<title>Popper example</title>

<style>
  #tooltip {
    background-color: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 13px;
  }
</style>

<button id="button" aria-describedby="tooltip">I'm a button</button>
<div id="tooltip" role="tooltip">I'm a tooltip</div>

<script src="https://unpkg.com/@popperjs/core@3"></script>
<script src="https://unpkg.com/@popperjs/dom@3"></script>
<script>
  const button = document.querySelector('#button');
  const tooltip = document.querySelector('#tooltip');

  function applyStyles({ x = 0, y = 0, strategy = 'absolute' }) {
    Object.assign(tooltip.style, {
      position: strategy,
      left: `${x}px`,
      top: `${y}px`,
    });
  }

  applyStyles(); // Initial styles to avoid inline/layout-related positioning.
  PopperDOM.computePosition(button, tooltip).then(applyStyles);
</script>
```

This will place the popper element to the right of the reference element,
centered. It does not include any of the functionality that makes Popper a
better solution than CSS, which is where the incremental adoption of features
comes into play.

To learn these features with a practical example, visit the
[tutorial](https://popper.js.org/docs/v2/tutorial/) for an example of how to
build your own tooltip from scratch using Popper!

### Module bundlers

Import `position` from `@popperjs/dom` to use it on the web:

```js
import { computePosition } from '@popperjs/dom';

const button = document.querySelector('#button');
const tooltip = document.querySelector('#tooltip');

function applyStyles({ x = 0, y = 0, strategy = 'absolute' }) {
  Object.assign(tooltip.style, {
    position: strategy,
    left: `${x}px`,
    top: `${y}px`,
  });
}

applyStyles();
computePosition(button, tooltip).then(applyStyles);
```

### React Native

**Status: Experimental**

Support for React Native is currently in early development.

```js
import { View, Text } from 'react-native';
import { usePopper } from '@popperjs/react-native';

function App() {
  const { reference, popper } = usePopper();

  return (
    <View>
      <View ref={reference}>
        <Text>Reference</Text>
      </View>
      <View ref={popper}>
        <Text>Popper</Text>
      </View>
    </View>
  );
}
```

#### Return

`usePopper` returns the following object:

```js
type UsePopperReturn = {|
  // @popperjs/core `computePosition()` return type, includes x & y coords,
  // `modifiersData`, and `strategy`.
  ...PositionReturn,
  placement: ?Placement,
  // The popper's `offsetParent` if not contained within the base App root.
  offsetParent: {| current: any |},
  popper: {| current: any |},
  reference: {| current: any |},
  // Apply to the <ScrollView /> in which the reference element is contained,
  // if the popper is not also within it.
  scrollProps: {|
    onScroll: (event: {
      nativeEvent: {
        contentOffset: {| x: number, y: number |},
      },
    }) => void,
    scrollEventThrottle: 16,
  |},
|};
```

#### Options

These options can be passed to `usePopper`:

```js
type Options = {
  placement: Placement, // default: "bottom"
  modifiers: Array<Modifiers>, // default: []
  // If the Popper is contained within the same <ScrollView /> as the
  // reference element.
  sameScrollView: boolean, // default: true
};
```

## Hacking the library

If you want to play with the library, implement new features, fix a bug you
found, or simply experiment with it, this section is for you!

First of all, make sure to have
[Yarn 3 installed](https://yarnpkg.com/getting-started/migration).

Install the development dependencies in the workspace root:

```bash
yarn install
```

And run the development environment:

```bash
yarn workspace @popperjs/dom dev
```

Then, open the development server in your browser:

```bash
# macOS and Linux
open localhost:1234

# Windows
start localhost:1234
```

From there, you can open any of the examples (`.html` files) to fiddle with
them.

Now any change you make to the source code will be compiled by Rollup
automatically, you just need to refresh the page.

If the page is not working properly, try to go in _"Developer Tools >
Application > Clear storage"_ and click on "_Clear site data_".  
To run the examples you need a browser with
[JavaScript modules via script tag support](https://caniuse.com/#feat=es6-module).

## Test Suite

Popper is currently tested with unit tests, and functional tests. Both of them
are run by Jest.

### Unit Tests

The unit tests use JSDOM to provide a primitive document object API, they are
used to ensure the utility functions behave as expected in isolation.

### Functional Tests

The functional tests run with Puppeteer, to take advantage of a complete browser
environment. They are currently running on Chromium, and Firefox.

You can run them with `yarn workspace @popperjs/dom test:functional`. Set the
`PUPPETEER_BROWSER` environment variable to `firefox` to run them on the Mozilla
browser.

The assertions are written in form of image snapshots, so that it's easy to
assert for the correct Popper behavior without having to write a lot of offsets
comparisons manually.

You can mark a `*.test.js` file to run in the Puppeteer environment by
prepending a `@jest-environment puppeteer` JSDoc comment to the interested file.

Here's an example of a basic functional test:

```js
/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it('should position the popper on the right', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/basic.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
```

You can find the complete
[`jest-puppeteer` documentation here](https://github.com/smooth-code/jest-puppeteer#api),
and the
[`jest-image-snapshot` documentation here](https://github.com/americanexpress/jest-image-snapshot#%EF%B8%8F-api).

## License

MIT
