import {isVirtualClick} from '../../src/utils/event';

function clickEvent(
  overrides: Partial<PointerEvent> = {},
): MouseEvent | PointerEvent {
  return {
    type: 'click',
    detail: 0,
    buttons: 0,
    isTrusted: false,
    ...overrides,
  } as MouseEvent | PointerEvent;
}

test('detects trusted Firefox JAWS/NVDA virtual clicks via empty pointerType', () => {
  expect(
    isVirtualClick(
      clickEvent({
        detail: 1,
        isTrusted: true,
        pointerType: '',
      }),
    ),
  ).toBe(true);
});

test('does not treat untrusted empty pointerType clicks with detail as virtual', () => {
  expect(
    isVirtualClick(
      clickEvent({
        detail: 1,
        isTrusted: false,
        pointerType: '',
      }),
    ),
  ).toBe(false);
});

test('detects keyboard and other detail-0 virtual clicks', () => {
  expect(isVirtualClick(clickEvent({detail: 0}))).toBe(true);
});

test('does not treat real mouse clicks as virtual', () => {
  expect(
    isVirtualClick(
      clickEvent({
        detail: 1,
        pointerType: 'mouse',
      }),
    ),
  ).toBe(false);
});
