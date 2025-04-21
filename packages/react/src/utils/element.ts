import {isHTMLElement, isShadowRoot} from '@floating-ui/utils/dom';
import {isJSDOM} from './platform';
import {FOCUSABLE_ATTRIBUTE, TYPEABLE_SELECTOR} from './constants';

export function activeElement(doc: Document) {
  let activeElement = doc.activeElement;

  while (activeElement?.shadowRoot?.activeElement != null) {
    activeElement = activeElement.shadowRoot.activeElement;
  }

  return activeElement;
}

export function contains(parent?: Element | null, child?: Element | null) {
  if (!parent || !child) {
    return false;
  }

  const rootNode = child.getRootNode?.();

  // First, attempt with faster native method
  if (parent.contains(child)) {
    return true;
  }

  // then fallback to custom implementation with Shadow DOM support
  if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    while (next) {
      if (parent === next) {
        return true;
      }
      // @ts-ignore
      next = next.parentNode || next.host;
    }
  }

  // Give up, the result is false
  return false;
}

export function getTarget(event: Event) {
  if ('composedPath' in event) {
    return event.composedPath()[0];
  }

  // TS thinks `event` is of type never as it assumes all browsers support
  // `composedPath()`, but browsers without shadow DOM don't.
  return (event as Event).target;
}

export function isEventTargetWithin(
  event: Event,
  node: Node | null | undefined,
) {
  if (node == null) {
    return false;
  }

  if ('composedPath' in event) {
    return event.composedPath().includes(node);
  }

  // TS thinks `event` is of type never as it assumes all browsers support composedPath, but browsers without shadow dom don't
  const e = event as Event;
  return e.target != null && node.contains(e.target as Node);
}

export function isRootElement(element: Element): boolean {
  return element.matches('html,body');
}

export function getDocument(node: Element | null) {
  return node?.ownerDocument || document;
}

export function isTypeableElement(element: unknown): boolean {
  return isHTMLElement(element) && element.matches(TYPEABLE_SELECTOR);
}

export function isTypeableCombobox(element: Element | null) {
  if (!element) return false;
  return (
    element.getAttribute('role') === 'combobox' && isTypeableElement(element)
  );
}

export function matchesFocusVisible(element: Element | null) {
  // We don't want to block focus from working with `visibleOnly`
  // (JSDOM doesn't match `:focus-visible` when the element has `:focus`)
  if (!element || isJSDOM()) return true;
  try {
    return element.matches(':focus-visible');
  } catch (_e) {
    return true;
  }
}

export function getFloatingFocusElement(
  floatingElement: HTMLElement | null | undefined,
): HTMLElement | null {
  if (!floatingElement) {
    return null;
  }
  // Try to find the element that has `{...getFloatingProps()}` spread on it.
  // This indicates the floating element is acting as a positioning wrapper, and
  // so focus should be managed on the child element with the event handlers and
  // aria props.
  return floatingElement.hasAttribute(FOCUSABLE_ATTRIBUTE)
    ? floatingElement
    : floatingElement.querySelector(`[${FOCUSABLE_ATTRIBUTE}]`) ||
        floatingElement;
}
