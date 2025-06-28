type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Alignment = 'start' | 'end';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type AlignedPlacement = `${Side}-${Alignment}`;
export type Placement = Prettify<Side | AlignedPlacement>;
export type Strategy = 'absolute' | 'fixed';
export type Axis = 'x' | 'y';
export type Coords = {[key in Axis]: number};
export type Length = 'width' | 'height';
export type Dimensions = {[key in Length]: number};
export type SideObject = {[key in Side]: number};
export type Rect = Prettify<Coords & Dimensions>;
export type Padding = number | Prettify<Partial<SideObject>>;
export type ClientRectObject = Prettify<Rect & SideObject>;

export interface ElementRects {
  reference: Rect;
  floating: Rect;
}

/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */
export interface VirtualElement {
  getBoundingClientRect(): ClientRectObject;
  getClientRects?(): Array<ClientRectObject>;
  contextElement?: any;
}

export const sides: Side[] = ['top', 'right', 'bottom', 'left'];
export const alignments: Alignment[] = ['start', 'end'];
export const placements: Placement[] = sides.reduce(
  (acc: Placement[], side) =>
    acc.concat(side, `${side}-${alignments[0]}`, `${side}-${alignments[1]}`),
  [],
);

export const min = Math.min;
export const max = Math.max;
export const round = Math.round;
export const floor = Math.floor;
export const createCoords = (v: number) => ({x: v, y: v});

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

export function clamp(start: number, value: number, end: number): number {
  return max(start, min(value, end));
}

export function evaluate<T, P>(value: T | ((param: P) => T), param: P): T {
  return typeof value === 'function'
    ? (value as (param: P) => T)(param)
    : value;
}

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

const yAxisSides = new Set(['top', 'bottom']);

export function getSideAxis(placement: Placement): Axis {
  return yAxisSides.has(getSide(placement)) ? 'y' : 'x';
}

export function getAlignmentAxis(placement: Placement): Axis {
  return getOppositeAxis(getSideAxis(placement));
}

export function getAlignmentSides(
  placement: Placement,
  rects: ElementRects,
  rtl = false,
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
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }

  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}

export function getExpandedPlacements(placement: Placement): Array<Placement> {
  const oppositePlacement = getOppositePlacement(placement);

  return [
    getOppositeAlignmentPlacement(placement),
    oppositePlacement,
    getOppositeAlignmentPlacement(oppositePlacement),
  ];
}

export function getOppositeAlignmentPlacement<T extends string>(
  placement: T,
): T {
  return placement.replace(
    /start|end/g,
    (alignment) => oppositeAlignmentMap[alignment as Alignment],
  ) as T;
}

const lrPlacement: Placement[] = ['left', 'right'];
const rlPlacement: Placement[] = ['right', 'left'];
const tbPlacement: Placement[] = ['top', 'bottom'];
const btPlacement: Placement[] = ['bottom', 'top'];

function getSideList(side: Side, isStart: boolean, rtl?: boolean): Placement[] {
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case 'left':
    case 'right':
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}

export function getOppositeAxisPlacements(
  placement: Placement,
  flipAlignment: boolean,
  direction: 'none' | Alignment,
  rtl?: boolean,
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

export function getOppositePlacement<T extends string>(placement: T): T {
  return placement.replace(
    /left|right|bottom|top/g,
    (side) => oppositeSideMap[side as Side],
  ) as T;
}

export function expandPaddingObject(padding: Partial<SideObject>): SideObject {
  return {top: 0, right: 0, bottom: 0, left: 0, ...padding};
}

export function getPaddingObject(padding: Padding): SideObject {
  return typeof padding !== 'number'
    ? expandPaddingObject(padding)
    : {top: padding, right: padding, bottom: padding, left: padding};
}

export function rectToClientRect(rect: Rect): ClientRectObject {
  const {x, y, width, height} = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y,
  };
}
