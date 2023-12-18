import {CONTROLLER, ELEMENT_METADATA} from 'extension/utils/constants';

import type {HTMLElementWithMetadata} from './types';

export type Controller = {
  withdraw(): void;
  select(element?: HTMLElement | null): HTMLElementWithMetadata | null;
  readonly selectedElement: HTMLElementWithMetadata | null;
};

export const createController = (): Controller => {
  let selectedElement: HTMLElementWithMetadata | null = null;
  const controller: Controller = {
    get selectedElement() {
      return selectedElement;
    },
    select: (nextSelectedElement: HTMLElement | null) => {
      if (isHTMLElementWithMetadata(nextSelectedElement)) {
        selectedElement = nextSelectedElement;
        observer.observe(nextSelectedElement.parentElement, {
          childList: true,
          subtree: false,
        });
      }
      if (selectedElement && nextSelectedElement) {
        if (isNextSelectedElementValid(selectedElement, nextSelectedElement)) {
          return selectedElement;
        }
      }
      controller.withdraw();
      return selectedElement;
    },
    withdraw: () => {
      selectedElement = null;
      observer.disconnect();
    },
  };
  const observer = new MutationObserver((mutations) => {
    if (!selectedElement) {
      return;
    }
    for (const mutation of mutations) {
      if (
        mutation.type === 'childList' &&
        Array.from(mutation.removedNodes).includes(selectedElement)
      ) {
        controller.withdraw();
      }
    }
  });
  return controller;
};

export const injectController = (targetDocument: Document) => {
  if (!targetDocument.defaultView) {
    return;
  }
  if (!targetDocument.defaultView[CONTROLLER]) {
    targetDocument.defaultView[CONTROLLER] = createController();
  }
};

const isNextSelectedElementValid = (
  selectedElement: HTMLElementWithMetadata,
  nextSelectedElement: HTMLElement,
): boolean => {
  const metadata = selectedElement[ELEMENT_METADATA];
  switch (metadata.type) {
    case 'middleware':
      return metadata.references.has(nextSelectedElement);
    default:
      return false;
  }
};

const isHTMLElementWithMetadata = (
  element?: HTMLElement | null,
): element is HTMLElementWithMetadata & {parentElement: HTMLElement} =>
  Boolean(
    element && ELEMENT_METADATA in element && element.parentElement !== null,
  );
