# Popper.js

[![Build Status](https://travis-ci.org/FezVrasta/popper.js.svg?branch=master)](https://travis-ci.org/FezVrasta/popper.js)
[![npm version](https://badge.fury.io/js/popper.js.svg)](https://badge.fury.io/js/popper.js)

<img src="https://github.com/FezVrasta/popper.js/blob/master/popperjs.png" align="right" width=250>
Popper.js is a library used to create **poppers** in web applications.

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

**jsDelivr ([pending approvation](https://github.com/jsdelivr/jsdelivr/pull/10723))**
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
});
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
});
```

If you are wondering about the available options of the third argument, check out [our documentation](http://fezvrasta.github.io/popper.js/documentation.html#new_Popper_new)

Visit our [GitHub Page](https://fezvrasta.github.io/popper.js) to see a lot of examples of what you can already do right now!


## Notes

### Credits
I want to thank some friends and projects for the work they did:

- [@AndreaScn](https://github.com/AndreaScn) for its work on the GitHub Page and the manual testing he did during the development;
- [Sysdig](https://github.com/Draios) for all the awesome things I learned during these years that made possible for me to write this library;
- [Tether.js](http://github.hubspot.com/tether/) for having inspired me in writing a positioning library ready for the real world;
- **you** for the star you'll give to this project and for beeing so awesome to give this project a try :)

### Copyright and license
Code and documentation copyright 2016 **Federico Zivolo**. Code released under the [MIT license](LICENSE.md). Docs released under Creative Commons.
