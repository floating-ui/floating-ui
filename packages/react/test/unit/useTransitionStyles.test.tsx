import {render, screen, waitFor} from '@testing-library/react';
import * as React from 'react';
import {vi} from 'vitest';

import {useFloating} from '../../src/hooks/useFloating';
import {useTransitionStyles} from '../../src/hooks/useTransition';

beforeEach(() => {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) =>
    window.setTimeout(() => callback(0), 0),
  );
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) =>
    window.clearTimeout(id),
  );
});

afterEach(() => vi.restoreAllMocks());

test.each([
  ['WebkitTransform', 'scale(0)', 'scale(1)', '-webkit-transform'],
  ['msTransform', 'scale(0)', 'scale(1)', '-ms-transform'],
  ['--scaleX', '0', '1', '--scaleX'],
  ['backgroundColor', '#000', '#fff', 'background-color'],
  ['opacity', '0', '1', 'opacity'],
])(
  'preserves the CSS transition name for %s',
  async (property, initialValue, openValue, expected) => {
    function App({open}: {open: boolean}) {
      const {refs, context} = useFloating({open});
      const {styles} = useTransitionStyles(context, {
        initial: {[property]: initialValue},
        open: {[property]: openValue},
        close: {[property]: initialValue},
      });

      return (
        <div ref={refs.setFloating} style={styles} data-testid="floating" />
      );
    }

    const {rerender} = render(<App open />);
    const floating = screen.getByTestId('floating');
    await waitFor(() =>
      expect(floating.style.transitionProperty).toBe(expected),
    );

    rerender(<App open={false} />);
    expect(floating.style.transitionProperty).toBe(expected);
  },
);
