import {computeCoordsFromPlacement} from '../src/computeCoordsFromPlacement';

const reference = {x: 0, y: 0, width: 100, height: 100};
const floating = {x: 0, y: 0, width: 50, height: 50};

test('bottom', () => {
  expect(
    computeCoordsFromPlacement({reference, floating, placement: 'bottom'})
  ).toEqual({x: 25, y: 100});
});

test('bottom-start', () => {
  expect(
    computeCoordsFromPlacement({reference, floating, placement: 'bottom-start'})
  ).toEqual({x: 0, y: 100});
});

test('bottom-end', () => {
  expect(
    computeCoordsFromPlacement({reference, floating, placement: 'bottom-end'})
  ).toEqual({x: 50, y: 100});
});

test('top', () => {
  expect(
    computeCoordsFromPlacement({reference, floating, placement: 'top'})
  ).toEqual({x: 25, y: -50});
});

test('top-start', () => {
  expect(
    computeCoordsFromPlacement({reference, floating, placement: 'top-start'})
  ).toEqual({x: 0, y: -50});
});

test('top-end', () => {
  expect(
    computeCoordsFromPlacement({reference, floating, placement: 'top-end'})
  ).toEqual({x: 50, y: -50});
});

test('right', () => {
  expect(
    computeCoordsFromPlacement({reference, floating, placement: 'right'})
  ).toEqual({x: 100, y: 25});
});

test('right-start', () => {
  expect(
    computeCoordsFromPlacement({reference, floating, placement: 'right-start'})
  ).toEqual({x: 100, y: 0});
});

test('right-end', () => {
  expect(
    computeCoordsFromPlacement({reference, floating, placement: 'right-end'})
  ).toEqual({x: 100, y: 50});
});

test('left', () => {
  expect(
    computeCoordsFromPlacement({reference, floating, placement: 'left'})
  ).toEqual({x: -50, y: 25});
});

test('left-start', () => {
  expect(
    computeCoordsFromPlacement({reference, floating, placement: 'left-start'})
  ).toEqual({x: -50, y: 0});
});

test('left-end', () => {
  expect(
    computeCoordsFromPlacement({reference, floating, placement: 'left-end'})
  ).toEqual({x: -50, y: 50});
});
