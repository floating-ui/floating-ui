import type {Alignment, Placement, Side} from '../types';
import {getAlignment} from './getAlignment';
import {getOppositeAlignmentPlacement} from './getOppositeAlignmentPlacement';
import {getSide} from './getSide';

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
