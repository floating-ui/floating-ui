// @flow
import orderModifiers from './orderModifiers';

const a = {
  name: 'applyStyles',
  phase: 'write',
  enabled: true,
};
const b = {
  name: 'arrow',
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  enabled: true,
};
const c = {
  name: 'computeStyles',
  phase: 'afterMain',
  enabled: true,
};
const d = {
  name: 'detectOverflow',
  phase: 'read',
  requires: ['popperOffsets'],
  enabled: true,
};
const e = {
  name: 'eventListeners',
  phase: 'write',
  enabled: true,
};
const f = {
  name: 'flip',
  phase: 'main',
  requires: ['detectOverflow'],
  requiresIfExists: ['offset'],
  enabled: true,
};
const g = {
  name: 'hide',
  phase: 'main',
  requires: ['detectOverflow'],
  enabled: true,
};
const h = {
  name: 'offset',
  phase: 'main',
  requires: ['popperOffsets', 'detectOverflow'],
  enabled: true,
};
const i = {
  name: 'popperOffsets',
  phase: 'read',
  enabled: true,
};
const j = {
  name: 'preventOverflow',
  phase: 'main',
  requires: ['detectOverflow'],
  requiresIfExists: ['offset'],
  enabled: true,
};

const modifiers: any = [a, b, c, d, e, f, g, h, i, j];

it('should order modifiers based on `phase` and `requires`', () => {
  expect(orderModifiers(modifiers)).toMatchSnapshot();
});
