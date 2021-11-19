// @flow
import getAltAxis from './getAltAxis';

it('gets alternative axis', () => {
  expect(getAltAxis('x')).toBe('y');
  expect(getAltAxis('y')).toBe('x');
});
