// @flow
import getAltLen from './getAltLen';

it('gets the alternative len', () => {
  expect(getAltLen('width')).toBe('height');
  expect(getAltLen('height')).toBe('width');
});
