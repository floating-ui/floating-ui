import {
  autoUpdate,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import React, {cloneElement, isValidElement, useEffect, useState} from 'react';
import {useMediaQuery} from 'react-responsive';

import {Controls} from '../utils/Controls';

export const Main = () => {
  const [isTriggerExternal, setTriggerExternal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [externalRef, setExternalRef] = React.useState<HTMLElement | null>(
    null
  );
  return (
    <>
      <h1>Drawer</h1>
      <p>
        A dialog component that splits the screen on large screens and renders
        as modal on small screens.
      </p>
      <div className="DrawerContainer">
        <div className="container">
          {isTriggerExternal ? (
            <button
              ref={(el) => setExternalRef(el)}
              onClick={() => setOpen((prevOpen) => !prevOpen)}
            >
              External reference
            </button>
          ) : null}
          <button>Random button</button>
          <Drawer
            open={open}
            onOpenChange={setOpen}
            trigger={
              isTriggerExternal ? (
                externalRef
              ) : (
                <button>Internal reference</button>
              )
            }
            render={({labelId, descriptionId, close}) => (
              <>
                <h2 id={labelId}>A label/title</h2>
                <p id={descriptionId}>A description/paragraph</p>
                <button onClick={close}>Close</button>
              </>
            )}
          />
          <button>Next button</button>
        </div>
        <div id="drawer-root"></div>
      </div>
      <h2>External reference</h2>
      <Controls>
        <button
          onClick={() => setTriggerExternal(true)}
          style={{background: isTriggerExternal ? 'black' : ''}}
        >
          true
        </button>
        <button
          onClick={() => setTriggerExternal(false)}
          style={{background: !isTriggerExternal ? 'black' : ''}}
        >
          false
        </button>
      </Controls>
    </>
  );
};
interface Props {
  render: (data: {
    close: () => void;
    labelId: string;
    descriptionId: string;
  }) => React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement | HTMLElement | null;
}

export function Drawer({trigger, render, open: propOpen, onOpenChange}: Props) {
  const [stateOpen, setStateOpen] = useState(false);
  const controlled = propOpen !== undefined;
  const open = controlled ? propOpen : stateOpen;
  const setOpen = (nextOpen: boolean) => {
    if (!controlled) {
      setStateOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  const isLargeScreen = useMediaQuery({
    query: '(min-width: 1000px)',
  });
  const {reference, floating, refs, update, context} = useFloating<HTMLElement>(
    {
      open,
      onOpenChange: setOpen,
    }
  );

  React.useLayoutEffect(() => {
    if (trigger instanceof HTMLElement) {
      refs.setReference(trigger);
    }
  }, [refs, trigger]);

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const modal = !isLargeScreen;

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context, {
      outsidePress: modal,
      outsidePressEvent: 'mousedown',
    }),
  ]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [open, update, refs.reference, refs.floating]);

  const content = (
    <FloatingFocusManager
      context={context}
      modal={modal}
      closeOnFocusOut={modal}
      order={['reference', 'floating']}
    >
      <div
        {...getFloatingProps({
          className: 'Drawer' + (modal ? ' DrawerModal' : ''),
          ref: floating,
          'aria-labelledby': labelId,
          'aria-describedby': descriptionId,
        })}
      >
        {render({
          labelId,
          descriptionId,
          close: () => setOpen(false),
        })}
      </div>
    </FloatingFocusManager>
  );

  return (
    <>
      {isValidElement(trigger) &&
        cloneElement(trigger, getReferenceProps({ref: reference}))}
      <FloatingPortal id="drawer-root">
        {open &&
          (modal ? (
            <FloatingOverlay
              lockScroll
              style={{background: 'rgba(0, 0, 0, 0.8)', zIndex: 1}}
            >
              {content}
            </FloatingOverlay>
          ) : (
            content
          ))}
      </FloatingPortal>
    </>
  );
}
