// @flow
import { max as mathMax, min as mathMin } from './math';

export default function within(
  min: number,
  value: number,
  max: number
): number {
  return mathMax(min, mathMin(value, max));
}
