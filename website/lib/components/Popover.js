import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  limitShift,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import * as React from 'react';

import {remToPx} from '../utils/remToPx';

export function usePopover({
  initialOpen = false,
  placement = 'bottom',
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}) {
  const [uncontrolledOpen, setUncontrolledOpen] =
    React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState();
  const [descriptionId, setDescriptionId] = React.useState();

  const arrowRef = React.useRef(null);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(remToPx(10 / 16)),
      flip({
        fallbackAxisSideDirection: 'end',
        crossAxis: false,
      }),
      shift({
        limiter: limitShift({offset: remToPx(15 / 16)}),
      }),
      arrow({
        element: arrowRef,
        padding: 5,
      }),
    ],
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  const transition = useTransitionStyles(context, {
    duration: {
      open: 400,
      close: 75,
    },
    initial: ({side}) => ({
      opacity: 0,
      transform: {
        top: 'translateY(-0.5rem)',
        right: 'translateX(0.5rem)',
        bottom: 'translateY(0.5rem)',
        left: 'translateX(-0.5rem)',
      }[side],
    }),
    close: () => ({
      opacity: 0,
      transform: 'scale(0.97)',
    }),
  });

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      ...transition,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
      arrowRef,
    }),
    [
      open,
      setOpen,
      interactions,
      data,
      modal,
      labelId,
      descriptionId,
      transition,
    ],
  );
}

const PopoverContext = React.createContext(null);

export const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);

  if (context == null) {
    throw new Error(
      'Popover components must be wrapped in <Popover />',
    );
  }

  return context;
};

export function Popover({
  children,
  modal = false,
  ...restOptions
}) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover({modal, ...restOptions});
  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  );
}

export const PopoverTrigger = React.forwardRef(
  function PopoverTrigger(
    {children, asChild = false, ...props},
    propRef,
  ) {
    const context = usePopoverContext();
    const childrenRef = children.ref;
    const ref = useMergeRefs([
      context.refs.setReference,
      propRef,
      childrenRef,
    ]);

    // `asChild` allows the user to pass any element as the anchor
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          'data-state': context.open ? 'open' : 'closed',
        }),
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        // The user can style the trigger based on the state
        data-state={context.open ? 'open' : 'closed'}
        {...context.getReferenceProps(props)}
      >
        {children}
      </button>
    );
  },
);

export const PopoverContent = React.forwardRef(
  function PopoverContent(props, propRef) {
    const {context: floatingContext, ...context} =
      usePopoverContext();
    const ref = useMergeRefs([
      context.refs.setFloating,
      propRef,
    ]);

    if (!context.isMounted) return null;

    return (
      <FloatingPortal>
        <FloatingFocusManager
          context={floatingContext}
          modal={context.modal}
        >
          <div
            ref={ref}
            style={{
              position: context.strategy,
              top: context.y ?? 0,
              left: context.x ?? 0,
              width: 'max-content',
              ...props.style,
              ...context.styles,
            }}
            aria-labelledby={context.labelId}
            aria-describedby={context.descriptionId}
            {...context.getFloatingProps(props)}
          >
            {props.children}
            <FloatingArrow
              ref={context.arrowRef}
              context={floatingContext}
              height={10}
              fill="white"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={1}
              tipRadius={2}
            />
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    );
  },
);

export const PopoverHeading = React.forwardRef(
  function PopoverHeading({children, ...props}, ref) {
    const {setLabelId} = usePopoverContext();
    const id = useId();

    // Only sets `aria-labelledby` on the Popover root element
    // if this component is mounted inside it.
    React.useLayoutEffect(() => {
      setLabelId(id);
      return () => setLabelId(undefined);
    }, [id, setLabelId]);

    return (
      <h2 {...props} ref={ref} id={id}>
        {children}
      </h2>
    );
  },
);

export const PopoverDescription = React.forwardRef(
  function PopoverDescription({children, ...props}, ref) {
    const {setDescriptionId} = usePopoverContext();
    const id = useId();

    // Only sets `aria-describedby` on the Popover root element
    // if this component is mounted inside it.
    React.useLayoutEffect(() => {
      setDescriptionId(id);
      return () => setDescriptionId(undefined);
    }, [id, setDescriptionId]);

    return (
      <p {...props} ref={ref} id={id}>
        {children}
      </p>
    );
  },
);

export const PopoverClose = React.forwardRef(
  function PopoverClose({children, ...props}, ref) {
    const {setOpen} = usePopoverContext();
    return (
      <button
        type="button"
        {...props}
        ref={ref}
        onClick={(event) => {
          props.onClick?.(event);
          setOpen(false);
        }}
      >
        {children}
      </button>
    );
  },
);
