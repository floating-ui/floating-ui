# Popper.js
Popper.js is a library used to create poppers in web applications.

[![Build Status](https://travis-ci.org/FezVrasta/popper.js.svg?branch=master)](https://travis-ci.org/FezVrasta/popper.js)
[![npm version](https://badge.fury.io/js/popper.js.svg)](https://badge.fury.io/js/popper.js)
[![Join the chat!](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/FezVrasta/popper.js)

<img src="https://raw.githubusercontent.com/FezVrasta/popper.js/master/popperjs.png" align="right" width=250>

## Wut? Poppers?
A popper is an element on the screen which "pops out" from the natural flow of your application.
Common examples of poppers are tooltips and popovers.

## So, yet another tooltip library?
Well, basically, **no**.
Popper.js is built from the ground up to being modular and fully ~~hackable~~ **customizable**.
It supports a **plugin system** you can use to add particular behaviors to your poppers.
It's **AMD** and **CommonJS** compatible and it's well documented thanks to our [JSDoc page](https://fezvrasta.github.io/popper.js/documentation.html).


## The Library
Popper.js is mostly a library with the job of making sure your popper stays near the defined reference element (if you want so).
Additionally, it provides an easy way to generate your popper element if you don't want to use one already in your DOM.

### Installation
Popper.js is available on NPM and Bower:

**NPM**
```bash
npm install popper.js --save
```

**Bower**
```bash
bower install popper.js --save
```

**jsDelivr**
```
http://www.jsdelivr.com/projects/popper.js
```

### Basic usage
Create a popper near a button:

```js
var reference = document.querySelector('.my-button');
var thePopper = new Popper(
    reference,
    {
        content: 'My awesome popper!'
    },
    {
        // popper options here
    }
);
```

### "Advanced" usage
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
```js
var reference = document.querySelector('.my-button');
var popper = document.querySelector('.my-popper');
var anotherPopper = new Popper(reference, popper).onCreate(instance) {
  // instance is Popper.js instance
}).onUpdate(function(data) {
  // data is an object containing all the informations computed by Popper.js and used to style the popper and its arrow
});
```

### React.js and Ember.js integration
If you prefer to let your framework apply the styles to your DOM objects, you can follow an approach like the one below:
```js
var reference = document.querySelector('.my-button');
var popper = document.querySelector('.my-popper');
var anotherPopper = new Popper(reference, popper, {
    modifiersIgnored: ['applyStyle'] // prevent Popper.js from applying styles to your DOM
}).onUpdate(function(data) {
  // export data in your framework and use its content to apply the style to your popper
});
```


If you are wondering about the available options of the third argument, check out [our documentation](http://fezvrasta.github.io/popper.js/documentation.html#new_Popper_new)

Visit our [GitHub Page](https://fezvrasta.github.io/popper.js) to see a lot of examples of what you can do right now!


## Notes

### Credits
I want to thank some friends and projects for the work they did:

- [@AndreaScn](https://github.com/AndreaScn) for its work on the GitHub Page and the manual testing he did during the development;
- [@vampolo](https://github.com/vampolo) for the original idea and for the name of the library;
- [Sysdig](https://github.com/Draios) for all the awesome things I learned during these years that made possible for me to write this library;
- [Tether.js](http://github.hubspot.com/tether/) for having inspired me in writing a positioning library ready for the real world;
- **you** for the star you'll give to this project and for beeing so awesome to give this project a try :)

### Copyright and license
Code and documentation copyright 2016 **Federico Zivolo**. Code released under the [MIT license](LICENSE.md). Docs released under Creative Commons.
