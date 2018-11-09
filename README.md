# PopperJS

## Hacking the library

First of all, make sure to have [Yarn installed](https://yarnpkg.com/lang/en/docs/install).

Install the development dependencies:

```
yarn install
```

And run the development environment:

```
yarn dev
```

Then, simply open one the development server web page:

```
# macOS and Linux
open localhost:5000

# Windows
start localhost:5000
```

From there, you can open any of the examples (`.html` files) to fiddle with them.

Now any change you will made to the source code, will be automatically
compiled, you just need to refresh the page.

If the page is not working properly, try to go in _"Developer Tools > Application > Clear storage"_ and click on "_Clear site data_".  
To run the examples you need a browser with [JavaScript modules via script tag support](https://caniuse.com/#feat=es6-module).
