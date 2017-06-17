import chai from 'chai';
const { expect } = chai;
import isFixed from '../../src/utils/isFixed';

describe('utils/isFixed', () => {
  let node;

  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node);
  });

  afterEach(() => {
    document.body.removeChild(node);
  });

  it('element is just appended to the body', () => {
    expect(isFixed(node)).to.be.false;
  });

  it('element is inside fixed element', () => {
    const innerNode = document.createElement('div');
    node.style.position = 'fixed';
    node.appendChild(innerNode);
    expect(isFixed(node)).to.be.true;
  });

  it('element is deep inside fixed element', () => {
    const innerNode = document.createElement('div');
    node.style.position = 'fixed';
    node.innerHTML = '<div><div></div></div>';
    node.firstChild.firstChild.appendChild(innerNode);
    expect(isFixed(node)).to.be.true;
  });

  it('element is inside an element with any position other than fixed', () => {
    ['static', 'relative', 'absolute'].forEach(position => {
      const innerNode = document.createElement('div');
      node.style.position = position;
      node.innerHTML = '<div><div></div></div>';
      node.firstChild.firstChild.appendChild(innerNode);
      expect(isFixed(node)).to.be.false;
    });
  });
});
