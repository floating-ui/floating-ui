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
Popper.js is built from the ground up to being modular and fully ~~hackable~~ **customizable**.  
It supports a **plugin system** you can use to add particular behaviors to your poppers.  
It's written with ES2015 and it's **AMD** and **CommonJS** compatible, every line is documented thanks to our [JSDoc page](https://fezvrasta.github.io/popper.js/documentation.html).


## The Library

Popper.js is a library that makes sure your popper stays near the defined reference element.  

Some of the key points are:

- Position elements keeping them in their original DOM context (doesn't mess with your DOM!);
- Allows to export the computed informations to integrate with React and other view libraries;
- Supports Shadow DOM elements;
- Completely customizable thanks to the modifiers (plugins) based structure;
- The whole code base is automatically tested across the latest versions of Chrome, Firefox, Safari and Edge;

Visit our [project page](https://fezvrasta.github.io/popper.js) to see a lot of examples of what you can do with Popper.js!


### Installation
Popper.js is available on NPM and Bower:

| Source   |                                              |
|:---------|:---------------------------------------------|
| npm      | `npm install popper.js@2 --save`             |
| Bower    | `bower install popper.js#~2 --save`          |
| jsDelivr | `http://www.jsdelivr.com/projects/popper.js` |


### Usage

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

### React, AngularJS and Ember.js integration

Integrate 3rd party libraries in React or other libraries can be a pain because
they usually alter the DOM and drives the libraries crazy.  
Popper.js limits all its DOM modifications inside the `applyStyle` modifier,
you can simply disable it and manually apply the popper coordinates using
your library of choice.  
Alternatively, you may even override `applyStyles` with your custom function!

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

You can find a fully working React component visiting this gist:  
https://gist.github.com/FezVrasta/6533adf4358a6927b48f7478706a5f23


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

Popper.js will never winthe prize for "easiest to use tooltip library", well, probably because it's not a tooltip lib. 😅  
With it you can create awesome libraries without worring about the positioning problems! Some great ones using Popper.js are listed here:

- [intro-guide-js](https://github.com/johanlahti/intro-guide-js): Create guided tours of your web pages;
- [picker.js](https://github.com/GeekAb/picker.js): Modern date picker;

_Want to see your library here? Open an issue and report it._


### Credits
I want to thank some friends and projects for the work they did:

- [@AndreaScn](https://github.com/AndreaScn) for its work on the GitHub Page and the manual testing he did during the development;
- [@vampolo](https://github.com/vampolo) for the original idea and for the name of the library;
- [Sysdig](https://github.com/Draios) for all the awesome things I learned during these years that made possible for me to write this library;
- [Tether.js](http://github.hubspot.com/tether/) for having inspired me in writing a positioning library ready for the real world;
- **you** for the star you'll give to this project and for being so awesome to give this project a try :)

### Copyright and license
Code and documentation copyright 2016 **Federico Zivolo**. Code released under the [MIT license](LICENSE.md). Docs released under Creative Commons.
