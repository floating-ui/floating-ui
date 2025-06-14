type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'center' | 'start' | 'end';

export interface Placement {
  side: Side;
  align: Align;
}

const topCenter: Placement = {side: 'top', align: 'center'};
const topStart: Placement = {side: 'top', align: 'start'};
const topEnd: Placement = {side: 'top', align: 'end'};

const rightCenter: Placement = {side: 'right', align: 'center'};
const rightStart: Placement = {side: 'right', align: 'start'};
const rightEnd: Placement = {side: 'right', align: 'end'};

const bottomCenter: Placement = {side: 'bottom', align: 'center'};
const bottomStart: Placement = {side: 'bottom', align: 'start'};
const bottomEnd: Placement = {side: 'bottom', align: 'end'};

const leftCenter: Placement = {side: 'left', align: 'center'};
const leftStart: Placement = {side: 'left', align: 'start'};
const leftEnd: Placement = {side: 'left', align: 'end'};

export const placements: readonly Placement[] = [
  topCenter,
  topStart,
  topEnd,
  rightCenter,
  rightStart,
  rightEnd,
  bottomCenter,
  bottomStart,
  bottomEnd,
  leftCenter,
  leftStart,
  leftEnd,
] as const;

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
export const aligns: Align[] = ['start', 'end', 'center'];

export const min = Math.min;
export const max = Math.max;
export const round = Math.round;
export const floor = Math.floor;
export const createCoords = (v: number) => ({x: v, y: v});

const oppositeSideMap: Record<Side, Side> = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom',
};

const oppositeAlignMap: Record<Align, Align> = {
  start: 'end',
  end: 'start',
  center: 'center',
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
  return placement.side;
}

export function getAlign(placement: Placement): Align | undefined {
  return placement.align;
}

export function getOppositeAxis(axis: Axis): Axis {
  return axis === 'x' ? 'y' : 'x';
}

export function getAxisLength(axis: Axis): Length {
  return axis === 'y' ? 'height' : 'width';
}

export function getSideAxis(side: Side): Axis {
  return side === 'top' || side === 'bottom' ? 'y' : 'x';
}

export function getAlignAxis(placement: Placement): Axis {
  return getOppositeAxis(getSideAxis(getSide(placement)));
}

export function getAlignSides(
  placement: Placement,
  rects: ElementRects,
  rtl = false,
): [Side, Side] {
  const align = getAlign(placement);
  const alignAxis = getAlignAxis(placement);
  const length = getAxisLength(alignAxis);

  let mainAlignSide: Side =
    alignAxis === 'x'
      ? align === (rtl ? 'end' : 'start')
        ? 'right'
        : 'left'
      : align === 'start'
        ? 'bottom'
        : 'top';

  if (rects.reference[length] > rects.floating[length]) {
    mainAlignSide = oppositeSideMap[mainAlignSide];
  }

  return [mainAlignSide, oppositeSideMap[mainAlignSide]];
}

export function getExpandedPlacements(placement: Placement): Array<Placement> {
  const oppositePlacement = getOppositePlacement(placement);

  return [
    getOppositeAlignPlacement(placement),
    oppositePlacement,
    getOppositeAlignPlacement(oppositePlacement),
  ];
}

export function getOppositeAlignPlacement(placement: Placement): Placement {
  return {
    side: placement.side,
    align: oppositeAlignMap[placement.align],
  };
}

function getSideList(side: Side, isStart: boolean, rtl?: boolean): Placement[] {
  const lr: Placement[] = [leftCenter, rightCenter];
  const rl: Placement[] = [rightCenter, leftCenter];
  const tb: Placement[] = [topCenter, bottomCenter];
  const bt: Placement[] = [bottomCenter, topCenter];

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
  flipAlign: boolean,
  direction: 'none' | Align,
  rtl?: boolean,
): Placement[] {
  const align = getAlign(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);

  if (align && align !== 'center') {
    list = list.map((side) => ({...side, align: align}) as Placement);

    if (flipAlign) {
      list = list.concat(list.map(getOppositeAlignPlacement));
    }
  }

  return list;
}

export function getOppositePlacement(placement: Placement): Placement {
  return {
    side: oppositeSideMap[placement.side],
    align: placement.align,
  };
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
