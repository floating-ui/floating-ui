// @flow
import getCompositeRect from './getCompositeRect';
import addClientRectMargins from './addClientRectMargins';

it('works with margins', () => {
  const element = document.createElement('div');
  Object.assign(element.style, { margin: '10px' });
  expect(
    addClientRectMargins(getCompositeRect(element, document.body), element)
  ).toMatchSnapshot();
});
