import {
  getAlignment,
  getAlignmentAxis,
  getAxisLength,
  getOppositeAlignmentPlacement,
  getOppositeSidePlacement,
  getSide,
} from '@floating-ui/core';

import type {
  Alignment,
  ElementRects,
  Padding,
  Placement,
  Side,
  SideObject,
} from './types';

export const min = Math.min;
export const max = Math.max;
export const round = Math.round;
export const floor = Math.floor;
export const createCoords = (v: number) => ({x: v, y: v});

export function clamp(start: number, value: number, end: number): number {
  return max(start, min(value, end));
}

export function evaluate<T, P>(value: T | ((param: P) => T), param: P): T {
  return typeof value === 'function'
    ? (value as (param: P) => T)(param)
    : value;
}

export function getAlignmentSides(
  placement: Placement,
  rects: ElementRects,
  rtl = false
): [Side, Side] {
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);

  let mainAlignmentSide: Side =
    alignmentAxis === 'x'
      ? alignment === (rtl ? 'end' : 'start')
        ? 'right'
        : 'left'
      : alignment === 'start'
      ? 'bottom'
      : 'top';

  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositeSidePlacement(mainAlignmentSide);
  }

  return [mainAlignmentSide, getOppositeSidePlacement(mainAlignmentSide)];
}

export function getExpandedPlacements(placement: Placement): Array<Placement> {
  const oppositePlacement = getOppositeSidePlacement(placement);
  return [
    getOppositeAlignmentPlacement(placement),
    oppositePlacement,
    getOppositeAlignmentPlacement(oppositePlacement),
  ];
}

function getSideList(side: Side, isStart: boolean, rtl?: boolean): Placement[] {
  const lr: Placement[] = ['left', 'right'];
  const rl: Placement[] = ['right', 'left'];
  const tb: Placement[] = ['top', 'bottom'];
  const bt: Placement[] = ['bottom', 'top'];

  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case 'left':
    case 'right':
      return isStart ? tb : bt;
    default:
      return [];
  }
}

export function getOppositeAxisPlacements(
  placement: Placement,
  flipAlignment: boolean,
  direction: 'none' | Alignment,
  rtl?: boolean
): Placement[] {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);

  if (alignment) {
    list = list.map((side) => `${side}-${alignment}` as Placement);

    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }

  return list;
}

export function expandPaddingObject(padding: Partial<SideObject>): SideObject {
  return {top: 0, right: 0, bottom: 0, left: 0, ...padding};
}

export function getPaddingObject(padding: Padding): SideObject {
  return typeof padding !== 'number'
    ? expandPaddingObject(padding)
    : {top: padding, right: padding, bottom: padding, left: padding};
}
