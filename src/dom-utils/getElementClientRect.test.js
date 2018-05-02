// @flow
import getElementClientRect from './getElementClientRect';

it('returns an object containing x, y, width, and height properties', () => {
  const element = document.createElement('div');
  expect(getElementClientRect(element)).toMatchSnapshot();
});
