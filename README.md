<p align="center">
  <img src="./docs/src/images/popper-logo.svg" alt="Popper" height="300px"/>
</p>

**Positioning tooltips is difficult. Popper is here to help!**

Given an element, such as a button, and a tooltip element describing it, Popper
will automatically put the tooltip in the right place near the button.

But Popper is not just about tooltips. It will position _any_ UI element that
"pops out" from the flow of your document. The most common example is a tooltip,
but it also includes popovers, drop-downs, and more. All of these can be
generically described as a "popper element".

## Why Popper?

Naive tooltip implementations generally don't consider the following:

- Preventing overflow when the tooltip is near a boundary (e.g. window), it will
  get cut off;
- Flipping to keep the tooltip visible in the viewport for the user;
- Keeping the tooltip with the reference element when inside any number of
  scrolling containers;
- Keeping the tooltip in its original DOM context

Popper solves all of these key problems in an elegant, performant manner. It is
a ~3 kB library that aims to provide a reliable and extensible positioning
engine you can use to ensure all your popper elements are positioned in the
right place.

Why waste your time writing your own logic every time you are programming a
tooltip? There are many edge cases that are easy to forget to consider, which is
why we've done the hard work for you.

Since we write UIs using powerful abstraction libraries such as React or Angular
nowadays, you'll also be glad to know Popper can fully integrate with them and
be a good citizen together with your other components. Check out `react-popper`
for the official Popper wrapper for React.

## Installation

### 1. Package Manager

```bash
# With npm
npm i @popperjs/core

# With Yarn
yarn add @popperjs/core
```

### 2. CDN

```html
<script src="https://unpkg.com/@popperjs/core@2.0.0-rc.3"></script>
```

### 3. Direct Download?

Managing dependencies by "directly downloading" them and placing them into your
source code is not recommended for a variety of reasons, including missing out
on feat/fix updates easily. Please, use a versioning management system like a
CDN or npm/Yarn.

## Usage

The most straightforward way to get started is to import Popper from the `unpkg`
CDN, which includes all of its features. You can call the `Popper.createPopper`
constructor to create new popper instances.

Here is a complete example:

```html
<!DOCTYPE html>
<title>Popper example</title>

<style>
  #tooltip {
    background-color: rebeccapurple;
    padding: 20px;
    width: 200px;
  }
</style>

<button type="button" id="button">I'm a button</button>
<div id="tooltip">I'm a tooltip</div>

<script src="https://unpkg.com/@popperjs/core@2.0.0-rc.3"></script>
<script>
  const button = document.querySelector('#button');
  const tooltip = document.querySelector('#tooltip');

  // Pass the button, the tooltip, and some options, and Popper will do the
  // magic positioning for you:
  Popper.createPopper(button, tooltip, {
    placement: 'right',
  });
</script>
```

### Module bundlers

You can import the `createPopper` constructor from the fully-featured file:

```js
import { createPopper } from '@popperjs/core';

const button = document.querySelector('#button');
const tooltip = document.querySelector('#tooltip');

// Pass the button, the tooltip, and some options, and Popper will do the
// magic positioning for you:
createPopper(button, tooltip, {
  placement: 'right',
});
```

All the modifiers listed in the docs menu will be enabled and "just work", so
you don't need to think about setting Popper up. The size of Popper including
all of its features is about 5 kB minzipped, but it may grow a bit in the
future.

#### Popper Lite (tree-shaking)

If bundle size is important, you'll want to take advantage of tree-shaking. The
library is built in a modular way to allow to import only the parts you really
need.

```js
import { createPopper } from '@popperjs/core/lib/popper-lite.js';
```

The Lite version includes the most necessary modifiers that will compute the
offsets of the popper, compute and add the positioning styles, and add event
listeners. This is close in bundle size to pure CSS tooltip libraries, and
behaves somewhat similarly.

However, this does not include the features that makes Popper truly useful.

The two most useful modifiers not included in Lite are `preventOverflow` and
`flip`:

```js
import { createPopper } from '@popperjs/core/lib/popper-lite.js';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js';
import flip from '@popperjs/core/lib/modifiers/flip.js';

const button = document.querySelector('#button');
const tooltip = document.querySelector('#tooltip');

createPopper(button, tooltip, {
  modifiers: [preventOverflow, flip],
});
```

As you make more poppers, you may be finding yourself needing other modifiers
provided by the library.

## Distribution targets

Popper is distributed in 3 different versions, in 3 different file formats.

The 3 file formats are:

- `esm` (works with `import` syntax — **recommended**)
- `umd` (works with `<script>` tags or RequireJS)
- `cjs` (works with `require()` syntax)

There are two different `esm` builds, one for bundler consumers (e.g. webpack,
Rollup, etc..), which is located under `/lib`, and one for browsers with native
support for ES Modules, under `/dist/esm`. The only difference within the two,
is that the browser-compatible version doesn't make use of
`process.env.NODE_ENV` to run development checks.

The 3 versions are:

- `popper`: includes all the modifiers (features) in one file (**default**);
- `popper-lite`: includes only the minimum amount of modifiers to provide the
  basic functionality;
- `popper-base`: doesn't include any modifier, you must import them separately;

Below you can find the size of each version, minified and compressed with the
[Brotli compression algorithm](https://medium.com/groww-engineering/enable-brotli-compression-in-webpack-with-fallback-to-gzip-397a57cf9fc6):

<!-- Don't change the labels to use hyphens, it breaks, even when encoded -->

![](https://badge-size.now.sh/https://unpkg.com/@popperjs/core/dist/umd/popper.min.js?compression=brotli&label=popper)
![](https://badge-size.now.sh/https://unpkg.com/@popperjs/core/dist/umd/popper-lite.min.js?compression=brotli&label=popper%20lite)
![](https://badge-size.now.sh/https://unpkg.com/@popperjs/core/dist/umd/popper-base.min.js?compression=brotli&label=popper%20base)

## Hacking the library

If you want to play with the library, implement new features, fix a bug you
found, or simply experiment with it, this section is for you!

First of all, make sure to have
[Yarn installed](https://yarnpkg.com/lang/en/docs/install).

Install the development dependencies:

```bash
yarn install
```

And run the development environment:

```bash
yarn dev
```

Then, simply open one the development server web page:

```bash
# macOS and Linux
open localhost:5000

# Windows
start localhost:5000
```

From there, you can open any of the examples (`.html` files) to fiddle with
them.

Now any change you will made to the source code, will be automatically compiled,
you just need to refresh the page.

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

You can run them with `yarn test:functional`. Set the `PUPPETEER_BROWSER`
environment variable to `firefox` to run them on the Mozilla browser.

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
