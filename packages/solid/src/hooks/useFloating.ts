// credits to Alexis Munsayac
// "https://github.com/lxsmnsyc/solid-floating-ui/tree/main/packages/solid-floating-ui",
import {ReferenceElement} from '@floating-ui/dom';
import {isElement} from '@floating-ui/utils/dom';
import {access} from '@solid-primitives/utils';
import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  mergeProps,
} from 'solid-js';
import {createMutable} from 'solid-js/store';

import {useUnsafeFloatingTree} from '../components/FloatingTree';
import {
  ContextData,
  FloatingContext,
  NarrowedElement,
  ReferenceType,
  UseFloatingOptions,
  UseFloatingReturn,
} from '../types';
import {createPubSub} from '../utils/createPubSub';
import {usePosition} from './usePosition';

export function useFloating<R extends ReferenceElement>(
  options?: UseFloatingOptions<R>,
): UseFloatingReturn<R> {
  const floatingId = createUniqueId();
  const [_domReference, setDomReference] =
    createSignal<NarrowedElement<R> | null>(null);

  const domReference = createMemo(
    () =>
      (options?.elements?.reference?.() || _domReference) as NarrowedElement<R>,
  );
  let domReferenceRef: NarrowedElement<R> | null = null;

  const events = createPubSub();
  const positionProps = mergeProps({transform: true}, options);
  const position = usePosition(positionProps);

  const dataRef = createMutable<ContextData>({
    openEvent: undefined,
    ...position,
  });

  const onOpenChange = (open: boolean, event?: Event) => {
    if (open) {
      // eslint-disable-next-line solid/reactivity
      dataRef.openEvent = event;
    }
    options?.onOpenChange?.(open, event);
  };

  const setPositionReference = (node: ReferenceType | null) => {
    const positionReference = isElement(node)
      ? {
          getBoundingClientRect: () => node.getBoundingClientRect(),
          contextElement: node,
        }
      : node;
    position.refs.setReference(positionReference as R | null);
  };

  const setReference = (node: R | null) => {
    if (isElement(node) || node === null) {
      domReferenceRef = node as NarrowedElement<R> | null;
      //@ts-ignore
      setDomReference(node as NarrowedElement<R> | null);
    }

    // Backwards-compatibility for passing a virtual element to `reference`
    // after it has set the DOM reference.
    if (
      isElement(position.refs.reference()) ||
      position.refs.reference() === null ||
      // Don't allow setting virtual elements using the old technique back to
      // `null` to support `positionReference` + an unstable `reference`
      // callback ref.
      (node !== null && !isElement(node))
    ) {
      position.refs.setReference(node);
    }
  };

  const context = createMemo(() => {
    const refs = mergeProps(
      {
        domReference: domReference(),
      },
      position.refs,
    );
    const elements = mergeProps({domReference}, position.elements);
    // eslint-disable-next-line solid/reactivity
    return mergeProps(
      {
        dataRef, //: mergeProps(dataRef, position),
        nodeId: options?.nodeId,
        floatingId,
        events,
        open: () => access(options?.open) ?? false,
        onOpenChange,
      },
      position,
      {refs, elements},
    );
  });

  //Add the context to the PortalNodes
  const tree = useUnsafeFloatingTree<R>();
  createEffect(() => {
    if (!tree?.()) return;
    const node = tree?.()?.nodesRef?.find(
      (node) => node.id === options?.nodeId,
    );
    if (node) {
      node.context = context() as FloatingContext<R>;
    }
  });

  return {
    get x() {
      return position.x;
    },
    get y() {
      return position.y;
    },
    get isPositioned() {
      return position.isPositioned;
    },
    get placement() {
      return position.placement;
    },
    get strategy() {
      return position.strategy;
    },
    get middlewareData() {
      return position.middlewareData;
    },
    get floatingStyles() {
      return position.floatingStyles;
    },
    get elements() {
      return {
        reference: position.elements.reference,
        floating: position.elements.floating,
        domReference,
      };
    },
    get refs() {
      const refs = mergeProps(position.refs, {
        setReference,
        setPositionReference,
        domReference: domReferenceRef,
      });
      return refs;
    },
    get context() {
      return context;
    },
    get update() {
      return position.update;
    },
  };
}
