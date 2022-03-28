import type {Placement} from '@floating-ui/dom';
import React, {cloneElement, isValidElement, useEffect, useState} from 'react';
import {
  offset,
  flip,
  shift,
  autoUpdate,
  useInteractions,
  useRole,
  useDismiss,
  useFocus,
  useHover,
  useFloating,
  safePolygon,
} from '..';
import {DebugSafePolygon} from '../recipe-utils/DebugSafePolygon';

interface Props {
  content: React.ReactNode;
  placement?: Placement;
}

export const SafePolygon: React.FC<Props> = ({
  children,
  content,
  placement = 'top',
}) => {
  const [points, setPoints] = useState<string | null>('');
  const [open, setOpen] = useState(false);

  const {x, y, reference, floating, strategy, context, refs, update} =
    useFloating({
      placement,
      open,
      onOpenChange: setOpen,
      middleware: [offset(5), flip(), shift({padding: 8})],
    });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useHover(context, {
      handleClose: safePolygon({debug: setPoints}),
    }),
    useFocus(context),
    useRole(context, {role: 'tooltip'}),
    useDismiss(context, {referencePointerDown: true}),
  ]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [refs.reference, refs.floating, update, open]);

  return (
    <>
      <DebugSafePolygon points={points} />
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ref: reference}))}
      {open && (
        <div
          {...getFloatingProps({
            ref: floating,
            className: 'tooltip',
            style: {
              position: strategy,
              top: y ?? '',
              left: x ?? '',
              background: 'white',
              color: 'black',
              padding: '4px 8px',
            },
          })}
        >
          {content}
        </div>
      )}
    </>
  );
};
