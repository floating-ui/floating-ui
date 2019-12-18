<!-- IGNORE THE HTML BLOCK BELOW, THE INTERESTING PART IS AFTER IT -->

<h1 align="center">Popper.js</h1>

<p align="center">
    <strong>A library used to position poppers in web applications.</strong>
</p>

<p align="center">
    <img src="https://badge-size.now.sh/https://unpkg.com/popper.js/dist/popper.min.js?compression=brotli" alt="Stable Release Size"/>
  <img src="https://badge-size.now.sh/https://unpkg.com/popper.js/dist/popper.min.js?compression=gzip" alt="Stable Release Size"/>
    <a href="https://codeclimate.com/github/FezVrasta/popper.js/coverage"><img src="https://codeclimate.com/github/FezVrasta/popper.js/badges/coverage.svg" alt="Istanbul Code Coverage"/></a>
    <a href="https://www.npmjs.com/browse/depended/popper.js"><img src="https://badgen.net/npm/dependents/popper.js" alt="Dependents packages" /></a>
    <a href="https://spectrum.chat/popper-js" target="_blank"><img src="https://img.shields.io/badge/chat-on_spectrum-6833F9.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyBpZD0iTGl2ZWxsb18xIiBkYXRhLW5hbWU9IkxpdmVsbG8gMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAgOCI%2BPGRlZnM%2BPHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7fTwvc3R5bGU%2BPC9kZWZzPjx0aXRsZT5zcGVjdHJ1bTwvdGl0bGU%2BPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNSwwQy40MiwwLDAsLjYzLDAsMy4zNGMwLDEuODQuMTksMi43MiwxLjc0LDMuMWgwVjcuNThhLjQ0LjQ0LDAsMCwwLC42OC4zNUw0LjM1LDYuNjlINWM0LjU4LDAsNS0uNjMsNS0zLjM1UzkuNTgsMCw1LDBaTTIuODMsNC4xOGEuNjMuNjMsMCwxLDEsLjY1LS42M0EuNjQuNjQsMCwwLDEsMi44Myw0LjE4Wk01LDQuMThhLjYzLjYzLDAsMSwxLC42NS0uNjNBLjY0LjY0LDAsMCwxLDUsNC4xOFptMi4xNywwYS42My42MywwLDEsMSwuNjUtLjYzQS42NC42NCwwLDAsMSw3LjE3LDQuMThaIi8%2BPC9zdmc%2B" alt="Get support or discuss"/></a>
    <br />
    <a href="https://travis-ci.org/FezVrasta/popper.js/branches" target="_blank"><img src="https://travis-ci.org/FezVrasta/popper.js.svg?branch=master" alt="Build Status"/></a>
    <a href="https://saucelabs.com/u/popperjs" target="_blank"><img src="https://badges.herokuapp.com/browsers?labels=none&googlechrome=latest&firefox=latest&microsoftedge=latest&iexplore=11,10&safari=latest" alt="SauceLabs Reports"/></a>
</p>

<img src="https://raw.githubusercontent.com/FezVrasta/popper.js/master/popperjs.png" align="right" width=250 />

<!-- 🚨 HEY! HERE BEGINS THE INTERESTING STUFF 🚨 -->

> Popper 2 is coming! Check out its [README here](https://github.com/popperjs/popper.js/tree/next), the issue tracker is now tracking the work needed to release this new version.

## Wut? Poppers?

A popper is an element on the screen which "pops out" from the natural flow of your application.  
Common examples of poppers are tooltips, popovers, and drop-downs.

## So, yet another tooltip library?

Well, basically, **no**.  
Popper.js is a **positioning engine**; its purpose is to calculate the position of an element
to make it possible to position it near a given reference element.

The engine is completely modular, and most of its features are implemented as **modifiers**
(similar to middlewares or plugins).  
The whole code base is written in ES2015, and its features are automatically tested on real browsers thanks to [SauceLabs](https://saucelabs.com/) and [TravisCI](https://travis-ci.org/).

Popper.js has zero dependencies. No jQuery, no LoDash, nothing.  
It's used by big companies like [Twitter in Bootstrap v4](https://getbootstrap.com/), [Microsoft in WebClipper](https://github.com/OneNoteDev/WebClipper), and [Atlassian in AtlasKit](https://aui-cdn.atlassian.com/atlaskit/registry/).

### Popper.js

This is the engine, the library that computes and, optionally, applies the styles to
the poppers.

Some of the key points are:

- Position elements keeping them in their original DOM context (doesn't mess with your DOM!);
- Allows to export the computed information to integrate with React and other view libraries;
- Supports Shadow DOM elements;
- Completely customizable thanks to the modifiers based structure;

Visit our [project page](https://fezvrasta.github.io/popper.js) to see a lot of examples of what you can do with Popper.js!

Find [the documentation here](docs/_includes/popper-documentation.md).

## Installation

Popper.js is available on the following package managers and CDNs:

| Source |                                                              |
| :----- | :----------------------------------------------------------- |
| npm    | `npm install popper.js --save`                               |
| yarn   | `yarn add popper.js`                                         |
| NuGet  | `PM> Install-Package popper.js`                              |
| Bower  | `bower install popper.js --save`                             |
| unpkg  | [`https://unpkg.com/popper.js`](https://unpkg.com/popper.js) |

\*: Bower isn't officially supported. This method has the limitation of not being able to define a specific version of the library. Bower and Popper.js suggest using npm or Yarn for your projects.  
For more info, [read the related issue](https://github.com/FezVrasta/popper.js/issues/390).

### Dist targets

Popper.js is currently shipped with 3 targets in mind: UMD, ESM, and ESNext.  
Have no idea what am I talking about? You are looking for UMD probably.

- UMD - Universal Module Definition: AMD, RequireJS, and globals;
- ESM - ES Modules: For webpack/Rollup or browser supporting the spec;
- ESNext: Available in `/dist`, can be used with webpack and `babel-preset-env`;

Make sure to use the right one for your needs. **If you want to import it with a `<script>` tag, use UMD.**  
If you can't find the `/dist` folder in the Git repository, this is because the distribution files are shipped only to Bower, npm or our CDNs. You can still find them visiting `https://unpkg.com/popper.js/dist/`.

## Usage

Given an existing popper DOM node, ask Popper.js to position it near its button.

```html
<div class="my-button">reference</div>
<div class="my-popper">popper</div>
```

```js
var reference = document.querySelector(".my-button");
var popper = document.querySelector(".my-popper");
var popperInstance = new Popper(reference, popper, {
  // popper options here
});
```

Take a look at this [CodePen example](https://codepen.io/FezVrasta/pen/yWGrOZ) to see a full fledged
usage example, consisting of all the HTML, JavaScript, and CSS needed to style a popper.

### Callbacks

Popper.js supports two kinds of callbacks; the `onCreate` callback is called after
the popper has been initialized. The `onUpdate` one is called on any subsequent update.

```js
const reference = document.querySelector(".my-button");
const popper = document.querySelector(".my-popper");
new Popper(reference, popper, {
  onCreate: data => {
    // data is an object containing all the informations computed
    // by Popper.js and used to style the popper and its arrow
    // The complete description is available in Popper.js documentation
  },
  onUpdate: data => {
    // same as `onCreate` but called on subsequent updates
  }
});
```

### Writing modifiers on your own

Popper.js is based on a "plugin-like" architecture, most of its features are fully encapsulated "modifiers".  
A modifier is a function that is called each time Popper.js needs to compute the position of the popper. For this reason, modifiers should be very performant to avoid bottlenecks.

To learn how to create a modifier, [read the modifiers documentation](docs/_includes/popper-documentation.md#modifiers--object)

### React, Vue.js, Angular, AngularJS, Ember.js (etc...) integration

Integrating 3rd party libraries to React or other libraries can be a pain because
they usually alter the DOM and drive the libraries crazy.  
Popper.js limits all its DOM modifications inside the `applyStyle` modifier,
you can simply disable it and manually apply the popper coordinates using
your library of choice.

For a comprehensive list of libraries that let you use Popper.js into existing
frameworks, visit the [MENTIONS](MENTIONS.md) page.

Alternatively, you may even override your own `applyStyles` with your custom one and
integrate Popper.js by yourself!

```js
function applyReactStyle(data) {
  // export data in your framework and use its content to apply the style to your popper
}

const reference = document.querySelector(".my-button");
const popper = document.querySelector(".my-popper");
new Popper(reference, popper, {
  modifiers: {
    applyStyle: { enabled: false },
    applyReactStyle: {
      enabled: true,
      fn: applyReactStyle,
      order: 900
    }
  }
});
```

### How to use Popper.js in Jest

It is recommended that users mock Popper.js for use in Jest tests due to some limitations of JSDOM.

The simplest way to mock Popper.js is to place the following code in `__mocks__/popper.js.js` adjacent to your `node_modules` directory. Jest will pick it up automatically.

```js
import PopperJs from "popper.js";

export default class Popper {
  static placements = PopperJs.placements;

  constructor() {
    return {
      destroy: () => {},
      scheduleUpdate: () => {}
    };
  }
}
```

Alternatively, you can manually mock Popper.js for a particular test.

```js
jest.mock("popper.js", () => {
  const PopperJS = jest.requireActual("popper.js");

  return class Popper {
    static placements = PopperJS.placements;

    constructor() {
      return {
        destroy: () => {},
        scheduleUpdate: () => {}
      };
    }
  };
});
```

### Migration from Popper.js v0

Since the API changed, we prepared some migration instructions to make it easy to upgrade to
Popper.js v1.

https://github.com/FezVrasta/popper.js/issues/62

Feel free to comment inside the issue if you have any questions.

### Performances

Popper.js is very performant. It usually takes 0.5ms to compute a popper's position (on an iMac with 3.5G GHz Intel Core i5).  
This means that it will not cause any [jank](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool/anatomy-of-jank), leading to the smooth user experience.

## Notes

### Libraries using Popper.js

The aim of Popper.js is to provide a stable and powerful positioning engine ready to
be used in 3rd party libraries.

Visit the [MENTIONS](MENTIONS.md) page for an updated list of projects.

### Where's Tooltip.js?

Tooltip.js used to be the reference implementation used by Popper.js to instruct 3rd party
contributors how to integrate Popper.js in their own libraries.

The library has been discontinued, so that we can focus solely on Popper.js, which is the
at the core of our mission.

If you were a Tooltip.js user, consider switching to [Tippy.js](https://atomiks.github.io/tippyjs/),
it's a more mature, and complete, Popper.js-based tooltip library.

If you need to read the docs of the now deprecated Tooltip.js, you can [find them here](docs/tooltip-documentation.md).

### Credits

I want to thank some friends and projects for the work they did:

- [@AndreaScn](https://github.com/AndreaScn) for his work on the GitHub Page and the manual testing he did during the development;
- [@vampolo](https://github.com/vampolo) for the original idea and for the name of the library;
- [Sysdig](https://github.com/Draios) for all the awesome things I learned during these years that made it possible for me to write this library;
- [Tether.js](https://github.hubspot.com/tether/) for having inspired me in writing a positioning library ready for the real world;
- [The Contributors](https://github.com/FezVrasta/popper.js/graphs/contributors) for their much appreciated Pull Requests and bug reports;
- **you** for the star you'll give to this project and for being so awesome to give this project a try 🙂

### Copyright and license

Code and documentation copyright 2016 **Federico Zivolo**. Code released under the [MIT license](https://github.com/FezVrasta/popper.js/blob/master/LICENSE.md). Docs released under Creative Commons.
