// @flow
import getParentNode from './getParentNode';

it('returns a parent element', () => {
  const child = document.createElement('div');
  const parent = document.createElement('div');
  parent.appendChild(child);

  expect(getParentNode(child)).toBe(parent);
});

it('returns a parent body', () => {
  const child = document.createElement('div');
  document.body && document.body.appendChild(child);
  expect(getParentNode(child)).toBe(document.body);
});

it("returns itself if it's documentElement", () => {
  document.documentElement &&
    expect(getParentNode(document.documentElement)).toBe(
      document.documentElement
    );
});

it('fallbacks to documentElement if no parentNode can be extracted', () => {
  const element = document.createElement('div');
  expect(getParentNode(element)).toBe(document.documentElement);
});

// JSDOM doesn't support Shadow DOM unfortunately, polyfills didn't help
it('returns the shadow dom host', () => {
  const element = document.createElement('div');
  const shadowRoot = element.attachShadow({ mode: 'open' });
  const child = document.createElement('div');
  shadowRoot.appendChild(child);
  expect(getParentNode(child)).toBe(shadowRoot);
  expect(getParentNode(shadowRoot)).toBe(element);
});
