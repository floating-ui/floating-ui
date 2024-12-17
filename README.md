<p align="center">
  <img src="https://github.com/floating-ui/floating-ui/blob/master/website/assets/floating-ui-banner.png" alt="Floating UI" width="70%">
<p>

> [!NOTE]
> Popper is now Floating UI! For Popper v2, visit
> [its dedicated branch](https://github.com/floating-ui/floating-ui/tree/v2.x) and [its documentation](https://popper.js.org/docs).
> For help on migrating, check out the
> [Migration Guide.](https://floating-ui.com/docs/migration)

[Floating UI](https://floating-ui.com) is a small library that helps you create
"floating" elements such as tooltips, popovers, dropdowns, and more.

It offers two main features:

1. **Anchor positioning**: Anchor a floating element (such as a tooltip) to
   another element (such as a button) while simultaneously ensuring it stays in
   view as best as possible by avoiding collisions. This feature is available
   for all platforms.
2. **User interactions for React**: Hooks and components for composing
   interactions to create accessible floating UI components.

## README Contributors

<table>
  <tr>
    <td>
      <a href="https://milfordasset.com/" target="_blank" rel="noopener noreferrer"><img width="176" height="150" src="https://github.com/floating-ui/floating-ui/blob/master/website/assets/sponsors/milford.svg" alt="Milford" /></a>
    </td>
    <td>
      <a href="https://dopt.com/?utm_source=floating_ui_readme" target="_blank" rel="noopener noreferrer"><img width="200" height="150" src="https://github.com/floating-ui/floating-ui/blob/master/website/assets/sponsors/dopt.png" alt="Dopt" /></a>
    </td>
  </tr>
</table>

You can support Floating UI in a variety of ways on
[Open Collective](https://opencollective.com/floating-ui).

## Why

Floating elements are absolutely positioned, typically anchored to another UI
element. Ensuring a floating element remains anchored next to another element
can be challenging, especially in unique layout contexts like scrolling
containers.

Absolute positioning can also cause problems when the floating element is too
close to the edge of the viewport and becomes obscured, also known as a
collision. When a collision occurs, the position must be adjusted to ensure the
floating element remains visible.

Further, floating elements are often interactive, which can raise complex
accessibility issues when designing user interactions.

Floating UI offers a set of low-level features to help you navigate these
challenges and build accessible floating UI components.

## Install

To install Floating UI, you can use a package manager like npm or a
[CDN](https://floating-ui.com/docs/getting-started#cdn). There are different
versions available for different platforms.

### Vanilla

Use on the web with vanilla JavaScript.

```shell
npm install @floating-ui/dom
```

You can either start by
[reading the tutorial](https://floating-ui.com/docs/tutorial), which teaches you
how to use the library by building a basic tooltip, or you can jump right into
the [API documentation](https://floating-ui.com/docs/computePosition).

### React

Use with [React DOM](https://floating-ui.com/docs/react) or
[React Native](https://floating-ui.com/docs/react-native).

#### React DOM

```shell
# Positioning + interactions
npm install @floating-ui/react

# Positioning only (smaller size)
npm install @floating-ui/react-dom
```

#### React Native

```shell
npm install @floating-ui/react-native
```

### Vue

Use with [Vue](https://floating-ui.com/docs/vue).

```shell
npm install @floating-ui/vue
```

### Canvas or other platforms

If you're targeting a platform other than the vanilla DOM (web), React, or React
Native, you can create your own
[Platform](https://floating-ui.com/docs/platform). This allows you to support
things like Canvas/WebGL, or other platforms that can run JavaScript.

```shell
npm install @floating-ui/core
```

## Contributing

This project is a monorepo written in TypeScript using [pnpm](https://pnpm.io/)
workspaces. The website is using Next.js SSG and Tailwind CSS for styling.

- Fork and clone the repo
- Install dependencies in root directory with `pnpm install`
- Build initial package dist files with `pnpm run build`

### Testing grounds

#### DOM

`pnpm run --filter @floating-ui/dom dev` in the root will launch the
`@floating-ui/dom` development visual tests at `http://localhost:1234`. The
playground uses React to write each test route, bundled by Vite.

Each route has screenshots taken of the page by Playwright to ensure all the
functionalities work as expected; this is an easy, reliable and high-level way
of testing the positioning logic.

Below the main container are UI controls to turn on certain state and options.
Every single combination of state is tested visually via the snapshots to cover
as much as possible.

#### React

`pnpm run --filter @floating-ui/react dev` in the root will launch the
`@floating-ui/react` development tests at `http://localhost:1234`.

## Credits

The floating shapes in the banner image are made by the amazing artists
[@artstar3d](https://figma.com/@artstar3d),
[@killnicole](https://figma.com/@killnicole) and
[@liiiiiiii](https://www.figma.com/@liiiiiii) on Figma — check out their work!

## License

MIT
