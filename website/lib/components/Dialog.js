import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
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

export function useDialog({
  initialOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}) {
  const [uncontrolledOpen, setUncontrolledOpen] =
    React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState();
  const [descriptionId, setDescriptionId] = React.useState();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  });
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    }),
    [open, setOpen, interactions, data, labelId, descriptionId],
  );
}

const DialogContext = React.createContext(null);

export const useDialogContext = () => {
  const context = React.useContext(DialogContext);

  if (context == null) {
    throw new Error(
      'Dialog components must be wrapped in <Dialog />',
    );
  }

  return context;
};

export function Dialog({children, ...options}) {
  const dialog = useDialog(options);
  return (
    <DialogContext.Provider value={dialog}>
      {children}
    </DialogContext.Provider>
  );
}

export const DialogTrigger = React.forwardRef(
  function DialogTrigger(
    {children, asChild = false, ...props},
    propRef,
  ) {
    const context = useDialogContext();
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
        // The user can style the trigger based on the state
        data-state={context.open ? 'open' : 'closed'}
        {...context.getReferenceProps(props)}
      >
        {children}
      </button>
    );
  },
);

export const DialogContent = React.forwardRef(
  function DialogContent(props, propRef) {
    const {context: floatingContext, ...context} =
      useDialogContext();
    const ref = useMergeRefs([
      context.refs.setFloating,
      propRef,
    ]);

    const backdropTransition = useTransitionStyles(
      floatingContext,
      {duration: {open: 200, close: 100}},
    );

    const floatingTransition = useTransitionStyles(
      floatingContext,
      {
        duration: {open: 400, close: 100},
        initial: {
          opacity: 0,
          transform: 'translateY(0.25rem)',
        },
        close: {
          opacity: 0,
          transform: 'scale(0.95)',
        },
      },
    );

    return (
      <FloatingPortal>
        {backdropTransition.isMounted && (
          <>
            <FloatingOverlay
              className="grid place-items-center bg-gray-1000/60 backdrop-blur-sm"
              lockScroll
              style={backdropTransition.styles}
            />
            <div className="fixed top-0 right-0 left-0 bottom-0 grid place-items-center text-black">
              <FloatingFocusManager context={floatingContext}>
                <div
                  ref={ref}
                  aria-labelledby={context.labelId}
                  aria-describedby={context.descriptionId}
                  style={floatingTransition.styles}
                  {...context.getFloatingProps(props)}
                >
                  {props.children}
                </div>
              </FloatingFocusManager>
            </div>
          </>
        )}
      </FloatingPortal>
    );
  },
);

export const DialogHeading = React.forwardRef(
  function DialogHeading({children, ...props}, ref) {
    const {setLabelId} = useDialogContext();
    const id = useId();

    // Only sets `aria-labelledby` on the Dialog root element
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

export const DialogDescription = React.forwardRef(
  function DialogDescription({children, ...props}, ref) {
    const {setDescriptionId} = useDialogContext();
    const id = useId();

    // Only sets `aria-describedby` on the Dialog root element
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

export const DialogClose = React.forwardRef(function DialogClose(
  {children, ...props},
  ref,
) {
  const {setOpen} = useDialogContext();
  return (
    <button
      type="button"
      {...props}
      ref={ref}
      onClick={() => setOpen(false)}
    >
      {children}
    </button>
  );
});
