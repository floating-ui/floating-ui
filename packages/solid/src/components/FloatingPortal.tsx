import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  JSX,
  mergeProps,
  onCleanup,
  Setter,
  Show,
  useContext,
} from 'solid-js';
import {createStore} from 'solid-js/store';
import {Portal} from 'solid-js/web';

import type {ExtendedRefs} from '../types';
import {createAttribute} from '../utils/createAttribute';
import {destructure} from '../utils/destructure';
import {
  disableFocusInside,
  enableFocusInside,
  getNextTabbable,
  getPreviousTabbable,
  isOutsideEvent,
} from '../utils/tabbable';
import {FocusGuard, HIDDEN_STYLES} from './FocusGuard';

type FocusManagerState = {
  modal: boolean;
  open: boolean;
  onOpenChange: (open: boolean, event: Event) => void;
  refs: ExtendedRefs<any>;
  closeOnFocusOut: boolean;
} | null;
type PortalRefs = {
  beforeInsideRef: HTMLSpanElement | null;
  afterInsideRef: HTMLSpanElement | null;
  beforeOutsideRef: HTMLSpanElement | null;
  afterOutsideRef: HTMLSpanElement | null;
};
const PortalContext = createContext<null | {
  preserveTabOrder: Accessor<boolean>;
  portalNode: Accessor<HTMLElement | null>;
  setFocusManagerState: Setter<FocusManagerState>;
  refs: PortalRefs;
  setRefs: Setter<Partial<PortalRefs>>;
}>(null);

export function useFloatingPortalNode(props: {
  id?: string;
  root?: HTMLElement | null;
}) {
  // const [portalNode, setPortalNode] = createSignal<HTMLElement | null>(null);

  const uniqueId = createUniqueId();
  const portalContext = usePortalContext();

  const data = createMemo(() => ({
    id: props.id,
    root: props.root,
    portalContext,
    uniqueId,
  }));

  let dataRef:
    | {
        id: string | undefined;
        root: HTMLElement | null | undefined;
        portalContext: any;
        uniqueId: string;
      }
    | undefined = undefined;

  const [portalNode, setPortalNode] = createSignal<HTMLElement | null>(null);
  onCleanup(() => {
    portalNode()?.remove();
  });

  // const portalNode = createMemo(() => {
  createEffect(() => {
    if (dataRef === data()) return;
    // if (!document || isServer) return null;
    dataRef = data();

    const {id, root, portalContext, uniqueId} = dataRef;

    const existingIdRoot = id ? document.getElementById(id) : null;
    const attr = createAttribute('portal');

    if (existingIdRoot) {
      const subRoot = document.createElement('div');
      subRoot.id = uniqueId;
      subRoot.setAttribute(attr, '');
      existingIdRoot.appendChild(subRoot);
      // return subRoot;
      setPortalNode(subRoot);
      return;
    }

    let container = root || portalContext?.portalNode();

    container = container || document.body;

    let idWrapper: HTMLDivElement | null = null;
    if (id) {
      idWrapper = document.createElement('div');
      idWrapper.id = id;
      container.appendChild(idWrapper);
    }

    const subRoot = document.createElement('div');

    subRoot.id = uniqueId;
    subRoot.setAttribute(attr, '');

    container = idWrapper || container;
    container.appendChild(subRoot);
    setPortalNode(subRoot);
    // return subRoot;
  });

  return portalNode;
}

interface FloatingPortalProps {
  children?: JSX.Element;
  id?: string;
  root?: HTMLElement | null;
  preserveTabOrder?: boolean;
  useShadow?: boolean;
}

/**
 * Portals the floating element into a given container element — by default,
 * outside of the app root and into the body.
 * @see https://floating-ui.com/docs/FloatingPortal
 */
export function FloatingPortal(props: FloatingPortalProps): JSX.Element {
  const [focusManagerState, setFocusManagerState] =
    createSignal<FocusManagerState>(null);
  const mergedProps = mergeProps({preserveTabOrder: true}, props);
  const {preserveTabOrder} = destructure(mergedProps);
  const portalNode = useFloatingPortalNode({
    id: mergedProps.id,
    root: mergedProps.root,
  });

  // let beforeOutsideRef:HTMLSpanElement|null=(null);
  // let afterOutsideRef:HTMLSpanElement|null=(null);
  // let beforeInsideRef:HTMLSpanElement|null=(null);
  // let afterInsideRef:HTMLSpanElement|null=(null);
  const [refs, setRefs] = createStore<PortalRefs>({
    beforeOutsideRef: null,
    afterOutsideRef: null,
    beforeInsideRef: null,
    afterInsideRef: null,
  });

  const shouldRenderGuards = createMemo(
    () =>
      // The FocusManager and therefore floating element are currently open/
      // rendered.
      !!focusManagerState() &&
      // Guards are only for non-modal focus management.
      !focusManagerState()?.modal &&
      // Don't render if unmount is transitioning.
      focusManagerState()?.open &&
      mergedProps.preserveTabOrder &&
      !!(mergedProps.root || portalNode()),
  );

  // https://codesandbox.io/s/tabbable-portal-f4tng?file=/src/TabbablePortal.tsx
  createEffect(() => {
    if (!portalNode() || !preserveTabOrder() || focusManagerState()?.modal) {
      return;
    }

    // Make sure elements inside the portal element are tabbable only when the
    // portal has already been focused, either by tabbing into a focus trap
    // element outside or using the mouse.
    function onFocus(event: FocusEvent) {
      const portalNodeRef = portalNode();
      if (portalNodeRef && isOutsideEvent(event)) {
        const focusing = event.type === 'focusin';
        const manageFocus = focusing ? enableFocusInside : disableFocusInside;
        manageFocus(portalNodeRef);
      }
    }
    // Listen to the event on the capture phase so they run before the focus
    // trap elements onFocus prop is called.
    portalNode()?.addEventListener('focusin', onFocus, true);
    portalNode()?.addEventListener('focusout', onFocus, true);

    onCleanup(() => {
      portalNode()?.removeEventListener('focusin', onFocus, true);
      portalNode()?.removeEventListener('focusout', onFocus, true);
    });
  });

  return (
    <PortalContext.Provider
      value={{
        refs,
        setRefs,
        portalNode,
        setFocusManagerState,
        preserveTabOrder,
      }}
    >
      <Show when={shouldRenderGuards() && portalNode()}>
        <FocusGuard
          data-type="outside"
          ref={(el) => setRefs({beforeOutsideRef: el})}
          onFocus={(event) => {
            const node = portalNode();
            if (isOutsideEvent(event, node)) {
              node && enableFocusInside(node);
              refs.beforeInsideRef?.focus();
            } else {
              const prevTabbable =
                getPreviousTabbable() || focusManagerState()?.refs.reference();
              prevTabbable?.focus();
            }
          }}
        />
        <span aria-owns={portalNode()?.id} style={HIDDEN_STYLES} />
      </Show>
      <Show when={portalNode()}>
        <Portal mount={portalNode() ?? undefined} useShadow={!!props.useShadow}>
          {mergedProps.children}
        </Portal>
      </Show>

      <Show when={shouldRenderGuards() && portalNode()}>
        <FocusGuard
          data-type="outside"
          ref={(el) => setRefs({afterOutsideRef: el})}
          onFocus={(event) => {
            if (isOutsideEvent(event, portalNode())) {
              const node = portalNode();
              //Call that directly as it's not called through useEffect at the correct time
              node && enableFocusInside(node);
              refs.afterInsideRef?.focus();
            } else {
              const nextTabbable =
                getNextTabbable() || focusManagerState()?.refs.reference();
              nextTabbable?.focus();
              focusManagerState()?.closeOnFocusOut &&
                focusManagerState()?.onOpenChange(false, event);
            }
          }}
        />
      </Show>
    </PortalContext.Provider>
  );
}

export const usePortalContext = () => useContext(PortalContext);
