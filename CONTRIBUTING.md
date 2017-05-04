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

All the issues, if not assigned to someone, can be adopted by anyone. Just make sure to comment on the issue to let know
other users about your intention to work on it.  
Also, remember to comment again in case you end up abandoning the issue.

Each issue has a `DIFFICULTY` label to help you pick the one with the difficulty level adapt to you.  
Additionally, check out the `PRIORITY` label to see which issues should take precedence over the others. If possible, prefer issues with an higher priority, but if you want to adopt an issue with lower priority, it's not a problem!

Issues with `NEEDS: CI test` need a PR that integrates a test in the test suite to reproduce the bug, this is very useful because it allows other developers to try to fix the bug having a feedback.

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
