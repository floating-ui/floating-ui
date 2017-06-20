import chai from 'chai';
const { expect } = chai;
import getParentNode from '../../src/utils/getParentNode';

describe('utils/getParentNode', () => {
  let node;

  beforeEach(() => {
    node = document.createElement('div');
  });

  it('should return parent node', () => {
    const div = document.createElement('div');
    div.appendChild(node);
    expect(getParentNode(node)).to.equal(div);
  });

  it('should stop at html', () => {
    const html = document.querySelector('html');
    expect(getParentNode(html)).to.equal(html);
  });

  it('should go outside shadowRoot if possible', () => {
    const div = document.createElement('div');
    let root;
    if (div.attachShadow) {
      root = div.attachShadow({ mode: 'open' });
      root.appendChild(node);
      expect(getParentNode(node)).to.equal(root);
      expect(getParentNode(root)).to.equal(div);
    }
  });
});
