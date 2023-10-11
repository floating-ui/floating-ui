// credits to Alexis Munsayac
// "https://github.com/lxsmnsyc/solid-floating-ui/tree/main/packages/solid-floating-ui",
import {ReferenceElement} from '@floating-ui/dom';
import {createEffect, createMemo, createUniqueId, mergeProps} from 'solid-js';

import {useFloatingTree} from '../components/FloatingTree';
import {ContextData, UseFloatingOptions, UseFloatingReturn} from '../types';
import {createPubSub} from '../utils/createPubSub';
import {usePosition} from './usePosition';

export function useFloating<R extends ReferenceElement>(
  options: UseFloatingOptions<R>
): UseFloatingReturn<R> {
  const floatingId = createUniqueId();
  const events = createPubSub();
  const position = usePosition({transform: true, ...options});
  // eslint-disable-next-line prefer-const
  let dataRef: ContextData = {};

  const onOpenChange = (open: boolean, event?: Event) => {
    if (open) {
      dataRef.openEvent = event; //what do we need that for? It is not typed in any type!?
    }
    options.onOpenChange?.(open, event);
  };

  // createEffect(() => {
  //   const currentReference = position.refs.reference();
  //   const currentFloating = position.refs.floating();

  //   // Subscribe to other reactive properties
  //   ignore(options?.middleware);
  //   placement();
  //   strategy();

  //   if (currentReference && currentFloating) {
  //     if (options?.whileElementsMounted) {
  //       console.log({currentFloating, currentReference});
  //       return;
  //       const cleanup = options.whileElementsMounted(
  //         currentReference,
  //         currentFloating,
  //         position.update
  //       );
  //       onCleanup(cleanup);
  //     } else {
  //       position.update();
  //     }
  //   }
  // });

  const context = createMemo(() => {
    return mergeProps(
      {
        dataRef: mergeProps(dataRef, position),
        nodeId: options?.nodeId,
        floatingId,
        events,
        open: options.open ?? (() => false),
        onOpenChange,
      },
      position
    );
  });

  //Add the context to the PortalNodes
  const tree = useFloatingTree<R>();
  createEffect(() => {
    const node = tree()?.nodesRef.find((node) => node.id === options.nodeId);
    if (node) {
      node.context = context();
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
    // get elements() {
    //   return {
    //     reference: reference(),
    //     floating: floating(),
    //   };
    // },
    get refs() {
      return position.refs;
    },
    get context() {
      return context;
    },
    get update() {
      return position.update;
    },
  };
}
