import {
  Button,
  FluentProvider,
  makeStyles,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  webLightTheme,
} from '@fluentui/react-components';
import type {Meta} from '@storybook/react';

import {
  devtoolsDefaultContextValue,
  DevtoolsProvider,
} from '../../contexts/devtools';
import {HTML_ELEMENT_REFERENCE} from '../../utils/constants';
import FluentUIMiddlewarePanel from './components/FluentUIMiddleware';

const FluentDecorator = (Story: React.ElementType) => (
  <FluentProvider theme={webLightTheme}>
    <Story />
  </FluentProvider>
);

const dummyReferenceId =
  `${HTML_ELEMENT_REFERENCE}:${crypto.randomUUID()}` as const;

const useStyles = makeStyles({
  contentHeader: {
    marginTop: '0',
  },
});

const ExampleContent = () => {
  const styles = useStyles();
  return (
    <div>
      <h3 className={styles.contentHeader}>Popover content</h3>

      <div>This is some popover content</div>
    </div>
  );
};

export default {
  title: 'Panels/Fluent UI',
  parameters: {
    layout: 'centered',
  },
  decorators: [FluentDecorator],
} satisfies Meta;

export const Example = () => (
  <Popover>
    <PopoverTrigger disableButtonEnhancement>
      <Button>Open Popover</Button>
    </PopoverTrigger>

    <PopoverSurface tabIndex={-1}>
      <ExampleContent />
    </PopoverSurface>
  </Popover>
);

export const Middleware = () => <FluentUIMiddlewarePanel />;

Middleware.decorators = [
  (Story: React.ElementType) => (
    <DevtoolsProvider
      value={{
        ...devtoolsDefaultContextValue,
        serializedData: {
          type: 'FluentUIMiddleware',
          middlewareState: {
            elements: {
              floating: dummyReferenceId,
              reference: dummyReferenceId,
            },
            x: 0,
            y: 0,
            strategy: 'absolute',
            rects: {
              floating: {x: 0, y: 0, width: 0, height: 0},
              reference: {x: 0, y: 0, width: 0, height: 0},
            },
            placement: 'bottom',
            initialPlacement: 'bottom-end',
            middlewareData: {},
          },
          flipBoundaries: [dummyReferenceId, dummyReferenceId],
          scrollParents: [dummyReferenceId],
          overflowBoundaries: [dummyReferenceId],
          options: {},
          initialPlacement: {position: 'unknown', alignment: 'unknown'},
          placement: {position: 'unknown', alignment: 'unknown'},
        },
      }}
    >
      <Story />
    </DevtoolsProvider>
  ),
];
