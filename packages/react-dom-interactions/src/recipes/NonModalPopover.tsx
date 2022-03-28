import {autoUpdate, Placement} from '@floating-ui/dom';
import React, {
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  useInteractions,
  useRole,
  useClick,
  useDismiss,
  useFocusTrap,
  useId,
} from '..';
import mergeRefs from 'react-merge-refs';

interface Props {
  render: (data: any) => React.ReactNode;
  placement?: Placement;
}

export const Popover: React.FC<Props> = ({children, render, placement}) => {
  const [open, setOpen] = useState(false);

  const {x, y, reference, floating, strategy, refs, update, context} =
    useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [offset(5), flip(), shift()],
      placement,
    });

  const labelId = useId();
  const descriptionId = useId();

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context),
    useFocusTrap(context, {
      modal: false,
    }),
  ]);

  useEffect(() => {
    const reference = refs.reference.current;
    const floating = refs.floating.current;

    if (open && reference && floating) {
      return autoUpdate(reference, floating, update);
    }
  }, [open, update, refs.reference, refs.floating]);

  const stableRef = useMemo(
    () =>
      mergeRefs(
        isValidElement(children) ? [children.props.ref, reference] : [reference]
      ),
    [reference, children]
  );

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ref: stableRef}))}
      {open && (
        <div
          {...getFloatingProps({
            className: 'popup',
            ref: floating,
            style: {
              position: strategy,
              top: y ?? '',
              left: x ?? '',
            },
          })}
        >
          {render({
            labelId,
            descriptionId,
            close: () => {
              setOpen(false);
              (refs.reference.current as HTMLElement).focus();
            },
          })}
        </div>
      )}
    </>
  );
};
