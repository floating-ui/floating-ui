import type {Alignment, Placement, Side} from '../types';
import {getAlignment} from './getAlignment';
import {getOppositeAlignmentPlacement} from './getOppositeAlignmentPlacement';
import {getSide} from './getSide';

function getSideList(side: Side, sideAlignment: Alignment): Placement[] {
  const lr: Placement[] = ['left', 'right'];
  const rl: Placement[] = ['right', 'left'];
  const tb: Placement[] = ['top', 'bottom'];
  const bt: Placement[] = ['bottom', 'top'];

  const isStart = sideAlignment === 'start';
  const isEnd = sideAlignment === 'end';

  switch (side) {
    case 'bottom':
      return isEnd ? rl : lr;
    case 'top':
      return isStart ? lr : rl;
    case 'right':
      return isEnd ? bt : tb;
    case 'left':
      return isStart ? tb : bt;
  }
}

export function getOppositeAxisPlacements(
  placement: Placement,
  flipAlignment: boolean,
  sideAlignment: Alignment
): Placement[] {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), sideAlignment);

  if (alignment) {
    list = list.map((side) => `${side}-${alignment}` as Placement);

    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }

  return list;
}
