import chai from 'chai';
const { expect } = chai;
import getOppositePlacement from '../../src/popper/utils/getOppositePlacement';

describe('utils/getOppositePlacement', () => {
  it('should return correct values', () => {
    expect(getOppositePlacement('top')).to.equal('bottom');
    expect(getOppositePlacement('top-start')).to.equal('bottom-start');
    expect(getOppositePlacement('top-end')).to.equal('bottom-end');
    expect(getOppositePlacement('bottom')).to.equal('top');
    expect(getOppositePlacement('bottom-start')).to.equal('top-start');
    expect(getOppositePlacement('bottom-end')).to.equal('top-end');
    expect(getOppositePlacement('left')).to.equal('right');
    expect(getOppositePlacement('left-start')).to.equal('right-start');
    expect(getOppositePlacement('left-end')).to.equal('right-end');
    expect(getOppositePlacement('right')).to.equal('left');
    expect(getOppositePlacement('right-start')).to.equal('left-start');
    expect(getOppositePlacement('right-end')).to.equal('left-end');
  });
});
