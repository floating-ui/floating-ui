import findIndex from '../../src/utils/findIndex';

describe('utils/findIndex', () => {
  const testData = [
    { name: 'shift', enabled: true},
    { name: 'flip', enabled: true},
    { name: 'applyStyle', enabled: true},
  ];
  
  it('should return the index of an item where fn is true', () => {
    const result = findIndex(testData, mod => mod.name === 'flip');
    expect(result).toBe(1);
  });

  it('should return -1 if no item matches fb', () => {
    const result = findIndex(testData, mod => mod.name === 'keepTogether');
    expect(result).toBe(-1);
  });
});
