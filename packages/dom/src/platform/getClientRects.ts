import type {VirtualElement} from '../types';

export function getClientRects(element: Element | VirtualElement) {
  return element.getClientRects ? Array.from(element.getClientRects()) : [];
}
