import getBoundaries from '../../src/utils/getBoundaries';

describe('utils/getBoundaries-padding-offset', () => {
  let node;

  beforeEach(() => {
    node = document.createElement('div');    
    document.body.appendChild(node);   
  });

  afterEach(() => {
    document.body.removeChild(node);
  });

  function expectBoundary(result, expected) {
    const tolerance = 2;
    expect(Math.abs(result.top - expected.top) <= tolerance).toBeTruthy();
    expect(Math.abs(result.right - expected.right) <= tolerance).toBeTruthy();
    expect(Math.abs(result.bottom - expected.bottom) <= tolerance).toBeTruthy();
    expect(Math.abs(result.left - expected.left) <= tolerance).toBeTruthy();
  }

  it('returns a boundary with a single value padding offset.', () => {
    const padding = 50;
    const result = getBoundaries(null, null, padding, 'viewport', true);
    expectBoundary(result, {
      top: 50,
      right: window.innerWidth - 50,
      bottom: window.innerHeight - 50,
      left: 50,
    });
  });

  it('returns a boundary with a top and left componentized padding offset.', () => {
    const padding = { 
      top: 50,
      left: 100,
    };
    const result = getBoundaries(null, null, padding, 'viewport', true);
    expectBoundary(result, {
      top: 50,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 100,
    });
  });

  it('returns a boundary with a bottom and right componentized padding offset.', () => {
    const padding = { 
      bottom: 50,
      right: 85,
    };
    const result = getBoundaries(null, null, padding, 'viewport', true);
    expectBoundary(result, {
      top: 0,
      right: window.innerWidth - 85,
      bottom: window.innerHeight - 50,
      left: 0,
    });
  });

  it('returns a boundary with a null padding offset.', () => {
    const padding = null;
    const result = getBoundaries(null, null, padding, 'viewport', true);
    expectBoundary(result, {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0,
    });
  });
});