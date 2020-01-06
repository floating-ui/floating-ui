// @flow
import { createPopper } from './';

const reference = document.createElement('div');
const getPopper = () => document.createElement('div');

const testModifier = {
  name: 'test',
  phase: 'main',
  enabled: true,
};

it('returns expected instance object', () => {
  expect(createPopper(reference, getPopper())).toMatchSnapshot();
});

it('runs modifier effects on create', () => {
  const spy = jest.fn();

  createPopper(reference, getPopper(), {
    modifiers: [
      {
        ...testModifier,
        effect: spy,
      },
    ],
  });

  expect(spy).toHaveBeenCalledTimes(1);
});

it('does not run modifier effect cleanup functions on create', () => {
  const spy = jest.fn();

  createPopper(reference, getPopper(), {
    modifiers: [
      {
        ...testModifier,
        effect: () => spy,
      },
    ],
  });

  expect(spy).not.toHaveBeenCalled();
});

describe('.setOptions() method', () => {
  it('correctly updates `placement`', () => {
    const popper = createPopper(reference, getPopper(), {
      placement: 'right',
    });

    popper.setOptions({ placement: 'left' });

    expect(popper.state.options.placement).toBe('left');
  });

  it('correctly updates `modifiers`', () => {
    const popper = createPopper(reference, getPopper(), { modifiers: [] });
    const modifier = { name: 'test', phase: 'main' };

    popper.setOptions({ modifiers: [modifier] });

    expect(popper.state.orderedModifiers.includes(modifier)).toBe(true);
  });
});

describe('.destroy() method', () => {
  it('runs effect cleanup functions', () => {
    const spy = jest.fn();

    createPopper(reference, getPopper(), {
      placement: 'right',
      modifiers: [
        {
          ...testModifier,
          effect: () => spy,
        },
      ],
    }).destroy();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
