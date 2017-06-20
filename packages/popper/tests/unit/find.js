import chai from 'chai';
const { expect } = chai;
import find from '../../src/utils/find';

describe('utils/find', () => {
  const arr = [
    { id: 1, value: '1v' },
    { id: 2, value: '2v' },
    { id: 3, value: '2v' },
    { id: 4, value: '2v' },
  ];

  it('should find correct element in an array', () => {
    expect(find(arr, el => el.id === 1)).to.deep.equal({ id: 1, value: '1v' });
  });

  it('should return the fist found element', () => {
    expect(find(arr, el => el.value === '2v')).to.deep.equal({
      id: 2,
      value: '2v',
    });
  });

  it('should return undefined if nothing is found', () => {
    expect(find(arr, el => el.value === '3v')).to.equal(undefined);
  });
});
