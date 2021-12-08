/**
 * @jest-environment jsdom
 */
import {useFloating} from '../src';
import {renderHook} from '@testing-library/react-hooks';
import {render, waitFor} from '@testing-library/react';
import * as FloatingUIDom from '@floating-ui/dom';

test('`x` and `y` are initially `null`', async () => {
  const {result} = renderHook(() => useFloating());

  expect(result.current.x).toBe(null);
  expect(result.current.y).toBe(null);
});

test('`middleware` is memoized internally', async () => {
  function Component() {
    const {reference, floating} = useFloating({
      middleware: [
        {
          name: 'identity',
          fn({x, y}) {
            return {x, y};
          },
        },
      ],
    });

    return (
      <div>
        <button ref={reference}>button</button>
        <div ref={floating}>floating</div>
      </div>
    );
  }

  const spy = jest.spyOn(FloatingUIDom, 'computePosition');

  const {rerender} = render(<Component />);

  await waitFor(() => {
    expect(spy).toHaveBeenCalledTimes(2);
  });

  rerender(<Component />);

  await waitFor(() => {
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
