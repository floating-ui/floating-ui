// @flow
import getWindowScroll from './getWindowScroll';

it('returns the scrollTop and scrollLeft of the window', () => {
  window.pageXOffset = 100;
  window.pageYOffset = 200;
  const element = document.createElement('div');
  window.document.documentElement.appendChild(element);

  expect(getWindowScroll(element)).toMatchSnapshot();
});
