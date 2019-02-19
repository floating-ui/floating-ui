# Offset

The offset modifier lets you displace a popper element from its reference element.

This can be useful if you need to apply some margin between them or if you need to fine tune the position
according to some custom logic.

To use the modifier you can run:

```js
new Popper(reference, popper, {
  modifiers: [{ name: 'offset', options: {
    offset: () => [10, 20] }]
  },
});
```

Let's take a look at the `options` object, it accepts an optional `offset` property
which maps to a function used to return the two offset values we want to apply.

The first value is the "distance" between the reference and the popper, while the second
value is the "skidding" or "deviation" between them.

```
    A               A
    |
    | <- distance
    |               |-------| <- skidding
    B                       B
```

The function can also provide some arguments, specifically you will have access to the popper
"placement", the reference and popper "measurements".

```js
new Popper(reference, popper, {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: ({ placement, reference, popper }) => {
          if (placement === 'bottom') {
            return [popper.height / 2];
          } else {
            return [];
          }
        },
      },
    },
  ],
});
```

In the above example, we are applying half the popper's height as margin between the two elements
only when the popper is positioned below its reference element.
