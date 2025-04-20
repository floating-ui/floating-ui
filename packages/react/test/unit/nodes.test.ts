import type {FloatingContext} from '../../src';
import {getNodeAncestors, getNodeChildren} from '../../src/utils';

const contextOpen = {open: true} as FloatingContext;
const contextClosed = {open: false} as FloatingContext;

test('returns an array of children, ignoring closed ones', () => {
  expect(
    getNodeChildren(
      [
        {id: '0', parentId: null, context: contextOpen},
        {id: '1', parentId: '0', context: contextOpen},
        {id: '2', parentId: '1', context: contextOpen},
        {id: '3', parentId: '1', context: contextOpen},
        {id: '4', parentId: '1', context: contextClosed},
      ],
      '0',
    ),
  ).toEqual([
    {id: '1', parentId: '0', context: contextOpen},
    {id: '2', parentId: '1', context: contextOpen},
    {id: '3', parentId: '1', context: contextOpen},
  ]);
});

test('returns an array of ancestors', () => {
  expect(
    getNodeAncestors(
      [
        {id: '0', parentId: null},
        {id: '1', parentId: '0'},
        {id: '2', parentId: '1'},
      ],
      '2',
    ),
  ).toEqual([
    {id: '1', parentId: '0'},
    {id: '0', parentId: null},
  ]);
});
