import React, {cloneElement, isValidElement, useEffect, useState} from 'react';
import {
  Placement,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  useRole,
  useDismiss,
} from '@floating-ui/react-dom-interactions';
import {Controls} from '../utils/Controls';

type Delay = number | Partial<{open: number; close: number}>;

interface Props {
  label: string;
  placement?: Placement;
  delay?: Delay;
}

export const Main = () => {
  const [delay, setDelay] = useState<Delay>(0);

  return (
    <>
      <h1>Tooltip</h1>
      <p>
        A floating element that displays a label describing another element.
      </p>
      <div className="container">
        <Tooltip label="My tooltip" delay={delay}>
          <button>My button</button>
        </Tooltip>
      </div>
      <Controls>
        <button
          onClick={() => setDelay(0)}
          style={{background: delay === 0 ? 'black' : ''}}
        >
          delay: 0
        </button>
        <button
          onClick={() => setDelay(500)}
          style={{background: delay === 500 ? 'black' : ''}}
        >
          delay: 500
        </button>
        <button
          onClick={() => setDelay({open: 500})}
          style={{
            background:
              typeof delay === 'object' && delay.open === 500 ? 'black' : '',
          }}
        >
          {String('delay: {open: 500}')}
        </button>
        <button
          onClick={() => setDelay({close: 500})}
          style={{
            background:
              typeof delay === 'object' && delay.close === 500 ? 'black' : '',
          }}
        >
          {String('delay: {close: 500}')}
        </button>
      </Controls>
    </>
  );
};

export const Tooltip: React.FC<Props> = ({
  children,
  label,
  placement = 'top',
  delay = 0,
}) => {
  const [open, setOpen] = useState(false);

  const {x, y, reference, floating, strategy, context, refs, update} =
    useFloating({
      placement,
      open,
      onOpenChange: setOpen,
      middleware: [offset(5), flip(), shift({padding: 8})],
    });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useHover(context, {delay}),
    useFocus(context),
    useRole(context, {role: 'tooltip'}),
    useDismiss(context),
  ]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [refs.reference, refs.floating, update, open]);

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ref: reference}))}
      {open && (
        <div
          {...getFloatingProps({
            ref: floating,
            className: 'Tooltip',
            style: {
              position: strategy,
              top: y ?? '',
              left: x ?? '',
            },
          })}
        >
          {label}
        </div>
      )}
    </>
  );
};
