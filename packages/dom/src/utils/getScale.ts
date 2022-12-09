import type {Coords} from '@floating-ui/core';
import type {VirtualElement} from '../types';
import {getComputedStyle} from './getComputedStyle';
import {isElement, isHTMLElement} from './is';
import {round} from './math';

export const FALLBACK_SCALE = {x: 1, y: 1};

function getMatrixScale(element: Element): Coords {
  const matrix = getComputedStyle(element).transform;
  const is3d = matrix.includes('3d');

  let matrixArr: Array<number>;
  try {
    // "none" or an invalid matrix will error out and use the fallback scale
    matrixArr = matrix.split('(')[1].split(')')[0].split(',').map(Number);
  } catch (e) {
    return FALLBACK_SCALE;
  }

  return {
    x: matrixArr[0],
    y: matrixArr[is3d ? 5 : 3],
  };
}

export function getScale(element: Element | VirtualElement): Coords {
  const domElement =
    !isElement(element) && element.contextElement
      ? element.contextElement
      : isElement(element)
      ? element
      : null;

  if (!isHTMLElement(domElement)) {
    return FALLBACK_SCALE;
  }

  const matrixScale = getMatrixScale(domElement);

  if (matrixScale.x !== 1 || matrixScale.y !== 1) {
    return matrixScale;
  }

  const rect = domElement.getBoundingClientRect();
  return {
    x:
      domElement.offsetWidth > 0
        ? round(rect.width) / domElement.offsetWidth || 1
        : 1,
    y:
      domElement.offsetHeight > 0
        ? round(rect.height) / domElement.offsetHeight || 1
        : 1,
  };
}
