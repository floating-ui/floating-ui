import * as React from 'react';
import type {FloatingRootContext, ReferenceElement} from '../types';
import type {ContextData, OpenChangeReason} from '../types';
import {useEffectEvent} from './utils/useEffectEvent';
import {createPubSub} from '../utils/createPubSub';
import {useId} from './useId';
import {useFloatingParentNodeId} from '../components/FloatingTree';

export interface UseFloatingRootContextOptions {
  open?: boolean;
  onOpenChange?: (
    open: boolean,
    event?: Event,
    reason?: OpenChangeReason,
  ) => void;
  elements: {
    reference: Element | null;
    floating: HTMLElement | null;
  };
}

export function useFloatingRootContext(
  options: UseFloatingRootContextOptions,
): FloatingRootContext {
  const {
    open = false,
    onOpenChange: onOpenChangeProp,
    elements: elementsProp,
  } = options;

  const floatingId = useId();
  const dataRef = React.useRef<ContextData>({});
  const [events] = React.useState(() => createPubSub());
  const nested = useFloatingParentNodeId() != null;

  const [positionReference, setPositionReference] =
    React.useState<ReferenceElement | null>(elementsProp.reference);

  const onOpenChange = useEffectEvent(
    (open: boolean, event?: Event, reason?: OpenChangeReason) => {
      dataRef.current.openEvent = open ? event : undefined;
      events.emit('openchange', {open, event, reason, nested});
      onOpenChangeProp?.(open, event, reason);
    },
  );

  const refs = React.useMemo(
    () => ({
      setPositionReference,
    }),
    [],
  );

  const elements = React.useMemo(
    () => ({
      reference: positionReference || elementsProp.reference || null,
      floating: elementsProp.floating || null,
      domReference: elementsProp.reference as Element | null,
    }),
    [positionReference, elementsProp.reference, elementsProp.floating],
  );

  const context = React.useMemo<FloatingRootContext>(
    () => ({
      dataRef,
      open,
      onOpenChange,
      elements,
      events,
      floatingId,
      refs,
    }),
    [open, onOpenChange, elements, events, floatingId, refs],
  );

  return context;
}
