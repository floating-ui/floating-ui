import chai from 'chai';
const { expect } = chai;
import getScrollParent from '../../src/utils/getScrollParent';

describe('utils/getOffsetParent', () => {
  let node;

  beforeEach(() => {
    node = document.createElement('div');
  });

  it('element is just appended to the body', () => {
    document.body.appendChild(node);
    expect(getScrollParent(node)).to.equal(document.body);
    document.body.removeChild(node);
  });

  describe('element is inside scrollable element', () => {
    let parent;

    beforeEach(() => {
      parent = document.createElement('div');
      parent.appendChild(node);
      document.body.appendChild(parent);
    });

    afterEach(() => {
      document.body.removeChild(parent);
    });

    [
      { key: 'overflow', value: 'scroll' },
      { key: 'overflowX', value: 'scroll' },
      { key: 'overflowY', value: 'scroll' },
      { key: 'overflow', value: 'auto' },
      { key: 'overflowX', value: 'auto' },
      { key: 'overflowY', value: 'auto' },
    ].forEach(obj => {
      it(`${obj.key}: ${obj.value}`, () => {
        parent.style[obj.key] = obj.value;
        expect(getScrollParent(node)).to.equal(parent);
      });
    });
  });

  describe('element is deep inside scrollable element', () => {
    let parent;

    beforeEach(() => {
      parent = document.createElement('div');
      parent.innerHTML = '<div><div></div></div>';
      parent.firstChild.firstChild.appendChild(node);
      document.body.appendChild(parent);
    });

    afterEach(() => {
      document.body.removeChild(parent);
    });

    [
      { key: 'overflow', value: 'scroll' },
      { key: 'overflowX', value: 'scroll' },
      { key: 'overflowY', value: 'scroll' },
      { key: 'overflow', value: 'auto' },
      { key: 'overflowX', value: 'auto' },
      { key: 'overflowY', value: 'auto' },
    ].forEach(obj => {
      it(`${obj.key}: ${obj.value}`, () => {
        parent.style[obj.key] = obj.value;
        expect(getScrollParent(node)).to.equal(parent);
      });
    });
  });
});
