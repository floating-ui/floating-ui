// @flow
import { max as mathMax, min as mathMin } from './math';

export function within(min: number, value: number, max: number): number {
  return mathMax(min, mathMin(value, max));
}

export function withinMaxClamp(min: number, value: number, max: number) {
  const v = within(min, value, max);
  return v > max ? max : v;
}
