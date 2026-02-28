import {fireEvent} from '@testing-library/react';

// Simulates a real mouse hover: pointerenter always fires before mouseenter.
export function hoverEnter(element: Element) {
  fireEvent.pointerEnter(element, {pointerType: 'mouse'});
  fireEvent.mouseEnter(element);
}
