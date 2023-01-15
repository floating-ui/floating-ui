import {
  autoUpdate,
  flip,
  FloatingDelayGroup,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useDelayGroup,
  useDelayGroupContext,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import {cloneElement, isValidElement, useId, useState} from 'react';

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
        <Tooltip label="My tooltip 3" delay={delay}>
          <button>My button</button>
        </Tooltip>

        <div>
          <FloatingDelayGroup delay={{open: 500, close: 200}} timeoutMs={200}>
            <Tooltip label="My tooltip" delay={delay}>
              <button>My button</button>
            </Tooltip>
            <Tooltip label="My tooltip 2" delay={delay}>
              <button>My button</button>
            </Tooltip>
            <Tooltip label="My tooltip 3" delay={delay}>
              <button>My button</button>
            </Tooltip>
          </FloatingDelayGroup>
        </div>
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
  const {delay: groupDelay, currentId, isInstantPhase} = useDelayGroupContext();
  const [open, setOpen] = useState(false);
  const id = useId();

  const {x, y, strategy, refs, context} = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), flip(), shift({padding: 8})],
    whileElementsMounted: autoUpdate,
  });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useHover(context, {
      delay: groupDelay === 0 ? delay : groupDelay,
      move: false,
    }),
    useFocus(context),
    useRole(context, {role: 'tooltip'}),
    useDismiss(context),
  ]);

  useDelayGroup(context, {id});

  const instantDuration = 0;
  const openDuration = 750;
  const closeDuration = 250;

  const {isMounted, styles} = useTransitionStyles(context, {
    duration: isInstantPhase
      ? {
          open: instantDuration,
          close: currentId === id ? closeDuration : instantDuration,
        }
      : {
          open: openDuration,
          close: closeDuration,
        },
    initial: {
      opacity: 0,
      scale: '0.925',
    },
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
        cloneElement(children, getReferenceProps({ref: refs.setReference}))}
      <FloatingPortal>
        {isMounted && (
          <div
            ref={refs.setFloating}
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
      </FloatingPortal>
    </>
  );
}
