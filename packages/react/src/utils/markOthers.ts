// Modified to add conditional `aria-hidden` support:
// https://github.com/theKashey/aria-hidden/blob/9220c8f4a4fd35f63bee5510a9f41a37264382d4/src/index.ts
type Undo = () => void;

let counterMap = new WeakMap<Element, number>();
let uncontrolledNodes = new WeakMap<Element, boolean>();
let markerMap: Record<string, WeakMap<Element, number>> = {};
let lockCount = 0;

export const supportsInert = (): boolean =>
  typeof HTMLElement !== 'undefined' && 'inert' in HTMLElement.prototype;

const getDefaultParent = (originalTarget: Element[]): HTMLElement | null => {
  if (typeof document === 'undefined') {
    return null;
  }
  const sampleTarget = originalTarget[0];
  return sampleTarget.ownerDocument.body;
};

const unwrapHost = (node: Element | ShadowRoot): Element | null =>
  node && ((node as ShadowRoot).host || unwrapHost(node.parentNode as Element));

const correctTargets = (parent: HTMLElement, targets: Element[]): Element[] =>
  targets
    .map((target) => {
      if (parent.contains(target)) {
        return target;
      }

      const correctedTarget = unwrapHost(target);

      if (correctedTarget && parent.contains(correctedTarget)) {
        return correctedTarget;
      }

      return null;
    })
    .filter((x): x is Element => Boolean(x));

const applyAttributeToOthers = (
  originalTarget: Element | Element[],
  parentNode: HTMLElement,
  ariaHidden: boolean,
  inert: boolean
): Undo => {
  const markerName = 'data-floating-ui-inert';
  const controlAttribute = inert ? 'inert' : ariaHidden ? 'aria-hidden' : null;
  const targets = correctTargets(
    parentNode,
    Array.isArray(originalTarget) ? originalTarget : [originalTarget]
  );

  if (!markerMap[markerName]) {
    markerMap[markerName] = new WeakMap();
  }

  const markerCounter = markerMap[markerName];
  const hiddenNodes: Element[] = [];

  const elementsToKeep = new Set<Node>();
  const elementsToStop = new Set<Node>(targets);

  const keep = (el: Node | undefined) => {
    if (!el || elementsToKeep.has(el)) {
      return;
    }

    elementsToKeep.add(el);
    el.parentNode && keep(el.parentNode);
  };

  targets.forEach(keep);

  const deep = (parent: Element | null) => {
    if (!parent || elementsToStop.has(parent)) {
      return;
    }

    Array.prototype.forEach.call(parent.children, (node: Element) => {
      if (elementsToKeep.has(node)) {
        deep(node);
      } else {
        const attr = controlAttribute
          ? node.getAttribute(controlAttribute)
          : null;
        const alreadyHidden = attr !== null && attr !== 'false';
        const counterValue = (counterMap.get(node) || 0) + 1;
        const markerValue = (markerCounter.get(node) || 0) + 1;

        counterMap.set(node, counterValue);
        markerCounter.set(node, markerValue);
        hiddenNodes.push(node);

        if (counterValue === 1 && alreadyHidden) {
          uncontrolledNodes.set(node, true);
        }

        if (markerValue === 1) {
          node.setAttribute(markerName, '');
        }

        if (!alreadyHidden && controlAttribute) {
          node.setAttribute(controlAttribute, 'true');
        }
      }
    });
  };

  deep(parentNode);
  elementsToKeep.clear();

  lockCount++;

  return () => {
    hiddenNodes.forEach((node) => {
      const counterValue = (counterMap.get(node) || 0) - 1;
      const markerValue = (markerCounter.get(node) || 0) - 1;

      counterMap.set(node, counterValue);
      markerCounter.set(node, markerValue);

      if (!counterValue) {
        if (!uncontrolledNodes.has(node) && controlAttribute) {
          node.removeAttribute(controlAttribute);
        }

        uncontrolledNodes.delete(node);
      }

      if (!markerValue) {
        node.removeAttribute(markerName);
      }
    });

    lockCount--;

    if (!lockCount) {
      counterMap = new WeakMap();
      counterMap = new WeakMap();
      uncontrolledNodes = new WeakMap();
      markerMap = {};
    }
  };
};

export const markOthers = (
  avoidElements: Element[],
  ariaHidden = false,
  inert = false
): Undo => {
  const activeParentNode = getDefaultParent(avoidElements);

  if (!activeParentNode) {
    return () => null;
  }

  avoidElements.push(
    ...Array.from(activeParentNode.querySelectorAll('[aria-live]'))
  );

  return applyAttributeToOthers(
    avoidElements,
    activeParentNode,
    ariaHidden,
    inert
  );
};
