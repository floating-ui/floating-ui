import {getComputedStyle, isHTMLElement} from '@floating-ui/utils/dom';

import type {VirtualElement} from '../types';
import {unwrapElement} from './unwrapElement';

/**
 * Computes the cumulative CSS `zoom` factor from an element up to the
 * document root by multiplying each ancestor's own zoom value.
 *
 * This is needed because CSS `zoom` (standardised in Chrome 128+) affects
 * `getBoundingClientRect()` values (they are in "zoomed" visual-viewport
 * pixels), while layout values such as `offsetLeft`, `scrollLeft`, and
 * CSS `width` remain in un-zoomed CSS-layout pixels. Dividing the rect
 * coordinates by the cumulative zoom converts them back to the CSS
 * coordinate space so that positioning calculations are correct.
 */
export function getCSSZoom(element: Element | VirtualElement): number {
  const domElement = unwrapElement(element);
  let zoom = 1;
  let current: Element | null = domElement ?? null;

  while (current) {
    if (isHTMLElement(current)) {
      const z = parseFloat(getComputedStyle(current).zoom);
      if (z && z !== 1) {
        zoom *= z;
      }
    }
    current = current.parentElement;
  }

  return zoom;
}
