// @flow
import expandToHashMap from './expandToHashMap';

it('expands all the possible cases', () => {
  const listeners = ['scroll', 'resize'];
  expect(expandToHashMap(true, listeners)).toMatchSnapshot('true');
  expect(expandToHashMap(false, listeners)).toMatchSnapshot('false');
});
