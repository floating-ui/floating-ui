import {devtools} from '@floating-ui/devtools';
import {useClick, useFloating, useInteractions} from '@floating-ui/react';
import type {Meta} from '@storybook/react';
import * as React from 'react';

export default {
  title: 'Examples/Floating UI',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export const UseFloating = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [devtools()],
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
UseFloating.displayName = 'useFloating';
UseFloating.title = 'useFloating';
