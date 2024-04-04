import {HTML_ELEMENT_REFERENCE} from './constants';

export type ReferenceId = `${typeof HTML_ELEMENT_REFERENCE}:${string}`;

let counter = 0;
export const generateReferenceId = (): ReferenceId =>
  `${HTML_ELEMENT_REFERENCE}:${counter++}`;

export type References = {
  add: (element: HTMLElement) => ReferenceId;
  get: (id: ReferenceId) => HTMLElement | undefined;
  has: (element: HTMLElement) => boolean;
};

export const createReferences = (): References => {
  const map = new Map<ReferenceId, HTMLElement>();
  const weakMap = new WeakMap<HTMLElement, ReferenceId>();
  const references: References = {
    add: (element) => {
      if (weakMap.has(element)) {
        return weakMap.get(element)!;
      }
      const id: ReferenceId = generateReferenceId();
      map.set(id, element);
      weakMap.set(element, id);
      return id;
    },
    get: (id) => {
      const element = map.get(id);
      if (element && weakMap.has(element)) {
        return element;
      }
    },
    has: (element) => {
      return weakMap.has(element);
    },
  };
  return references;
};
