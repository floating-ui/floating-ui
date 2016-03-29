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
It's **AMD** and **CommonJS** compatible and it's well documented thanks to our JSDoc page.

## Near.js

Near.js (*I wanted to call it "Together.js" but seems like Mozilla already used it... Thanks, Mozilla*) is the library with the job of making sure your popper stays near the defined reference element (if you want so).

Ok, let's stop talking, I'll show you how to use it:

```js
var reference = document.querySelector('.my-button');
var popper = document.querySelector('.the-popper');
var options = { /* more later... */ }

var thePopper = new Near(reference, popper, options); // that's all
```

## Popper.js

This one is used to style your Popper, add the nice arrow to it, in and out animations and so on.
