import getBoundaries from '../../src/utils/getBoundaries';

describe('utils/getBoundaries', () => {
  let node;
  let spacing;
  let scrolling;
  let scrollingChild;
  let popper;
  let scrollingPopper;

  function setCss(element, css) {
    for (const key in css) {
      if (css.hasOwnProperty(key)) {
        element.style[key] = css[key];
      }
    }
  }
  function expectBoundary(result, expected) {
    const tolerance = 2;
    expect(Math.abs(result.top - expected.top) <= tolerance).toBeTruthy();
    expect(Math.abs(result.right - expected.right) <= tolerance).toBeTruthy();
    expect(Math.abs(result.bottom - expected.bottom) <= tolerance).toBeTruthy();
    expect(Math.abs(result.left - expected.left) <= tolerance).toBeTruthy();
  }

  beforeEach(() => {
    node = document.createElement('div');
    spacing = document.createElement('div');
    popper = document.createElement('div');
    scrollingPopper = document.createElement('div');

    scrolling = document.createElement('div');
    setCss(scrolling, {
      top: '150px',
      left: '160px',
      right: '300px',
      bottom: '400px',
      height: '150px',
      width: '125px',
    });

    scrollingChild = document.createElement('div');
    setCss(scrollingChild, {
      overflow: 'scroll',
      top: '50px',
      left: '60px',
      right: '-100px',
      bottom: '-200px',
      height: '350px',
      width: '625px',
      position: 'absolute',
      transform: 'translate3d(100px, 100px, 0)',
      willChange: 'transform',
    });

    document.body.appendChild(node);
    node.appendChild(spacing);
    node.appendChild(scrolling);
    node.appendChild(popper);
    scrolling.appendChild(scrollingChild);
    scrollingChild.appendChild(scrollingPopper);
  });

  afterEach(() => {
    document.body.removeChild(node);
  });

  it('returns a boundary defined by the document element.', () => {
    const result = getBoundaries(popper, node, 0, 'window', true);
    expectBoundary(result, {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0,
    });
  });

  it('returns a boundary defined by the document element by way of a child reference.', () => {
    const result = getBoundaries(popper, spacing, 0, 'scrollParent', true);
    expectBoundary(result, {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0,
    });
  });

  it('returns a custom defined boundary within the page.', () => {
    const result = getBoundaries(scrollingPopper, scrollingChild, 0, 'scrollParent', false);
    expectBoundary(result, {
      top: -150,
      right: window.innerWidth - 160,
      bottom: window.innerHeight - 150,
      left: -160,
    });
  });
});
