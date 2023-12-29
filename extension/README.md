# Floating UI Devtools Extension

[Chrome devtools extension](https://chromewebstore.google.com/detail/floating-ui-devtools/ninlhpbnkjidaokbmgebblaehpokdmgb?hl=en)
to help debugging Floating UI

<!-- Available on [Chrome web store](). -->

### Contribution

- run `pnpm run build` from root `/extension` folder
- load extension from `/extension/dist` folder
- open chrome devtools, inspect extension in devtools panel (next to 'Styles'
  tab).

## Extension supported libraries

The
[Chrome devtools extension](https://chromewebstore.google.com/detail/floating-ui-devtools/ninlhpbnkjidaokbmgebblaehpokdmgb?hl=en)
supports custom data-types for the following libraries:

- `@floating-ui/react`
- `@fluentui/react-components`

### Adding support for a new library custom data-types

To add support for a new library custom data-types, you need to:

- Create a new folder under `./src/views` with the name of the library
- Expose all the data-types you want to support in the `Data` union type
- Create a new component for each data-type in the `./src/views/<library-name>`
  folder
- Include a case for each data-type in the `view` object, and import the
  component created in the previous step to render the data-type

#### Example `MyLibrary` custom data-types

Custom data-type and a component that will consume that data-type for
`MyLibrary` are defined in the `./src/views/my-library` as follow:

```ts
// ./src/views/my-library/data-types.ts
export type MyLibraryMiddlewareData = {
  type: 'MyLibraryMiddlewareData';
};

export type Datatype = MyLibraryMiddlewareData;

// ./src/views/my-library/MyLibraryMiddleware.tsx
export const MyLibraryMiddleware = React.memo((props: Serialized<MyLibraryMiddlewareData>) => {
  return <div>MyLibraryMiddleware</div>;
});

export default MyLibraryMiddleware;

// ./src/views/my-library/index.ts
export * from './data-types';
export const views = {
  MyLibraryMiddleware: React.lazy(() => import('./MyLibraryMiddleware')),
}
```

Then the `Data` union type is updated to include the new data-type, and the
`views` object is updated to include the new component:

```diff
# ./src/views/index.tsx
import type React from 'react';

import * as common from './common';
import * as floatingUI from './floating-ui';
import * as fluentUI from './fluentui';
+import * as myLibrary from './my-library'

export type Data =
  | common.Datatype
  | floatingUI.Datatype
  | fluentUI.Datatype
+  | myLibrary.Datatype

export const views: Record<Data['type'], React.FC> = {
  ...common.views,
  ...floatingUI.views,
  ...fluentUI.views,
+ ...myLibrary.views
};
```
