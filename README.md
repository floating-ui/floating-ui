# PopperJS

Positioning tooltips (_but also dropdowns, popovers, and more_) has always been particularly painful.

**PopperJS** is here to help.

Give it a reference element (such as a button) and a popper element (your tooltip) and it will automatically put your tooltip in the right place.

PopperJS is a ~3 kB library that aims to provide a reliable and extensible positioning engine you can use to build your awesome UI. Why waste your time writing your own logic every time you are programming a tooltip?

This library can position any pair of elements in your document without needing to alter the DOM in any way. It doesn't care if your elements are not close to each other or are in two different scrolling containers, they will always end up in the right position.

But wait, it's not 1993 anymore, nowadays we write UIs using powerful abstraction libraries such as React or Angular. You'll be glad to know PopperJS can fully integrate with them and be a good citizen together with your other components. Check out [`react-popper`](https://github.com/FezVrasta/react-popper) for the official PopperJS wrapper for React.

## Installation:

```bash
yarn add popper.js@next

# or

npm install popper.js@next
```

## Usage

```js
// Get your elements
const element = document.querySelector('#button');
const popper = document.querySelector('#tooltip');

// Let PopperJS do the magic!
new Popper(element, popper, { placement: 'right' });
```

## Hacking the library

If you want to play with the library, implement new features, fix a bug you found, or simply experiment with it, this section is for you!

First of all, make sure to have [Yarn installed](https://yarnpkg.com/lang/en/docs/install).

Install the development dependencies:

```
yarn install
```

And run the development environment:

```
yarn dev
```

Then, simply open one the development server web page:

```
# macOS and Linux
open localhost:5000

# Windows
start localhost:5000
```

From there, you can open any of the examples (`.html` files) to fiddle with them.

Now any change you will made to the source code, will be automatically
compiled, you just need to refresh the page.

If the page is not working properly, try to go in _"Developer Tools > Application > Clear storage"_ and click on "_Clear site data_".  
To run the examples you need a browser with [JavaScript modules via script tag support](https://caniuse.com/#feat=es6-module).
