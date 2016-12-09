import isModifierRequired from '../../src/utils/isModifierRequired';

describe('utils/isModifierRequired', () => {
  const testData = [
    { name: 'shift', enabled: true},
    { name: 'flip', enabled: true},
    { name: 'applyStyle', enabled: true},
  ];
  
  it('should return true if requested occurs before requesting', () => {
    const result = isModifierRequired(testData, 'applyStyle', 'flip');
    expect(result).toBe(true);
  });

  it('should return false if requested occurs after requesting', () => {
    const result = isModifierRequired(testData, 'flip', 'applyStyle');
    expect(result).toBe(false);
  });

  it('should return false if requested does not occur', () => {
    const result = isModifierRequired(testData, 'applyStyle', 'keepTogether');
    expect(result).toBe(false);
  });

  it('should return false if requesting does not occur', () => {
    const result = isModifierRequired(testData, 'keepTogether', 'flip');
    expect(result).toBe(false);
  });

  it('should return false if requested is not enabled', () => {
    const newTestData = [
      { name: 'shift', enabled: true},
      { name: 'flip', enabled: false},
      { name: 'applyStyle', enabled: true},
    ];

    // this case would return true if flip was enabled
    const result = isModifierRequired(newTestData, 'applyStyle', 'flip');
    expect(result).toBe(false);
  });

  it('should return false if requesting is not enabled', () => {
    const newTestData = [
      { name: 'shift', enabled: true},
      { name: 'flip', enabled: true},
      { name: 'applyStyle', enabled: false},
    ];

    const result = isModifierRequired(newTestData, 'applyStyle', 'flip');
    expect(result).toBe(false);
  });
});
