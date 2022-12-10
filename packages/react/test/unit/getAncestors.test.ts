import {getAncestors} from '../../src/utils/getAncestors';

test('returns an array of ancestors', () => {
  expect(
    getAncestors(
      [
        {id: '0', parentId: null},
        {id: '1', parentId: '0'},
        {id: '2', parentId: '1'},
      ],
      '2'
    )
  ).toEqual([
    {id: '1', parentId: '0'},
    {id: '0', parentId: null},
  ]);
});
