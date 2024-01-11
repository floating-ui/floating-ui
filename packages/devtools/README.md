# Floating UI Devtools

This is the platform-agnostic devtools package of Floating UI, exposing
mechanisms to be used together with
[Chrome devtools extension](https://chromewebstore.google.com/detail/floating-ui-devtools/ninlhpbnkjidaokbmgebblaehpokdmgb?hl=en)
to help debugging Floating UI

## How to use

This package exposes a [middleware](https://floating-ui.com/docs/middleware) to
be added at the end of the middleware chain, which will inject the data to be
consumed by the devtools extension.

> ⚠️ Do not forget to remove the middleware before shipping to production

### Install

```bash
npm install @floating-ui/devtools
```

### Usage

```js
// example with @floating-ui/react
import {devtools} from '@floating-ui/devtools';

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    // add the middleware to the end of the middleware chain if in dev mode
    middleware: [import.meta.env.DEV && devtools(document)],
  });

  const click = useClick(context);

  const {getReferenceProps, getFloatingProps} = useInteractions([click]);

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        Reference element
      </button>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          Floating element
        </div>
      )}
    </>
  );
};
```

## Contribution

- run `pnpm --filter @floating-ui/devtools run build` from root folder
