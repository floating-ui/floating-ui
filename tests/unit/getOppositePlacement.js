import chai from 'chai';
const { expect } = chai;
import getOppositePlacement from '../../src/popper/utils/getOppositePlacement';

describe('utils/getOppositePlacement', () => {
  it('should return correct values', () => {
    expect(getOppositePlacement('top')).to.equal('bottom');
    expect(getOppositePlacement('bottom')).to.equal('top');
    expect(getOppositePlacement('left')).to.equal('right');
    expect(getOppositePlacement('right')).to.equal('left');
  });
});
