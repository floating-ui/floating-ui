[![Build Status](https://travis-ci.org/FezVrasta/popper.js.svg?branch=master)](https://travis-ci.org/FezVrasta/popper.js)

# Popper.js

<img src="popperjs.png" align="right" width=250>
Popper.js is a set of libraries used to create **poppers** in web applications.

### Wut? Poppers?
A popper is an element on the screen which "pops out" from the natural flow of your application.  
Common examples of poppers are tooltips and popovers.

### So, yet another tooltip library?
Well, basically, **no**.  
Popper.js is built from the ground up to being modular and fully ~~hackable~~ **customizable**.  
It supports a **plugin system** you can use to add particular behaviors to your poppers.  
It's **AMD** and **CommonJS** compatible and it's well documented thanks to our [JSDoc page](https://fezvrasta.github.io/popper.js/documentation.html).

<br>
--------------
<br>

# Popper.js Libraries

Popper.js is a set of libraries, but right now the only released one is Near.js.

## Near.js

Near.js (*I wanted to call it "Together.js" but seems like Mozilla already used it... Thanks, Mozilla*) is the library with the job of making sure your popper stays near the defined reference element (if you want so).

Ok, let's stop talking, I'll show you how to use it:

```js
var reference = document.querySelector('.my-button');
var popper = document.querySelector('.the-popper');
var options = { /* more later... */ }

var thePopper = new Near(reference, popper, options); // that's all
```

It's the real badass of the family, all the hard work is on its shoulders and we'll never thank it enough for all its work!

## Popper.js

This library is still work in progress, basically will allow you to automatically create tooltips and popovers just defining their reference element.
All the hard work is done by **Near.js** under the hood, but we want to make even easier to create poppers and Popper.js will make this possible.

Here is an example of how the API will look like:

```js
var reference = document.querySelector('.my-button');
var options = { /* more later... */ };

var thePopper = new Popper(reference, options);
```

These few lines will create a new element and will initialize it using Near.js.
As you see, it's just a shorthand for what you can already do with **Near.js** right now.
Visit our [GitHub Page](https://fezvrasta.github.io/popper.js) to see a lot of examples of what you can already do right now!


# Notes

## Credits

I want to thank some friends and projects for the work they did:

- [@AndreaScn](https://github.com/AndreaScn) for its work on the GitHub Page and the manual testing he did during the development;
- [Sysdig](https://github.com/Draios) for all the awesome things I learned during these years that made possible for me to write this library;
- [Tether.js](http://github.hubspot.com/tether/) for having inspired me in writing a positioning library ready for the real world;
- **you** for the star you'll give to this project and for beeing so awesome to give this project a try :)

## Copyright and license

Code and documentation copyright 2016 **Federico Zivolo**. Code released under the [MIT license](LICENSE.md). Docs released under Creative Commons.
