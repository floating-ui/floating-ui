// @flow
import contains from './contains';

it('returns correct results for simple parent/child relationships', () => {
  const child = document.createElement('div');
  const parent = document.createElement('div');
  const sibling = document.createElement('div');
  const grandChild = document.createElement('div');
  parent.appendChild(child);
  child.appendChild(grandChild);
  parent.appendChild(sibling);

  expect(contains(parent, child)).toBeTruthy();
  expect(contains(parent, sibling)).toBeTruthy();
  expect(contains(child, sibling)).toBeFalsy();
  expect(contains(parent, grandChild)).toBeTruthy();
  expect(contains(child, grandChild)).toBeTruthy();
  expect(contains(sibling, grandChild)).toBeFalsy();
});

it('returns correct results for shadow dom relationships', () => {
  const element = document.createElement('div');
  const shadowRoot = element.attachShadow({ mode: 'open' });
  const child = document.createElement('div');
  const sibling = document.createElement('div');
  const childShadowRoot = child.attachShadow({ mode: 'open' });
  const grandChild = document.createElement('div');
  shadowRoot.appendChild(child);
  shadowRoot.appendChild(sibling);
  childShadowRoot.appendChild(grandChild);

  expect(contains(element, child)).toBeTruthy();
  expect(contains(element, grandChild)).toBeTruthy();
  expect(contains(sibling, grandChild)).toBeFalsy();
});

it('returns true that a node contains itself', () => {
  const element = document.createElement('div');
  expect(contains(element, element)).toBeTruthy();
});

it('returns correct results for detached DOM with anchor as root', () => {
  const element = document.createElement('a');
  element.href = '0.0.0.0';
  const child = document.createElement('span');
  const sibling = document.createElement('span');
  const grandChild = document.createElement('span');
  element.appendChild(child);
  element.appendChild(sibling);
  child.appendChild(grandChild);

  expect(contains(element, child)).toBeTruthy();
  expect(contains(element, grandChild)).toBeTruthy();
  expect(contains(sibling, grandChild)).toBeFalsy();
});
