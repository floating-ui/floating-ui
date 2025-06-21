import {getCoordinates} from '../src/getCoordinates';

const reference = {x: 0, y: 0, width: 100, height: 100};
const floating = {x: 0, y: 0, width: 50, height: 50};

test('top', () => {
  expect(getCoordinates({reference, floating}, 'top', 'center')).toEqual({
    x: 25,
    y: -50,
  });
});

test('top-start', () => {
  expect(getCoordinates({reference, floating}, 'top', 'start')).toEqual({
    x: 0,
    y: -50,
  });
});

test('top-end', () => {
  expect(getCoordinates({reference, floating}, 'top', 'end')).toEqual({
    x: 50,
    y: -50,
  });
});

test('right', () => {
  expect(getCoordinates({reference, floating}, 'right', 'center')).toEqual({
    x: 100,
    y: 25,
  });
});

test('right-start', () => {
  expect(getCoordinates({reference, floating}, 'right', 'start')).toEqual({
    x: 100,
    y: 0,
  });
});

test('right-end', () => {
  expect(getCoordinates({reference, floating}, 'right', 'end')).toEqual({
    x: 100,
    y: 50,
  });
});

test('left', () => {
  expect(getCoordinates({reference, floating}, 'left', 'center')).toEqual({
    x: -50,
    y: 25,
  });
});

test('left-start', () => {
  expect(getCoordinates({reference, floating}, 'left', 'start')).toEqual({
    x: -50,
    y: 0,
  });
});

test('left-end', () => {
  expect(getCoordinates({reference, floating}, 'left', 'end')).toEqual({
    x: -50,
    y: 50,
  });
});

test('bottom', () => {
  expect(getCoordinates({reference, floating}, 'bottom', 'center')).toEqual({
    x: 25,
    y: 100,
  });
});

test('bottom-start', () => {
  expect(getCoordinates({reference, floating}, 'bottom', 'start')).toEqual({
    x: 0,
    y: 100,
  });
});

test('bottom-end', () => {
  expect(getCoordinates({reference, floating}, 'bottom', 'end')).toEqual({
    x: 50,
    y: 100,
  });
});

test('rtl', () => {
  expect(getCoordinates({reference, floating}, 'top', 'start', true)).toEqual({
    x: 50,
    y: -50,
  });

  expect(getCoordinates({reference, floating}, 'top', 'end', true)).toEqual({
    x: 0,
    y: -50,
  });

  expect(
    getCoordinates({reference, floating}, 'bottom', 'start', true),
  ).toEqual({
    x: 50,
    y: 100,
  });

  expect(getCoordinates({reference, floating}, 'bottom', 'end', true)).toEqual({
    x: 0,
    y: 100,
  });
});
