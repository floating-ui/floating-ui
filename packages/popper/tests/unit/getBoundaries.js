import getBoundaries from '../../src/utils/getBoundaries';
import getBoundingClientRect from '../../src/utils/getBoundingClientRect';
import isIE from '../../src/utils/isIE';
import getScrollParent from '../../src/utils/getScrollParent';
import getParentNode from '../../src/utils/getParentNode';
import findCommonOffsetParent from '../../src/utils/findCommonOffsetParent';
import getOffsetRectRelativeToArbitraryNode from '../../src/utils/getOffsetRectRelativeToArbitraryNode';
import getViewportOffsetRectRelativeToArtbitraryNode from '../../src/utils/getViewportOffsetRectRelativeToArtbitraryNode';
import getWindowSizes from '../../src/utils/getWindowSizes';
import isFixed from '../../src/utils/isFixed';
import getFixedPositionOffsetParent from '../../src/utils/getFixedPositionOffsetParent';


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
    if(isIE(10) || isIE(11)) {
      console.log('results', result);
      console.log('expected', expected);
    }
    document.addCustomLogging = false;
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
    const result = getBoundaries(popper, spacing, 0, 'scrollParent', false);
    expectBoundary(result, {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0,
    });    
  });

  it('returns a custom defined boundary within the page.', () => {
    if(isIE(10) || isIE(11)){
      const bounding = getBoundingClientRect(popper.ownerDocument.documentElement);
      console.log('IE Bounding : ', bounding);

      let boundaries = { top: 0, left: 0 };
      popper = scrollingPopper;
      const reference = scrollingChild;
      const boundariesElement = 'scrollParent';
      const fixedPosition = false;
      const offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);

      // Handle viewport case
      if (boundariesElement === 'viewport' ) {
        boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
      }

      else {
        // Handle other cases based on DOM element used as boundaries
        let boundariesNode;
        if (boundariesElement === 'scrollParent') {
          boundariesNode = getScrollParent(getParentNode(reference));
          if (boundariesNode.nodeName === 'BODY') {
            boundariesNode = popper.ownerDocument.documentElement;
          }
        } else if (boundariesElement === 'window') {
          boundariesNode = popper.ownerDocument.documentElement;
        } else {
          boundariesNode = boundariesElement;
        }

        
        const offsets = getOffsetRectRelativeToArbitraryNode(
          boundariesNode,
          offsetParent,
          fixedPosition
        );
        console.log('offset : ', offsets);
        // In case of HTML, we need a different computation
        if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
          const { height, width } = getWindowSizes(popper.ownerDocument);
          console.log('height - width', height, width); 
          boundaries.top += offsets.top - offsets.marginTop;
          boundaries.bottom = height + offsets.top;
          boundaries.left += offsets.left - offsets.marginLeft;
          boundaries.right = width + offsets.left;
        } else {
          // for all the other DOM elements, this one is good
          boundaries = offsets;
        }
      }
    }
    const result = getBoundaries(scrollingPopper, scrollingChild, 0, 'scrollParent', false);
    expectBoundary(result, {
      top: -150,
      right: window.innerWidth - 160,
      bottom: window.innerHeight - 150,
      left: -160,
    });
  });
});