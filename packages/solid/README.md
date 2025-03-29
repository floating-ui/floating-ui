# @floating-ui/solid

[![NPM](https://img.shields.io/npm/v/@floating-ui/solid)](https://www.npmjs.com/package/@floating-ui/solid)
<p align="center">
  <img src="https://i.imgur.com/l8VYgtb.png" alt="Floating UI Solid">
<p>

<p align="center">
A lightweight SolidJS bindings for Floating UI.
<p>

## Installation

Choose your preferred package manager:

```bash
npm install @floating-ui/solid
# or
yarn add @floating-ui/solid
# or
pnpm add @floating-ui/solid
# or
bun add @floating-ui/solid
```

## Usage

Here's a basic example of how to use @floating-ui/solid:

```jsx
import { createSignal } from 'solid-js';
import { createFloating } from '@floating-ui/solid';

export default function App() {
  const [isOpen, setIsOpen] = createSignal(false);
  const { refs, floatingStyles } = createFloating({
    placement: "bottom",
    isOpen: isOpen,
    strategy: "absolute",
  });

  return (
    <main>
      <div
        ref={refs.setReference}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        class="reference"
      >
        Hover me
      </div>
      {isOpen() && (
        <div
          ref={refs.setFloating}
          style={...floatingStyles()}
          class="floating"
        >
          Floating
        </div>
      )}
    </main>
  );
}
```

### Using autoUpdate

To keep the floating element positioned correctly when the reference element changes, use the `autoUpdate` function:

```jsx
import { autoUpdate, createFloating } from '@floating-ui/solid';

const { refs, floatingStyles } = createFloating({
  placement: "bottom",
  isOpen: isOpen,
  strategy: "absolute",
  whileElementsMounted: autoUpdate,
  // or for more control:
  whileElementsMounted: (reference, floating, update) => {
    const cleanup = autoUpdate(reference, floating, update, { elementResize: true });
    return cleanup;
  },
});
```

### Applying Custom Styles

You can apply custom styles to the floating element using middleware:

```jsx
import { autoUpdate, createFloating, size, offset } from '@floating-ui/solid';

const [reactiveMiddleware, setReactiveMiddleware] = createSignal([
    offset(10),
    size({
      apply({ availableHeight }) {
        setFloatingStyles({ ...floatingStyles(), "max-height": `${availableHeight}px` });
      }
    })
  ]);

const { refs, floatingStyles, setFloatingStyles } = createFloating({
  placement: "bottom",
  isOpen: isOpen,
  strategy: "absolute",
  middleware: reactiveMiddleware,
});
```
### Arrow Element

```jsx
import { autoUpdate, createFloating, arrow } from '@floating-ui/solid';
const [reactiveMiddleware, setReactiveMiddleware] = createSignal([]);
const { refs, floatingStyles, setFloatingStyles } = createFloating({
  placement: "bottom",
  isOpen: isOpen,
  strategy: "absolute",
  middleware: reactiveMiddleware,
});

  return (
        <div>
            <div
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                class="reference"
                ref={refs.setReference}
            >
                Reference
            </div>

            {isOpen() && (
                <div class="floating" style={{ ...floatingStyles() }} ref={refs.setFloating}>
                    Floating
                    <div
                        class="arrow"
                        style={{
                            position: 'absolute',
                            left: middleware()?.arrow?.x != null ? `${middleware().arrow?.x}px` : '',
                            top: arrowState()?.offsetHeight != null ? `${-arrowState()?.offsetHeight! / 2}px` : '',
                        }}
                        ref={(node) => {
                            setArrow(node)
                            setReactiveMiddleware((prev) => [...prev, arrow({ element: node })]); // set it once it's ready
                        }}
                    ></div>
                </div>
            )}
        </div>
    )
```
## License

This project is licensed under the MIT License.