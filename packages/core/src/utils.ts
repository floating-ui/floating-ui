import type {
  Alignment,
  Axis,
  ClientRectObject,
  Length,
  Placement,
  Rect,
  Side,
} from './types';

export const sides: Side[] = ['top', 'right', 'bottom', 'left'];
export const alignments: Alignment[] = ['start', 'end'];
export const placements: Placement[] = sides.reduce(
  (acc: Placement[], side) =>
    acc.concat(side, `${side}-${alignments[0]}`, `${side}-${alignments[1]}`),
  []
);

const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom',
};

const oppositeAlignmentMap = {
  start: 'end',
  end: 'start',
};

export function getSide(placement: Placement): Side {
  return placement.split('-')[0] as Side;
}

export function getAlignment(placement: Placement): Alignment | undefined {
  return placement.split('-')[1] as Alignment | undefined;
}

export function getOppositeAxis(axis: Axis): Axis {
  return axis === 'x' ? 'y' : 'x';
}

export function getAxisLength(axis: Axis): Length {
  return axis === 'y' ? 'height' : 'width';
}

export function getSideAxis(placement: Placement): Axis {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'y' : 'x';
}

export function getAlignmentAxis(placement: Placement): Axis {
  return getOppositeAxis(getSideAxis(placement));
}

export function getOppositeSidePlacement<T extends string>(placement: T): T {
  return placement.replace(
    /left|right|bottom|top/g,
    (side) => oppositeSideMap[side as Side]
  ) as T;
}

export function getOppositeAlignmentPlacement<T extends string>(
  placement: T
): T {
  return placement.replace(
    /start|end/g,
    (alignment) => oppositeAlignmentMap[alignment as Alignment]
  ) as T;
}

export function rectToClientRect(rect: Rect): ClientRectObject {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height,
  };
}
