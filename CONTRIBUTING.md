# Contributing to Popper.js

## Setup

In order to properly work on the development environment, run:

```js
npm install
```

and make sure to have `grunt-cli` and `bower` installed globally.

## Developing

To serve the files just run `grunt serve` and visit `localhost:9000` on your browser.

Right now we are using `tests/test.html` to manually test the behavior of Near.js.

## Test

We have a grunt + karma + jasmine environment to unit test Popper.js
Feel free to add tests to the `/tests` folder, any JavaScript file in that folder will be executed as test.

## Build

To create a new release of Popper.js, run:

```js
grunt dist
```

The files will be automatically minified and copied in the `build` directory.

**NB** Never commit changes and builds together! Each build should have its own dedicated commit.