import {
  autoUpdate,
  flip,
  FloatingPortal,
  inline,
  offset,
  shift,
  useDelayGroup,
  useDelayGroupContext,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import * as React from 'react';
import {useId} from 'react';

export function useTooltip({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
} = {}) {
  const {delay, isInstantPhase} = useDelayGroupContext();
  const [uncontrolledOpen, setUncontrolledOpen] =
    React.useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(10),
      inline(),
      flip({
        fallbackAxisSideDirection: 'start',
        crossAxis: placement.includes('-'),
      }),
      shift({padding: 5}),
    ],
  });

  const context = data.context;

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
    restMs: isInstantPhase ? 0 : 50,
    delay,
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, {role: 'tooltip'});

  const interactions = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data]
  );
}

const TooltipContext = React.createContext(null);

export const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);

  if (context == null) {
    throw new Error(
      'Tooltip components must be wrapped in <Tooltip />'
    );
  }

  return context;
};

export function Tooltip({children, ...options}) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const tooltip = useTooltip(options);
  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = React.forwardRef(
  function TooltipTrigger(
    {children, asChild = false, ...props},
    propRef
  ) {
    const context = useTooltipContext();
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
        })
      );
    }

    return (
      <button
        ref={ref}
        // The user can style the trigger based on the state
        data-state={context.open ? 'open' : 'closed'}
        {...context.getReferenceProps(props)}
      >
        {children}
      </button>
    );
  }
);

export const TooltipContent = React.forwardRef(
  function TooltipContent(props, propRef) {
    const {context: floatingContext, ...context} =
      useTooltipContext();
    const ref = useMergeRefs([
      context.refs.setFloating,
      propRef,
    ]);

    const id = useId();

    const {isInstantPhase, currentId} = useDelayGroupContext();

    useDelayGroup(floatingContext, {
      id,
    });

    const {isMounted, styles} = useTransitionStyles(
      floatingContext,
      {
        duration: isInstantPhase
          ? {open: 100, close: id === currentId ? 500 : 100}
          : {open: 500, close: 150},
        initial: {
          opacity: 0,
          transform: 'scale(0.95)',
        },
      }
    );

    return (
      <FloatingPortal id="tooltip-portal">
        {isMounted && (
          <div
            ref={ref}
            className="
              bg-gray-50 shadow-lg dark:bg-gray-600 text-gray-1000 
              dark:text-gray-50 rounded p-2 text-sm pointer-events-none
            "
            style={{
              position: context.strategy,
              top: context.y ?? 0,
              left: context.x ?? 0,
              width: 'max-content',
              maxWidth: 'min(calc(100vw - 10px), 25rem)',
              ...props.style,
              ...styles,
            }}
            {...context.getFloatingProps(props)}
          />
        )}
      </FloatingPortal>
    );
  }
);
