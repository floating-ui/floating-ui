# Contributing to Popper.js

## Report bugs

If you find a bug, please, try to isolate the specific case and provide a fiddle on CodePen or JSFiddle to make it easy to reproduce the problem and help others finding a solution.
You can use [this CodePen](http://codepen.io/FezVrasta/pen/wGqJEz) which already includes Popper.js.

If your issue is not about a bug, please make sure to consider posting on StackOverflow instead.

Feature requests are welcome!

## Setup

Then run `npm install` or `yarn` to install the needed dependencies.

## Developing

## Adopt an issue

The issues with the `PR WELCOME` label are the preferred ones to adopt if you want to contribute to this project.  
These issues are most likely new features or enhancements that would be nice to have but that will not be implemented by the maintainer due to lack of free time.

Other issues labelled by `HELP WANTED` should be fixed by the maintainer, but for any reason, he has problems with it and needs help from the community to continue the work on it.

When you adopt an issue, please write a comment on it to make sure that multiple people don't work on the same one.

## Test

We develop following a test driven development approach.

We have a karma + jasmine environment to unit test Popper.js
Feel free to add tests to the `/tests` folder, any JavaScript file in that folder will be executed as test.

To run tests:

```bash
npm run test:dev # watch
npm run test # single run
```

## Build

To create a new release run:

```js
npm run build:popper # popper.js
npm run build:tooltip # tooltip.js
npm run build # both
```

The files will be automatically minified and copied in the `build` directory.

**Note:** never commit builds! We take care to compile the source code when we release a new version.
