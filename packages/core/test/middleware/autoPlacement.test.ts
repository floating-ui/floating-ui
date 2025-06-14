import {getPlacementList} from '../../src/middleware/autoPlacement';

test('base placement', () => {
  expect(
    getPlacementList(null, false, [
      {side: 'top', align: 'center'},
      {side: 'bottom', align: 'center'},
      {side: 'left', align: 'center'},
      {side: 'right', align: 'center'},
      {side: 'top', align: 'start'},
      {side: 'right', align: 'end'},
    ]),
  ).toEqual([
    {side: 'top', align: 'center'},
    {side: 'bottom', align: 'center'},
    {side: 'left', align: 'center'},
    {side: 'right', align: 'center'},
  ]);
});

test('start align without auto align', () => {
  expect(
    getPlacementList('start', false, [
      {side: 'top', align: 'center'},
      {side: 'bottom', align: 'center'},
      {side: 'left', align: 'center'},
      {side: 'right', align: 'center'},
      {side: 'top', align: 'start'},
      {side: 'right', align: 'end'},
      {side: 'left', align: 'start'},
    ]),
  ).toEqual([
    {side: 'top', align: 'start'},
    {side: 'left', align: 'start'},
  ]);
});

test('start align with auto align', () => {
  expect(
    getPlacementList('start', true, [
      {side: 'top', align: 'center'},
      {side: 'bottom', align: 'center'},
      {side: 'left', align: 'center'},
      {side: 'right', align: 'center'},
      {side: 'top', align: 'start'},
      {side: 'right', align: 'end'},
      {side: 'left', align: 'start'},
    ]),
  ).toEqual([
    {side: 'top', align: 'start'},
    {side: 'left', align: 'start'},
    {side: 'right', align: 'end'},
  ]);
});

test('end align without auto align', () => {
  expect(
    getPlacementList('end', false, [
      {side: 'top', align: 'center'},
      {side: 'bottom', align: 'center'},
      {side: 'left', align: 'center'},
      {side: 'right', align: 'center'},
      {side: 'top', align: 'start'},
      {side: 'right', align: 'end'},
      {side: 'left', align: 'start'},
    ]),
  ).toEqual([{side: 'right', align: 'end'}]);
});

test('end align with auto align', () => {
  expect(
    getPlacementList('end', true, [
      {side: 'top', align: 'center'},
      {side: 'bottom', align: 'center'},
      {side: 'left', align: 'center'},
      {side: 'right', align: 'center'},
      {side: 'top', align: 'start'},
      {side: 'right', align: 'end'},
      {side: 'left', align: 'start'},
    ]),
  ).toEqual([
    {side: 'right', align: 'end'},
    {side: 'top', align: 'start'},
    {side: 'left', align: 'start'},
  ]);
});
