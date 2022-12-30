import type {Alignment} from '../types';

const oppositeAlignmentMap = {
  start: 'end',
  end: 'start',
};

export function getOppositeAlignmentPlacement<T extends string>(
  placement: T
): T {
  return placement.replace(
    /start|end/g,
    (alignment) => oppositeAlignmentMap[alignment as Alignment]
  ) as T;
}
