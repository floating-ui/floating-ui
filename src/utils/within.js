// @flow

export default (min: number, value: number, max: number): number =>
  Math.max(min, Math.min(value, max));
