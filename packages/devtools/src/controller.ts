import {
  CONTROLLER,
  ELEMENT_METADATA,
  SERIALIZED_DATA_CHANGE,
} from 'extension/utils/constants';

import type {HTMLElementWithMetadata} from './types';
import {isHTMLElementWithMetadata} from './utils/isHTMLElement';

export type Controller = {
  withdraw(): void;
  select(element?: HTMLElement | null): HTMLElementWithMetadata | null;
  readonly selectedElement: HTMLElementWithMetadata | null;
};

export const createController = (defaultView: Window): Controller => {
  let selectedElement: HTMLElementWithMetadata | null = null;
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
        const metadata = selectedElement[ELEMENT_METADATA];
        if (metadata.references.has(nextSelectedElement)) {
          return selectedElement;
        }
      }
      controller.withdraw();
      return selectedElement;
    },
    withdraw: () => {
      selectedElement = null;
      observer.disconnect();
      defaultView.postMessage(SERIALIZED_DATA_CHANGE);
    },
  };
  return controller;
};

export const injectController = ({defaultView}: Document) => {
  if (!defaultView) {
    return;
  }
  if (!defaultView[CONTROLLER]) {
    defaultView[CONTROLLER] = createController(defaultView);
  }
};

export const getController = (targetDocument: Document) => {
  injectController(targetDocument);
  return targetDocument.defaultView?.[CONTROLLER] ?? null;
};
