import {
  getNodeName,
  getOverflowAncestors,
  isElement,
  isHTMLElement,
  isNode,
  isShadowRoot,
} from '../src/dom';

afterEach(() => {
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

const guards = [isNode, isElement, isHTMLElement, isShadowRoot];

test.each(['append', 'adoptNode'] as const)(
  'recognizes nodes adopted from another window with %s',
  (method) => {
    const frame = document.body.appendChild(document.createElement('iframe'));
    const foreignDocument = frame.contentDocument!;
    const host = foreignDocument.createElement('div');
    const root = host.attachShadow({mode: 'open'});
    const text = foreignDocument.createTextNode('text');
    const svg = foreignDocument.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    const fragment = foreignDocument.createDocumentFragment();
    for (const node of [host, text, svg, fragment]) {
      if (method === 'adoptNode') {
        document.adoptNode(node);
      } else {
        document.body.append(node);
      }
      expect(node.ownerDocument).toBe(document);
      expect(node).not.toBeInstanceOf(Node);
      expect(isNode(node)).toBe(true);
    }
    expect(guards.map((guard) => guard(host))).toEqual([
      true,
      true,
      true,
      false,
    ]);
    expect(guards.map((guard) => guard(svg))).toEqual([
      true,
      true,
      false,
      false,
    ]);
    expect(guards.map((guard) => guard(text))).toEqual([
      true,
      false,
      false,
      false,
    ]);
    expect(guards.map((guard) => guard(root))).toEqual([
      true,
      false,
      false,
      true,
    ]);
    expect(guards.map((guard) => guard(fragment))).toEqual([
      true,
      false,
      false,
      false,
    ]);
    expect(getNodeName(host)).toBe('div');
    // Recognition must not depend on the source window remaining open.
    frame.remove();
    expect(isHTMLElement(host)).toBe(true);
    expect(isShadowRoot(root)).toBe(true);
  },
);

test('recognizes nodes living in, and adopted between, other windows', () => {
  const source = document.body.appendChild(document.createElement('iframe'));
  const target = document.body.appendChild(document.createElement('iframe'));
  const host = source.contentDocument!.createElement('div');
  const root = host.attachShadow({mode: 'open'});
  expect(isHTMLElement(host)).toBe(true);
  expect(isShadowRoot(root)).toBe(true);
  target.contentDocument!.body.append(host);
  expect(isHTMLElement(host)).toBe(true);
  expect(isShadowRoot(root)).toBe(true);
});

test('includes adopted overflow ancestors', () => {
  const frame = document.body.appendChild(document.createElement('iframe'));
  const overflow = frame.contentDocument!.createElement('div');
  overflow.style.overflow = 'hidden';
  const child = document.createElement('div');
  overflow.append(child);
  document.body.append(overflow);
  expect(getOverflowAncestors(child)).toEqual([overflow, window]);
});

test.each([
  null,
  undefined,
  0,
  'div',
  {},
  {getBoundingClientRect() {}},
  {nodeType: 1, nodeName: 'DIV'},
])('does not recognize a non-node: %j', (value) => {
  expect(guards.map((guard) => guard(value))).toEqual([
    false,
    false,
    false,
    false,
  ]);
  expect(getNodeName(value as Node)).toBe('#document');
});

test('does not mistake a document fragment with a host property for a shadow root', () => {
  const frame = document.body.appendChild(document.createElement('iframe'));
  const fragment = frame.contentDocument!.createDocumentFragment();
  Object.assign(fragment, {host: document.createElement('div')});
  document.adoptNode(fragment);
  expect(isShadowRoot(fragment)).toBe(false);
});

test('returns false without a window', () => {
  const node = document.createElement('div');
  vi.stubGlobal('window', undefined);
  expect(guards.map((guard) => guard(node))).toEqual([
    false,
    false,
    false,
    false,
  ]);
});
