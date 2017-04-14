import chai from 'chai';
const { expect } = chai;
import findIndex from '../../src/popper/utils/findIndex';

describe('utils/findIndex', () => {
  const arr = [
    { id: 1, value: '1v' },
    { id: 2, value: '2v' },
    { id: 3, value: '2v' },
    { id: 4, value: '2v' },
  ];

  it('should find correct element in an array', () => {
    expect(findIndex(arr, 'id', 1)).to.equal(0);
  });

  it('should return index of the fist found element', () => {
    expect(findIndex(arr, 'value', '2v')).to.equal(1);
  });

  it('should return -1 if nothing is found', () => {
    expect(findIndex(arr, 'value', '3v')).to.equal(-1);
  });
});
