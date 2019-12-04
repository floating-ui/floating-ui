// @flow
import getRectRelativeToOffsetParent from './getRectRelativeToOffsetParent';

it('returns an object containing x, y, width, and height properties', () => {
  const element = document.createElement('div');
  expect(getRectRelativeToOffsetParent(element)).toMatchSnapshot();
});

it('works with margins', () => {
  const element = document.createElement('div');
  Object.assign(element.style, { margin: '10px' });
  expect(getRectRelativeToOffsetParent(element)).toMatchSnapshot();
});
