import {devtools} from '@floating-ui/devtools';
import {useClick, useFloating, useInteractions} from '@floating-ui/react';
import type {Meta} from '@storybook/react';
import {useState} from 'react';

import {
  devtoolsDefaultContextValue,
  DevtoolsProvider,
} from '../../contexts/devtools';
import {HTML_ELEMENT_REFERENCE} from '../../utils/constants';
import FloatingUIMiddlewarePanel from './FloatingUIMiddleware';

const dummyReferenceId = `${HTML_ELEMENT_REFERENCE}:1` as const;

export default {
  title: 'Panels/Floating UI',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export const Example = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [devtools(document)],
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

export const Middleware = () => <FloatingUIMiddlewarePanel />;

Middleware.decorators = [
  (Story: React.ElementType) => (
    <DevtoolsProvider
      value={{
        ...devtoolsDefaultContextValue,
        serializedData: {
          elements: {
            floating: dummyReferenceId,
            reference: dummyReferenceId,
          },
          x: 0,
          y: 0,
          type: 'FloatingUIMiddleware',
          strategy: 'absolute',
          rects: {
            floating: {x: 0, y: 0, width: 0, height: 0},
            reference: {x: 0, y: 0, width: 0, height: 0},
          },
          placement: 'bottom',
          initialPlacement: 'bottom-end',
          middlewareData: {},
        },
      }}
    >
      <Story />
    </DevtoolsProvider>
  ),
];
