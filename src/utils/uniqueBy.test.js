// @flow
import uniqueBy from './uniqueBy';

it('filters out duplicate items based by an identifier', () => {
  const a = { name: 'a' };
  const b = { name: 'b' };
  const c = { name: 'c' };
  const d = { name: 'd' };

  const items = [a, b, c, a, a, d, c, c, d, b];

  expect(uniqueBy(items, ({ name }) => name)).toEqual([a, b, c, d]);
});
