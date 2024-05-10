import * as React from 'react';
import type {FloatingRootContext, ReferenceElement} from '../types';
import type {ContextData, OpenChangeReason} from '../types';
import {useEffectEvent} from './utils/useEffectEvent';
import {createPubSub} from '../utils/createPubSub';
import {useId} from './useId';
import {useFloatingParentNodeId} from '../components/FloatingTree';

export interface UseFloatingRootOptions {
  open?: boolean;
  onOpenChange?: (
    open: boolean,
    event?: Event,
    reason?: OpenChangeReason,
  ) => void;
  elements: {
    reference: ReferenceElement | null;
    floating: HTMLElement | null;
  };
  nodeId?: string;
}

export function useFloatingRoot(
  options: UseFloatingRootOptions,
): FloatingRootContext {
  const {
    open = false,
    onOpenChange: onOpenChangeProp,
    elements: elementsProp,
    nodeId,
  } = options;

  const floatingId = useId();
  const dataRef = React.useRef<ContextData>({});
  const [events] = React.useState(() => createPubSub());
  const nested = useFloatingParentNodeId() != null;

  const onOpenChange = useEffectEvent(
    (open: boolean, event?: Event, reason?: OpenChangeReason) => {
      dataRef.current.openEvent = open ? event : undefined;
      events.emit('openchange', {open, event, reason, nested});
      onOpenChangeProp?.(open, event, reason);
    },
  );

  const elements = React.useMemo(
    () => ({
      reference: elementsProp.reference || null,
      floating: elementsProp.floating || null,
      domReference: (elementsProp.reference as Element | null) || null,
    }),
    [elementsProp.reference, elementsProp.floating],
  );

  const context = React.useMemo<FloatingRootContext>(
    () => ({
      dataRef,
      open,
      onOpenChange,
      elements,
      events,
      nodeId,
      floatingId,
    }),
    [open, onOpenChange, elements, events, nodeId, floatingId],
  );

  return context;
}
