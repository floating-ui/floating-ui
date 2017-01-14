import chai from 'chai';
const { expect } = chai;
import getOppositeVariation from '../../src/popper/utils/getOppositeVariation';

describe('utils/getOppositeVariation', () => {
  it('should return correct values', () => {
    expect(getOppositeVariation('start')).to.equal('end');
    expect(getOppositeVariation('end')).to.equal('start');
    expect(getOppositeVariation('invalid')).to.equal('invalid');
  });
});
