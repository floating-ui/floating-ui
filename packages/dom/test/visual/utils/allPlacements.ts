import type {Placement} from '@floating-ui/core';
import {stringifyPlacement} from './stringifyPlacement';

// clockwise ordering
export const allPlacements: Placement[] = [
  {side: 'top', align: 'start'},
  {side: 'top', align: 'center'},
  {side: 'top', align: 'end'},
  {side: 'right', align: 'start'},
  {side: 'right', align: 'center'},
  {side: 'right', align: 'end'},
  {side: 'bottom', align: 'end'},
  {side: 'bottom', align: 'center'},
  {side: 'bottom', align: 'start'},
  {side: 'left', align: 'end'},
  {side: 'left', align: 'center'},
  {side: 'left', align: 'start'},
];

export const allPlacementsString = allPlacements.map(stringifyPlacement);
