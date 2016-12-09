import isModifierEnabled from '../../src/utils/isModifierEnabled';

describe('utils/isModifierEnabled', () => {
  const testData = [
    { name: 'shift', enabled: false},
    { name: 'flip', enabled: true},
    { name: 'applyStyle', enabled: true},
  ];
  
  it('should return true if the modifier is enabled', () => {
    const result = isModifierEnabled(testData, 'flip');
    expect(result).toBe(true);
  });

  it('should return false if the modifier is not enabled', () => {
    const result = isModifierEnabled(testData, 'shift');
    expect(result).toBe(false);
  });

  it('should return false if the modifier is not in the list', () => {
    const result = isModifierEnabled(testData, 'keepTogether');
    expect(result).toBe(false);
  });
});
