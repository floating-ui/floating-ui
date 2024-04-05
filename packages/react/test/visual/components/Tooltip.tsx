import type {Placement} from '@floating-ui/react';
import {
  autoUpdate,
  flip,
  FloatingDelayGroup,
  FloatingPortal,
  offset,
  shift,
  useDelayGroup,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import {cloneElement, isValidElement, useId, useState} from 'react';

import {Button} from '../lib/Button';

type Delay = number | Partial<{open: number; close: number}>;

interface Props {
  label: string;
  placement?: Placement;
  delay?: Delay;
  children?: React.ReactNode;
}

export const Main = () => {
  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Tooltip</h1>
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <Tooltip label="My tooltip">
          <Button>My button</Button>
        </Tooltip>
      </div>
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <div className="flex gap-1">
          <FloatingDelayGroup delay={{open: 500, close: 200}} timeoutMs={200}>
            <Tooltip label="My tooltip">
              <Button>My button</Button>
            </Tooltip>
            <Tooltip label="My tooltip 2">
              <Button>My button</Button>
            </Tooltip>
            <Tooltip label="My tooltip 3">
              <Button>My button</Button>
            </Tooltip>
          </FloatingDelayGroup>
        </div>
      </div>
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

  const {refs, floatingStyles, context} = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), flip(), shift({padding: 8})],
    whileElementsMounted: autoUpdate,
  });

  const {delay: groupDelay, currentId, isInstantPhase} = useDelayGroup(context);

  const hover = useHover(context, {
    delay: groupDelay === 0 ? delay : groupDelay,
    move: false,
  });
  const focus = useFocus(context);
  const role = useRole(context, {role: 'tooltip'});
  const dismiss = useDismiss(context);

  const {getReferenceProps, getFloatingProps} = useInteractions([
    hover,
    focus,
    role,
    dismiss,
  ]);

  const instantDuration = 0;
  const openDuration = 750;
  const closeDuration = 250;

  const {isMounted, styles} = useTransitionStyles(context, {
    duration: isInstantPhase
      ? {
          open: instantDuration,
          close:
            currentId === context.floatingId ? closeDuration : instantDuration,
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
            role="presentation"
            ref={refs.setFloating}
            style={floatingStyles}
          >
            <div
              className="bg-black text-white p-1 px-2 rounded"
              style={styles}
              {...getFloatingProps()}
            >
              {label}
            </div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
}
