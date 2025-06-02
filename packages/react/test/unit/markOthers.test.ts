import {markOthers} from '../../src/utils/markOthers';

afterEach(() => {
  document.body.innerHTML = '';
});

test('single call', () => {
  const other = document.createElement('div');
  document.body.appendChild(other);
  const target = document.createElement('div');
  document.body.appendChild(target);

  const cleanup = markOthers([target], true);

  expect(other.getAttribute('aria-hidden')).toBe('true');

  cleanup();

  expect(other.getAttribute('aria-hidden')).toBe(null);
});

test('multiple calls', () => {
  const other = document.createElement('div');
  document.body.appendChild(other);
  const target = document.createElement('div');
  document.body.appendChild(target);

  const cleanup = markOthers([target], true);

  expect(other.getAttribute('aria-hidden')).toBe('true');

  const nextTarget = document.createElement('div');
  document.body.appendChild(nextTarget);

  const nextCleanup = markOthers([nextTarget], true);

  expect(target.getAttribute('aria-hidden')).toBe('true');
  expect(nextTarget.getAttribute('aria-hidden')).toBe(null);

  document.body.removeChild(nextTarget);

  nextCleanup();

  expect(target.getAttribute('aria-hidden')).toBe(null);
  expect(other.getAttribute('aria-hidden')).toBe('true');

  cleanup();

  expect(other.getAttribute('aria-hidden')).toBe(null);

  document.body.appendChild(nextTarget);
});

test('out of order cleanup', () => {
  const other = document.createElement('div');
  document.body.appendChild(other);
  const target = document.createElement('div');
  target.setAttribute('data-testid', '');
  document.body.appendChild(target);

  const cleanup = markOthers([target], true);

  expect(other.getAttribute('aria-hidden')).toBe('true');

  const nextTarget = document.createElement('div');
  document.body.appendChild(nextTarget);

  const nextCleanup = markOthers([nextTarget], true);

  expect(target.getAttribute('aria-hidden')).toBe('true');
  expect(nextTarget.getAttribute('aria-hidden')).toBe(null);

  cleanup();

  expect(nextTarget.getAttribute('aria-hidden')).toBe(null);
  expect(target.getAttribute('aria-hidden')).toBe('true');
  expect(other.getAttribute('aria-hidden')).toBe('true');

  nextCleanup();

  expect(nextTarget.getAttribute('aria-hidden')).toBe(null);
  expect(other.getAttribute('aria-hidden')).toBe(null);
  expect(target.getAttribute('aria-hidden')).toBe(null);
});

test('multiple cleanups with differing controlAttribute', () => {
  const other = document.createElement('div');
  document.body.appendChild(other);
  const target = document.createElement('div');
  target.setAttribute('data-testid', '1');
  document.body.appendChild(target);

  const cleanup = markOthers([target], true);

  expect(other.getAttribute('aria-hidden')).toBe('true');

  const target2 = document.createElement('div');
  target.setAttribute('data-testid', '2');
  document.body.appendChild(target2);

  const cleanup2 = markOthers([target2]);

  expect(target.getAttribute('aria-hidden')).not.toBe('true');
  expect(target.getAttribute('data-floating-ui-inert')).toBe('');

  cleanup();

  expect(other.getAttribute('aria-hidden')).toBe(null);

  cleanup2();

  expect(target.getAttribute('data-floating-ui-inert')).toBe(null);
});

test('mixed controlAttribute usage (aria-hidden/inert/none)', () => {
  const other = document.createElement('div');
  document.body.appendChild(other);

  const A = document.createElement('div');
  A.setAttribute('data-testid', 'A');
  document.body.appendChild(A);

  const B = document.createElement('div');
  B.setAttribute('data-testid', 'B');
  document.body.appendChild(B);

  const C = document.createElement('div');
  C.setAttribute('data-testid', 'C');
  document.body.appendChild(C);

  const cleanupA = markOthers([A], /* ariaHidden= */ true);

  expect(other.getAttribute('aria-hidden')).toBe('true');
  expect(other.hasAttribute('inert')).toBe(false);
  expect(other.getAttribute('data-floating-ui-inert')).toBe('');

  const cleanupB = markOthers([B], /* ariaHidden= */ false, /* inert= */ true);

  expect(other.getAttribute('aria-hidden')).toBe('true');
  expect(other.getAttribute('inert')).toBe('');
  expect(other.getAttribute('data-floating-ui-inert')).toBe('');

  const cleanupC = markOthers([C], /* ariaHidden= */ false, /* inert= */ false);

  expect(other.getAttribute('aria-hidden')).toBe('true');
  expect(other.getAttribute('inert')).toBe('');
  expect(other.getAttribute('data-floating-ui-inert')).toBe('');

  cleanupC();

  expect(other.getAttribute('aria-hidden')).toBe('true');
  expect(other.getAttribute('inert')).toBe('');
  expect(other.getAttribute('data-floating-ui-inert')).toBe('');

  cleanupB();

  expect(other.getAttribute('aria-hidden')).toBe('true');
  expect(other.hasAttribute('inert')).toBe(false);
  expect(other.getAttribute('data-floating-ui-inert')).toBe('');

  cleanupA();

  expect(other.hasAttribute('aria-hidden')).toBe(false);
  expect(other.hasAttribute('inert')).toBe(false);
  expect(other.hasAttribute('data-floating-ui-inert')).toBe(false);
});
