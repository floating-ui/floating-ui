# Contributing to Popper.js

## Report bugs

If you find a bug, please, try to isolate the specific case and provide a fiddle on CodePen or JSFiddle to make it easy to reproduce the problem and help others finding a solution.
You can use [this CodePen](http://codepen.io/FezVrasta/pen/wGqJEz) which already includes Popper.js.

If your issue is not about a bug, please make sure to consider posting on StackOverflow instead.

Feature requests are welcome!

## Setup

Make sure to have `grunt-cli` and `bower` installed globally.

Then run:

```js
npm install
bower install
```

## Developing

## Adopt an issue

The issues with the `PR WELCOME` label are the preferred ones to adopt if you want to contribute to this project.  
These issues are most likely new features or enhancements that would be nice to have but that will not be implemened by the maintainer due to lack of free time.

Other issues labelled by `HELP WANTED` should be fixed by the maintainer, but for any reason, he has problems with it and needs help from the community to continue the work on it.

When you adopt an issue, please write a comment on it to make sure that multiple people don't work on the same one.

## Test

We develop following a test driven development approach.

We have a grunt + karma + jasmine environment to unit test Popper.js
Feel free to add tests to the `/tests` folder, any JavaScript file in that folder will be executed as test.

To run tests:

```bash
npm test
```

**Note:** we use Chrome even for the tests on Travis CI, despite this, the CSS offsets of the page elements seem to be different when the tests are ran on Travis CI or on your local machine.
Due to this problem, right now we make assertions checking both the local and CI offsets.

Any suggestion to get rid of this problem is more than welcome tho.

## Build

To create a new release of Popper.js, run:

```js
grunt dist
```

The files will be automatically minified and copied in the `build` directory.

**Note:** never commit changes and builds together! Each build should have its own dedicated commit.
