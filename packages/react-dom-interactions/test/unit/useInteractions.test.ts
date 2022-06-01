import {useInteractions} from '../../src/useInteractions';

test('returns prop getters', () => {
  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions(
    []
  );

  expect(typeof getReferenceProps).toBe('function');
  expect(typeof getFloatingProps).toBe('function');
  expect(typeof getItemProps).toBe('function');
});

test('correctly merges functions', () => {
  const firstInteractionOnClick = jest.fn();
  const secondInteractionOnClick = jest.fn();
  const secondInteractionOnKeyDown = jest.fn();
  const userOnClick = jest.fn();

  const {getReferenceProps} = useInteractions([
    {reference: {onClick: firstInteractionOnClick}},
    {
      reference: {
        onClick: secondInteractionOnClick,
        onKeyDown: secondInteractionOnKeyDown,
      },
    },
  ]);

  const {onClick, onKeyDown} = getReferenceProps({onClick: userOnClick});

  // @ts-expect-error
  onClick();
  // @ts-expect-error
  onKeyDown();

  expect(firstInteractionOnClick).toHaveBeenCalledTimes(1);
  expect(secondInteractionOnClick).toHaveBeenCalledTimes(1);
  expect(userOnClick).toHaveBeenCalledTimes(1);
  expect(secondInteractionOnKeyDown).toHaveBeenCalledTimes(1);
});

test('does not error with undefined user supplied functions', () => {
  const {getReferenceProps} = useInteractions([{reference: {onClick() {}}}]);

  expect(() =>
    // @ts-expect-error
    getReferenceProps({onClick: undefined}).onClick()
  ).not.toThrowError();
});
