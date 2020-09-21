// @flow
import { createPopper } from './createPopper';

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

it('errors if placement: "auto" and "flip" modifier is not present/enabled', () => {
  const spy = jest.spyOn(console, 'error');

  createPopper(reference, getPopper(), {
    placement: 'auto',
    modifiers: [
      {
        name: 'flip',
        enabled: false,
      },
    ],
  });

  expect(spy).toHaveBeenCalledWith(
    [
      'Popper: "auto" placements require the "flip" modifier be',
      'present and enabled to work.',
    ].join(' ')
  );
});

describe('margin warning', () => {
  it('warns for margin: value', () => {
    const spy = jest.spyOn(console, 'warn');
    const popper = getPopper();
    popper.style.margin = '5px';

    createPopper(reference, popper);

    expect(spy).toHaveBeenCalledWith(
      [
        'Popper: CSS "margin" styles cannot be used to apply padding',
        'between the popper and its reference element or boundary.',
        'To replicate margin, use the `offset` modifier, as well as',
        'the `padding` option in the `preventOverflow` and `flip`',
        'modifiers.',
      ].join(' ')
    );
  });

  it('warns for two sides', () => {
    const spy = jest.spyOn(console, 'warn');
    const popper = getPopper();
    popper.style.margin = '0 0.5em';

    createPopper(reference, popper);

    expect(spy).toHaveBeenCalledWith(
      [
        'Popper: CSS "margin" styles cannot be used to apply padding',
        'between the popper and its reference element or boundary.',
        'To replicate margin, use the `offset` modifier, as well as',
        'the `padding` option in the `preventOverflow` and `flip`',
        'modifiers.',
      ].join(' ')
    );
  });

  it('does not warn with no margin', () => {
    const spy = jest.spyOn(console, 'warn');
    const popper = getPopper();
    popper.style.margin = '0px';

    createPopper(reference, popper);

    expect(spy).not.toHaveBeenCalled();
  });
});

it('does not error for missing phase for disabled modifiers', () => {
  const spy = jest.spyOn(console, 'error');

  createPopper(reference, getPopper(), {
    modifiers: [
      {
        name: 'flip',
        enabled: true,
        phase: 'main',
        fn: () => {},
      },
      {
        name: 'flip',
        enabled: false,
      },
    ],
  });

  expect(spy).not.toHaveBeenCalled();
});

it('errors for custom modifier missing phase property', () => {
  const spy = jest.spyOn(console, 'error');

  createPopper(reference, getPopper(), {
    modifiers: [
      {
        name: 'custom',
        enabled: false,
      },
    ],
  });

  expect(spy).toHaveBeenCalled();
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

    popper.setOptions({ modifiers: [testModifier] });

    expect(popper.state.orderedModifiers.includes(testModifier)).toBe(true);
  });

  it('works with a partial', () => {
    const popper = createPopper(reference, getPopper(), {
      modifiers: [testModifier],
    });

    popper.setOptions({ placement: 'right' });

    expect(popper.state.orderedModifiers).toEqual([testModifier]);
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

  it('forceUpdate() is not ran when destroy is called sync', done => {
    const spy = jest.fn();

    createPopper(reference, getPopper(), {
      modifiers: [{ ...testModifier, fn: spy }],
    }).destroy();

    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
      done();
    });
  });
});
