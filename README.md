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

| Source   |                                              |
|:---------|:---------------------------------------------|
| NPM      | `npm install popper.js@0 --save`             |
| Bower    | `bower install popper.js#~0 --save`          |
| jsDelivr | `http://www.jsdelivr.com/projects/popper.js` |

> **Heads up!** We are working on the v1.0.0 release of Popper.js, make sure to install the latest v0.* if you want to stay on the stable version!

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
You can find a fully working React.js component visiting this gist:  
https://gist.github.com/FezVrasta/6533adf4358a6927b48f7478706a5f23


If you are wondering about the available options of the third argument, check out [our documentation](http://fezvrasta.github.io/popper.js/documentation.html#new_Popper_new)

Visit our [GitHub Page](https://fezvrasta.github.io/popper.js) to see a lot of examples of what you can do right now!

### Writing your own modifiers
Popper.js is based on a "plugin-like" architecture, most of the features of it are fully encapsulated "modifiers".  
A modifier is a function that is called each time Popper.js needs to compute the position of the popper. For this reason, modifiers should be very performant to avoid bottlenecks.

```
// this little modifier forces the popper `top` value to be `0`
function fixToTop(data) {
    data.popper.offsets.top = 0
    return data;
}
```

Then, you can add your modifier to your Popper.js instance, adding it to the `modifiers` list in the options:

```
// note that the built-in modifiers are referenced using strings
// instead, your custom modifiers are passed directly as functions
new Popper(a, b, {
  modifiers: [ 'shift', 'offset', 'preventOverflow', 'keepTogether', 'arrow', 'flip', 'applyStyle', fixToTop]
})
```

Here is the `data` object content:

```
let data = {
  // popper and reference elements positions
  offsets: {
    popper: {
      top: Number,
      left: Number,
      width: Number,
      height: Number
    },
    reference: {
      top: Number,
      left: Number,
      width: Number,
      height: Number
    },
    // here, only one of the two values will be different from `0`, depending by the placement
    arrow: {
      left: Number,
      top: Number
    }
  },
  // the result of the _getBoundaries method, these are the limits between the popper can be placed
  boundaries: {
    top: Number,
    right: Number,
    bottom: Number,
    left: Number
  },
  // `top`, `left`, `bottom`, `right` + optional `end` or `start` variations
  placement: String,
  // the placement defined at the beginning, before any edit made by modifiers
  _originalPlacement: String,
  // allows you to know if the `flip` modifier have flipped the placement of the popper
  flipped: Boolean,
  // the node of the arrow (if any)
  arrowElement: HTMLElement,
  // any property defined in this object will be applied to the popper element
  // here you can even override the default styles applied by Popper.js
  styles: {}
}
```


## Libraries using Popper.js

Popper.js will never winthe prize for "easiest to use tooltip library", well, probably because it's not a tooltip lib. 😅  
With it you can create awesome libraries without worring about the positioning problems! Some great ones using Popper.js are listed here:

- [intro-guide-js](https://github.com/johanlahti/intro-guide-js): Create guided tours of your web pages;
- [picker.js](https://github.com/GeekAb/picker.js): Modern date picker;

_Want to see your library here? Open an issue and report it._


## Notes

### Credits
I want to thank some friends and projects for the work they did:

- [@AndreaScn](https://github.com/AndreaScn) for its work on the GitHub Page and the manual testing he did during the development;
- [@vampolo](https://github.com/vampolo) for the original idea and for the name of the library;
- [Sysdig](https://github.com/Draios) for all the awesome things I learned during these years that made possible for me to write this library;
- [Tether.js](http://github.hubspot.com/tether/) for having inspired me in writing a positioning library ready for the real world;
- **you** for the star you'll give to this project and for being so awesome to give this project a try :)

### Copyright and license
Code and documentation copyright 2016 **Federico Zivolo**. Code released under the [MIT license](LICENSE.md). Docs released under Creative Commons.
