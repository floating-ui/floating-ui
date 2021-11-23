// @flow
import getCrossAxis from './getCrossAxis';

it('gets cross axis', () => {
  expect(getCrossAxis('x')).toBe('y');
  expect(getCrossAxis('y')).toBe('x');
});
