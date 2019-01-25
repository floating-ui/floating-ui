import chai from 'chai';
const { expect } = chai;
import getOuterSizes from '../../src/utils/getOuterSizes';

describe('utils/getOuterSizes', () => {
  let node;

  beforeEach(() => {
    node = document.createElement('div');
  });

  describe('when the element is not attach on the DOM', () => {
    it('should returns 0 width and height for empty elements', () => {
      expect(getOuterSizes(node)).to.deep.equal({
        width: 0,
        height: 0,
      });
    });
  });

  describe('when the element is attach on the DOM', () => {
    it('should returns width and height for elements without margins', () => {
      node.style.width = '20px';
      node.style.height = '20px';
      document.body.appendChild(node);
      node.style.position = 'relative';

      expect(getOuterSizes(node)).to.deep.equal({
        width: 20,
        height: 20,
      });
    });

    it('should returns width and height for elements with margins', () => {
      node.style.width = '20px';
      node.style.height = '20px';
      node.style.margin = '10px';
      document.body.appendChild(node);
      node.style.position = 'relative';

      expect(getOuterSizes(node)).to.deep.equal({
        width: 40,
        height: 40,
      });
    });
  });
});
