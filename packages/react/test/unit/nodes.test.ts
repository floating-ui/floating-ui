import type {FloatingContext} from '../../src';
import {getNodeAncestors, getNodeChildren} from '../../src/utils';

const contextOpen = {open: true} as FloatingContext;
const contextClosed = {open: false} as FloatingContext;

test('returns an array of children, ignoring closed ones when onlyOpenChildren=true', () => {
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
      true,
    ),
  ).toEqual([
    {id: '1', parentId: '0', context: contextOpen},
    {id: '2', parentId: '1', context: contextOpen},
    {id: '3', parentId: '1', context: contextOpen},
  ]);
});

test('returns an array of children, including closed ones when onlyOpenChildren=false', () => {
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
      false,
    ),
  ).toEqual([
    {id: '1', parentId: '0', context: contextOpen},
    {id: '2', parentId: '1', context: contextOpen},
    {id: '3', parentId: '1', context: contextOpen},
    {id: '4', parentId: '1', context: contextClosed},
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

test('handles deep parent structures correctly (onlyOpenChildren=true)', () => {
  const nodes = [
    {id: '0', parentId: null, context: contextOpen},
    {id: '1', parentId: '0', context: contextOpen},
    {id: '2', parentId: '1', context: contextClosed},
    {id: '3', parentId: '2', context: contextOpen},
    {id: '4', parentId: '2', context: contextClosed},
    {id: '5', parentId: '0', context: contextOpen},
    {id: '6', parentId: '5', context: contextOpen},
  ];

  expect(getNodeChildren(nodes, '0', true)).toEqual([
    {id: '1', parentId: '0', context: contextOpen},
    {id: '5', parentId: '0', context: contextOpen},
    {id: '6', parentId: '5', context: contextOpen},
  ]);
});

test('handles deep parent structures correctly (onlyOpenChildren=false)', () => {
  const nodes = [
    {id: '0', parentId: null, context: contextOpen},
    {id: '1', parentId: '0', context: contextOpen},
    {id: '2', parentId: '1', context: contextClosed},
    {id: '3', parentId: '2', context: contextOpen},
    {id: '4', parentId: '2', context: contextClosed},
    {id: '5', parentId: '0', context: contextOpen},
    {id: '6', parentId: '5', context: contextOpen},
  ];

  expect(getNodeChildren(nodes, '0', false)).toEqual([
    {id: '1', parentId: '0', context: contextOpen},
    {id: '2', parentId: '1', context: contextClosed},
    {id: '3', parentId: '2', context: contextOpen},
    {id: '4', parentId: '2', context: contextClosed},
    {id: '5', parentId: '0', context: contextOpen},
    {id: '6', parentId: '5', context: contextOpen},
  ]);
});
