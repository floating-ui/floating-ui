import {
  autoUpdate,
  flip,
  offset,
  Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import {cloneElement, isValidElement, useState} from 'react';

import {Controls} from '../utils/Controls';

type Delay = number | Partial<{open: number; close: number}>;

interface Props {
  label: string;
  placement?: Placement;
  delay?: Delay;
  children?: React.ReactNode;
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

export function Tooltip({
  children,
  label,
  placement = 'top',
  delay = 0,
}: Props) {
  const [open, setOpen] = useState(false);

  const {x, y, reference, floating, strategy, context} = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), flip(), shift({padding: 8})],
    whileElementsMounted: autoUpdate,
  });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useHover(context, {delay}),
    useFocus(context),
    useRole(context, {role: 'tooltip'}),
    useDismiss(context),
  ]);

  const {isMounted, styles} = useTransitionStyles(context, {
    duration: {open: 750, close: 250},
    initial: ({side}) => ({
      opacity: 0,
      transform: {
        top: 'translateY(5px)',
        right: 'translateX(-5px)',
        bottom: 'translateY(-5px)',
        left: 'translateX(5px)',
      }[side],
    }),
    common: ({side}) => ({
      transitionTimingFunction: 'cubic-bezier(.18,.87,.4,.97)',
      transformOrigin: {
        top: 'bottom',
        left: 'right',
        bottom: 'top',
        right: 'left',
      }[side],
    }),
  });

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ref: reference}))}
      {isMounted && (
        <div
          ref={floating}
          className="Tooltip"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            ...styles,
          }}
          {...getFloatingProps()}
        >
          {label}
        </div>
      )}
    </>
  );
}
