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

  expect(other.getAttribute('inert')).toBe('true');

  cleanup();

  expect(other.getAttribute('inert')).toBe(null);
});

test('multiple calls', () => {
  const other = document.createElement('div');
  document.body.appendChild(other);
  const target = document.createElement('div');
  document.body.appendChild(target);

  const cleanup = markOthers([target], true);

  expect(other.getAttribute('inert')).toBe('true');

  const nextTarget = document.createElement('div');
  document.body.appendChild(nextTarget);

  const nextCleanup = markOthers([nextTarget], true);

  expect(target.getAttribute('inert')).toBe('true');
  expect(nextTarget.getAttribute('inert')).toBe(null);

  document.body.removeChild(nextTarget);

  nextCleanup();

  expect(target.getAttribute('inert')).toBe(null);
  expect(other.getAttribute('inert')).toBe('true');

  cleanup();

  expect(other.getAttribute('inert')).toBe(null);

  document.body.appendChild(nextTarget);
});

test('out of order cleanup', () => {
  const other = document.createElement('div');
  document.body.appendChild(other);
  const target = document.createElement('div');
  target.setAttribute('data-testid', '');
  document.body.appendChild(target);

  const cleanup = markOthers([target], true);

  expect(other.getAttribute('inert')).toBe('true');

  const nextTarget = document.createElement('div');
  document.body.appendChild(nextTarget);

  const nextCleanup = markOthers([nextTarget], true);

  expect(target.getAttribute('inert')).toBe('true');
  expect(nextTarget.getAttribute('inert')).toBe(null);

  cleanup();

  expect(nextTarget.getAttribute('inert')).toBe(null);
  expect(target.getAttribute('inert')).toBe('true');
  expect(other.getAttribute('inert')).toBe('true');

  nextCleanup();

  expect(nextTarget.getAttribute('inert')).toBe(null);
  expect(other.getAttribute('inert')).toBe(null);
  expect(target.getAttribute('inert')).toBe(null);
});
