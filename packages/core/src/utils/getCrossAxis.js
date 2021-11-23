// @flow

export default function getCrossAxis(axis: 'x' | 'y'): 'x' | 'y' {
  return axis === 'x' ? 'y' : 'x';
}
