import chai from 'chai';
const { expect } = chai;
import getOffsetParent from '../../src/utils/getOffsetParent';

describe('utils/getOffsetParent', () => {
  let node;

  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node);
  });

  afterEach(() => {
    document.body.removeChild(node);
  });

  it('element is just appended to the body', () => {
    expect(getOffsetParent(node)).to.equal(document.querySelector('html'));
  });

  it('element is inside positioned element', () => {
    const innerNode = document.createElement('div');
    node.style.position = 'absolute';
    node.appendChild(innerNode);
    expect(getOffsetParent(innerNode)).to.equal(node);
  });
});
