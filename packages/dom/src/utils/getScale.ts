import type {Coords} from '@floating-ui/core';
import type {VirtualElement} from '../types';
import {getComputedStyle} from './getComputedStyle';
import {getOffsetParent} from './getOffsetParent';
import {isElement} from './is';

export const FALLBACK_SCALE = {x: 1, y: 1};

function getMatrixScale(element: Element): Coords {
  const matrix = getComputedStyle(element).transform;

  if (!matrix || matrix === 'none') {
    return FALLBACK_SCALE;
  }

  const is3d = /3d/.test(matrix);

  let matrixArr: Array<number>;
  try {
    // An invalid matrix will error out and use the fallback scale
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
  let scale = FALLBACK_SCALE;

  const domElement =
    !isElement(element) && element.contextElement
      ? element.contextElement
      : isElement(element)
      ? element
      : null;

  if (!domElement) {
    return scale;
  }

  let currentElement: Element | Window = domElement;
  while (currentElement && isElement(currentElement)) {
    const currentScale = getMatrixScale(currentElement);
    scale = {x: scale.x * currentScale.x, y: scale.y * currentScale.y};
    currentElement = getOffsetParent(currentElement);
  }

  return scale;
}
