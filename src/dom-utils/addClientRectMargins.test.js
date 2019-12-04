// @flow
import getRectRelativeToOffsetParent from './getRectRelativeToOffsetParent';
import addClientRectMargins from './addClientRectMargins';

it('works with margins', () => {
  const element = document.createElement('div');
  Object.assign(element.style, { margin: '10px' });
  expect(
    addClientRectMargins(getRectRelativeToOffsetParent(element), element)
  ).toMatchSnapshot();
});
