import chai from 'chai';
const { expect } = chai;
import getStyleComputedProperty
  from 'src/popper/utils/getStyleComputedProperty';

describe('utils/getStyleComputedProperty', () => {
  let node;

  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node);
    node.style.position = 'relative';
  });

  it('should return css properties', () => {
    expect(getStyleComputedProperty(node)).to.deep.equal(
      window.getComputedStyle(node, null)
    );
  });

  it('should return one css property', () => {
    expect(getStyleComputedProperty(node, 'position')).to.equal('relative');
  });

  it('should return an empty array from the shadowRoot', () => {
    let root;
    if (node.attachShadow) {
      root = node.attachShadow({ mode: 'open' });
      expect(getStyleComputedProperty(root)).to.deep.equal([]);
    }
  });
});
