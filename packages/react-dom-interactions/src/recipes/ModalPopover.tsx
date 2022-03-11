import type {Placement} from '@floating-ui/dom';
import React, {cloneElement, isValidElement, useMemo, useState} from 'react';
import mergeRefs from 'react-merge-refs';
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
  FloatingPortal,
  FloatingNode,
  useFloatingNodeId,
} from '..';

interface Props {
  render: (data: any) => React.ReactNode;
  placement?: Placement;
  id?: string;
}

export const ModalPopover: React.FC<Props> = ({
  children,
  render,
  placement,
}) => {
  const [open, setOpen] = useState(false);

  const nodeId = useFloatingNodeId();
  const {x, y, reference, floating, strategy, refs, context} = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), flip(), shift()],
    placement,
    nodeId,
  });

  const labelId = useId();
  const descriptionId = useId();

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context),
    useFocusTrap(context),
  ]);

  // Prevent this component from stealing the `ref`
  const stableRef = useMemo(
    () =>
      mergeRefs(
        isValidElement(children) ? [children.props.ref, reference] : [reference]
      ),
    [reference, children]
  );

  return (
    <FloatingNode id={nodeId}>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ref: stableRef}))}
      <FloatingPortal>
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
      </FloatingPortal>
    </FloatingNode>
  );
};
