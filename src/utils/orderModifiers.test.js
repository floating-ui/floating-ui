// @flow
import orderModifiers from './orderModifiers';

const a = {
  name: 'applyStyles',
  phase: 'write',
};
const b = {
  name: 'arrow',
  phase: 'main',
  optionallyRequires: ['preventOverflow'],
};
const c = {
  name: 'computeStyles',
  phase: 'afterMain',
};
const d = {
  name: 'detectOverflow',
  phase: 'read',
  requires: ['popperOffsets'],
};
const e = {
  name: 'eventListeners',
  phase: 'write',
};
const f = {
  name: 'flip',
  phase: 'main',
  requires: ['detectOverflow'],
  optionallyRequires: ['offset'],
};
const g = {
  name: 'hide',
  phase: 'main',
  requires: ['detectOverflow'],
};
const h = {
  name: 'offset',
  phase: 'main',
  requires: ['popperOffsets', 'detectOverflow'],
};
const i = {
  name: 'popperOffsets',
  phase: 'read',
};
const j = {
  name: 'preventOverflow',
  phase: 'main',
  requires: ['detectOverflow'],
  optionallyRequires: ['offset'],
};

const modifiers: any = [a, b, c, d, e, f, g, h, i, j];

it('should order modifiers based on `phase` and `requires`', () => {
  expect(orderModifiers(modifiers)).toMatchSnapshot();
});
