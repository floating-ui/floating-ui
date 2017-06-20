import { parseOffset } from '../../src/modifiers/offset';

const popperOffsets = {
  top: 0,
  left: 0,
  right: 100,
  bottom: 100,
  width: 100,
  height: 100,
};

const referenceOffsets = popperOffsets;

describe('parseOffset', () => {
  it('parses `10px 10px` and throws deprecation warning', () => {
    console.warn = jasmine.createSpy('warn');
    expect(
      parseOffset('10px 10px', referenceOffsets, popperOffsets, 'bottom')
    ).toEqual([10, 10]);
    expect(console.warn).toHaveBeenCalledWith(
      'Offsets separated by white space(s) are deprecated, use a comma (,) instead.'
    );
  });

  const cases = [
    ['10,10', [10, 10]],
    ['10px, -10px', [10, -10]],
    ['10px, 10px', [10, 10]],
    ['10px + 5%, 10px - 5%', [10 + 5, 10 - 5]],
    ['-10px + 5%, -10px - 5%', [-10 + 5, -10 - 5]],
    ['5%p, 5%r', [5, 5]],
    ['100%+50px, 100px-10+10%', [100 + 50, 100 - 10 + 10]],
    ['100% + 50% + 10%, 100%', [100 + 50 + 10, 100]],
    ['100%p - 10%r, 100%', [100 - 10, 100]],
    ['100%p - -10%r, 100%', [100 - -10, 100]],
    ['+10px - -10% + -10%r', [10 - -10 + -10, 0]],
  ];

  cases.forEach(([input, output]) => {
    it(`parses '${input}'`, () => {
      expect(
        parseOffset(input, referenceOffsets, popperOffsets, 'bottom')
      ).toEqual(output);
    });
  });
});
