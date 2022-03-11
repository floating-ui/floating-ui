import type {Placement} from '@floating-ui/dom';
import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
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
  useDelayGroupContext,
  useDelayGroup,
} from '..';
import {motion, AnimatePresence} from 'framer-motion';

interface Props {
  label: string;
  placement?: Placement;
}

export const Tooltip: React.FC<Props> = ({
  children,
  label,
  placement = 'top',
}) => {
  const {delay, currentId, setCurrentId} = useDelayGroupContext();
  const [open, setOpen] = useState(false);

  const onOpenChange = useCallback(
    (open) => {
      setOpen(open);

      if (open) {
        setCurrentId(label);
      }
    },
    [label, setCurrentId]
  );

  const {x, y, reference, floating, strategy, context, refs, update} =
    useFloating({
      placement,
      open,
      onOpenChange,
      middleware: [offset(5), flip(), shift({padding: 8})],
    });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useHover(context, {delay, restMs: 100}),
    useFocus(context),
    useRole(context, {role: 'tooltip'}),
    useDismiss(context, {referencePointerDown: true}),
    useDelayGroup(context, {id: label}),
  ]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [refs.reference, refs.floating, update, open]);

  const isGroupPhase = open && currentId && currentId !== label;

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ref: reference}))}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity: 0, scale: 0.85}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0}}
            transition={
              isGroupPhase
                ? {duration: 0.1}
                : {type: 'spring', damping: 20, stiffness: 300}
            }
            {...getFloatingProps({
              ref: floating,
              className: 'tooltip',
              style: {
                position: strategy,
                top: y ?? '',
                left: x ?? '',
              },
            })}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
