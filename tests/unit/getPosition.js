import chai from 'chai';
const { expect } = chai;
import getPosition from 'src/popper/utils/getPosition';

describe('utils/getPosition', () => {
  let node;

  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node);
  });

  afterEach(() => {
    document.body.removeChild(node);
  });

  it('element is just appended to the body', () => {
    expect(getPosition(node)).to.equal('absolute');
  });

  it('element is inside fixed element', () => {
    const innerNode = document.createElement('div');
    node.style.position = 'fixed';
    node.appendChild(innerNode);
    expect(getPosition(innerNode)).to.equal('fixed');
  });

  it('element is deep inside fixed element', () => {
    const innerNode = document.createElement('div');
    node.style.position = 'fixed';
    node.innerHTML = '<div><div></div></div>';
    node.firstChild.firstChild.appendChild(innerNode);
    expect(getPosition(innerNode)).to.equal('fixed');
  });

  it('element is inside an element with any position other than fixed', () => {
    ['static', 'relative', 'absolute'].forEach((position) => {
      const innerNode = document.createElement('div');
      node.style.position = position;
      node.innerHTML = '<div><div></div></div>';
      node.firstChild.firstChild.appendChild(innerNode);
      expect(getPosition(innerNode)).to.equal('absolute');
    });
  })
});
