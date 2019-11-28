// @flow
import getElementClientRect from './getElementClientRect';
import addClientRectMargins from './addClientRectMargins';

it('works with margins', () => {
  const element = document.createElement('div');
  Object.assign(element.style, { margin: '10px' });
  expect(
    addClientRectMargins(getElementClientRect(element), element)
  ).toMatchSnapshot();
});
