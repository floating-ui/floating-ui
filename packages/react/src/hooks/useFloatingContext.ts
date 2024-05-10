import * as React from 'react';
import type {FloatingRootContext} from '../types';
import {
  useClick,
  useFocus,
  type ContextData,
  type OpenChangeReason,
} from '../types';
import {useEffectEvent} from './utils/useEffectEvent';
import {createPubSub} from '../utils/createPubSub';
import {useId} from './useId';
import {useFloatingParentNodeId} from '../components/FloatingTree';

export interface UseFloatingRootProps {
  open?: boolean;
  onOpenChange?: (
    open: boolean,
    event?: Event,
    reason?: OpenChangeReason,
  ) => void;
  elements?: {
    reference?: Element | null;
    floating?: HTMLElement | null;
  };
  nodeId?: string;
}

export function useFloatingRoot(props: UseFloatingRootProps) {
  const {
    open = false,
    onOpenChange: onOpenChangeProp,
    elements: elementsProp = {},
    nodeId,
  } = props;

  const floatingId = useId();
  const dataRef = React.useRef<ContextData>({});
  const [events] = React.useState(() => createPubSub());
  const nested = useFloatingParentNodeId() != null;

  const elements = React.useMemo(
    () => ({
      reference: elementsProp.reference || null,
      domReference: elementsProp.reference || null,
      floating: elementsProp.floating || null,
    }),
    [elementsProp.floating, elementsProp.reference],
  );

  const onOpenChange = useEffectEvent(
    (open: boolean, event?: Event, reason?: OpenChangeReason) => {
      dataRef.current.openEvent = open ? event : undefined;
      events.emit('openchange', {open, event, reason, nested});
      onOpenChangeProp?.(open, event, reason);
    },
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

function Root() {
  const [open, setOpen] = React.useState(false);
  const context = useFloatingRoot({
    open,
    onOpenChange: setOpen,
    elements: {},
  });
  const click = useClick(context);
  const focus = useFocus(context);
}
