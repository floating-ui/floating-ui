> **Documentation** on the official website you'll find the v0 documentation, for the
v1 documentation plase [click here](doc/_includes/documentation.md)


# Popper.js

Popper.js is a library used to create poppers in web applications.

[![Build Status](https://travis-ci.org/FezVrasta/popper.js.svg?branch=master)](https://travis-ci.org/FezVrasta/popper.js)
[![npm version](https://badge.fury.io/js/popper.js.svg)](https://badge.fury.io/js/popper.js)
[![Join the chat!](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/FezVrasta/popper.js)

![Build Status](https://saucelabs.com/browser-matrix/popperjs.svg?auth=b28bea6e52e761cdd54d8783d59b4f04)

<img src="https://raw.githubusercontent.com/FezVrasta/popper.js/master/popperjs.png" align="right" width=250>


## Wut? Poppers?

A popper is an element on the screen which "pops out" from the natural flow of your application.  
Common examples of poppers are tooltips and popovers.


## So, yet another tooltip library?

Well, basically, **no**.  
Popper.js is a **positioning engine**, its purpose is to calculate the position of an element
to make it possible to position it near a given reference element.  

The engine is completely modular and most of its features are implemented as **modifiers**
(similar to middlewars or plugins).  
The whole code base is written in ES2015 and its features are automatically tested on real browsers thanks to SauceLabs and TravisCI.

Additionally, Popper.js has zero dependencies. No jQuery, no LoDash, nothing.

### Popper.js

This is the engine, the library that computes and, optionally, applies the styles to
the poppers.

Some of the key points are:

- Position elements keeping them in their original DOM context (doesn't mess with your DOM!);
- Allows to export the computed informations to integrate with React and other view libraries;
- Supports Shadow DOM elements;
- Completely customizable thanks to the modifiers based structure;

Visit our [project page](https://fezvrasta.github.io/popper.js) to see a lot of examples of what you can do with Popper.js!

### Tooltip.js

Since lot of users just need a simple way to integrate powerful tooltips in their projects,
we created **Tooltip.js**.  
It's a small library that makes it easy to automatically create tooltips using as engine Popper.js.  
It's API is almost identical to the famous tooltip system of Bootstrap, in this way it will be
easy to integrate it in your projects.


## Installation
Popper.js is available on the following package managers and CDNs:

| Source   |                                              |
|:---------|:---------------------------------------------|
| npm      | `npm install popper.js --save`               |
| yarn     | `yarn add popper.js`                         |
| Bower    | `bower install popper.js --save`             |
| jsDelivr | `http://www.jsdelivr.com/projects/popper.js` |


Tooltip.js as well:

| Source   |                                               |
|:---------|:----------------------------------------------|
| npm      | `npm install tooltip.js --save`               |
| yarn     | `yarn add tooltip.js`                         |
| Bower    | `bower install tooltip.js --save`             |
| jsDelivr | `http://www.jsdelivr.com/projects/tooltip.js` |


## Usage

Given an existing popper, ask Popper.js to position it near its button

```js
var reference = document.querySelector('.my-button');
var popper = document.querySelector('.my-popper');
var anotherPopper = new Popper(
    reference,
    popper,
    {
        // popper options here
    }
);
```

### Callbacks

Popper.js supports two kind of callbacks, the `onCreate` callback is called after
the popper has been initalized. The `onUpdate` one is called on any subsequent update.

```js
const reference = document.querySelector('.my-button');
const popper = document.querySelector('.my-popper');
new Popper(reference, popper)
.onCreate((data) => {
    // data is an object containing all the informations computed
    // by Popper.js and used to style the popper and its arrow
    // The complete description is available in Popper.js documentation
})
.onUpdate((data) => {
  // same as `onCreate` but called on subsequent updates
});
```

### React, Vue.js, AngularJS, Ember.js (etc...) integration

Integrate 3rd party libraries in React or other libraries can be a pain because
they usually alter the DOM and drives the libraries crazy.  
Popper.js limits all its DOM modifications inside the `applyStyle` modifier,
you can simply disable it and manually apply the popper coordinates using
your library of choice.  

This made possible to some great developers to create libraries based on Popper.js
that integrate in popular frameworks:

- [**react-popper**](https://github.com/souporserious/react-popper) by [@souporserious](https://github.com/souporserious) for [React](https://facebook.github.io/react/)
- [**ak-layer**](http://aui-cdn.atlassian.com/atlaskit/registry/ak-layer/latest/index.html) by [@Atlassian](https://github.com/atlassian) for [React](https://facebook.github.io/react/)
- [**vue-popper-component**](https://github.com/antongorodezkiy/vue-popper-component) by [@antongorodezkiy](https://github.com/antongorodezkiy) for [Vue.js](https://vuejs.org/)

Alternatively, you may even override `applyStyles` with your custom function and integrate Popper.js by yourself!

```js
function applyReactStyle(data) {
    // export data in your framework and use its content to apply the style to your popper
}

const reference = document.querySelector('.my-button');
const popper = document.querySelector('.my-popper');
new Popper(reference, popper, {
    // prevent Popper.js from applying styles to your DOM disabling `applyStyle`
    modifiers: { applyStyle: { enabled: false } }
})
.onCreate(applyReactStyle)
.onUpdate(applyReactStyle);

```

### Documentation

The whole library is commented line-by-line using JSDocs comments exported into
an easy to follow markdown document.  
To read the full documentation [visit this link](doc/_includes/documentation.md).


### Writing your own modifiers

Popper.js is based on a "plugin-like" architecture, most of the features of it are fully encapsulated "modifiers".  
A modifier is a function that is called each time Popper.js needs to compute the position of the popper. For this reason, modifiers should be very performant to avoid bottlenecks.  

To learn how to create a modifier, [read the modifiers documentaton](doc/_includes/documentation.md#modifiers--object)


## Notes

### Libraries using Popper.js

The aim of Popper.js is to provide a stable and powerful positioning engine ready to
be used in 3rd party libraries.  
Lot of projects are already using Popper.js, you can see the complete list visiting
[the related npm page](https://www.npmjs.com/browse/depended/popper.js).

### Credits
I want to thank some friends and projects for the work they did:

- [@AndreaScn](https://github.com/AndreaScn) for its work on the GitHub Page and the manual testing he did during the development;
- [@vampolo](https://github.com/vampolo) for the original idea and for the name of the library;
- [Sysdig](https://github.com/Draios) for all the awesome things I learned during these years that made possible for me to write this library;
- [Tether.js](http://github.hubspot.com/tether/) for having inspired me in writing a positioning library ready for the real world;
- [The Contributors](https://github.com/FezVrasta/popper.js/graphs/contributors) for their much appreciated Pull Requests and bug reports;
- **you** for the star you'll give to this project and for being so awesome to give this project a try :)

### Copyright and license
Code and documentation copyright 2016 **Federico Zivolo**. Code released under the [MIT license](LICENSE.md). Docs released under Creative Commons.
