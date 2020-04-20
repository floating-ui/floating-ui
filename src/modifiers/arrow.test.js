// @flow
import { createPopper } from '../../src/popper';

it('errors if SVGElement is used as arrow', () => {
  const reference = document.createElement('div');
  const popper = document.createElement('div');
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  popper.appendChild(arrow);

  createPopper(reference, popper, {
    modifiers: [{ name: 'arrow', options: { element: arrow } }],
  });

  expect(console.error).toHaveBeenCalledWith(
    [
      'Popper: "arrow" element must be an HTMLElement (not an SVGElement).',
      'To use an SVG arrow, wrap it in an HTMLElement that will be used as',
      'the arrow.',
    ].join(' ')
  );
});

it('does not error if HTMLElement is used as arrow', () => {
  const reference = document.createElement('div');
  const popper = document.createElement('div');
  const arrow = document.createElement('div');

  popper.appendChild(arrow);

  createPopper(reference, popper, {
    modifiers: [{ name: 'arrow', options: { element: arrow } }],
  });

  expect(console.error).not.toHaveBeenCalled();
});
