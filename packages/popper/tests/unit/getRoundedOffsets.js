import getRoundedOffsets from '../../src/utils/getRoundedOffsets';
import placements from '../../src/methods/placements';

const TOP = 200;
const BOTTOM = 300;
const EVEN_SIZE = { width: 20, height: 20, top: TOP, bottom: BOTTOM };
const ODD_SIZE = { width: 21, height: 21, top: TOP, bottom: BOTTOM };
const ROUNDS_UP = { left: 18.57127, right: 38.57127 };
const ROUNDED_UP = { left: 19, right: 39 };
const ROUNDED_DOWN = { left: 18, right: 38 };
const ALL_SIZE_COMBINATIONS = [
  [EVEN_SIZE, EVEN_SIZE],
  [EVEN_SIZE, ODD_SIZE],
  [ODD_SIZE, EVEN_SIZE],
  [ODD_SIZE, ODD_SIZE],
];
const variationPlacements = placements.filter(
  placement => placement.indexOf('-') !== -1
);

describe('utils/getRoundedOffsets', () => {
  it('Math.round()s when both popper and reference have even width', () => {
    const offsets = getRoundedOffsets({
      placement: 'bottom',
      offsets: {
        popper: { ...EVEN_SIZE, ...ROUNDS_UP },
        reference: EVEN_SIZE,
      },
    }, true);
    expect(offsets.left).toBe(ROUNDED_UP.left);
    expect(offsets.right).toBe(ROUNDED_UP.right);
    expect(offsets.top).toBe(TOP);
    expect(offsets.bottom).toBe(BOTTOM);
  });

  it('Math.floor()s when popper and reference have a difference in width oddness', () => {
    const offsets1 = getRoundedOffsets({
      placement: 'bottom',
      offsets: {
        popper: { ...EVEN_SIZE, ...ROUNDS_UP },
        reference: ODD_SIZE,
      },
    }, true);
    const offsets2 = getRoundedOffsets({
      placement: 'bottom',
      offsets: {
        popper: { ...ODD_SIZE, ...ROUNDS_UP },
        reference: EVEN_SIZE,
      },
    }, true);
    [offsets1, offsets2].forEach(offsets => {
      expect(offsets.left).toBe(ROUNDED_DOWN.left);
      expect(offsets.right).toBe(ROUNDED_DOWN.right);
      expect(offsets.top).toBe(TOP);
      expect(offsets.bottom).toBe(BOTTOM);
    })
  });

  it('Math.rounds()s and subtracts 1 from left offset if both are odd in width', () => {
    const offsets = getRoundedOffsets({
      placement: 'bottom',
      offsets: {
        popper: { ...ODD_SIZE, ...ROUNDS_UP },
        reference: ODD_SIZE,
      },
    }, true);
    expect(offsets.left).toBe(ROUNDED_UP.left - 1);
    expect(offsets.right).toBe(ROUNDED_UP.right);
    expect(offsets.top).toBe(TOP);
    expect(offsets.bottom).toBe(BOTTOM);
  });

  it('always Math.round()s variation placements', () => {
    variationPlacements.forEach(placement => {
      ALL_SIZE_COMBINATIONS.forEach(([popperSize, referenceSize]) => {
        const offsets = getRoundedOffsets({
          placement,
          offsets: {
            popper: { ...popperSize, ...ROUNDS_UP },
            reference: referenceSize,
          },
        }, true);
        expect(offsets.left).toBe(ROUNDED_UP.left);
        expect(offsets.right).toBe(ROUNDED_UP.right);
        expect(offsets.top).toBe(TOP);
        expect(offsets.bottom).toBe(BOTTOM);
      });
    });
  });

  it('always Math.round()s vertical offsets', () => {
    ALL_SIZE_COMBINATIONS.forEach(([popperSize, referenceSize]) => {
      const offsets = getRoundedOffsets({
        placement: 'bottom',
        offsets: {
          popper: { ...popperSize, ...ROUNDS_UP, top: 218.6, bottom: 318.6 },
          reference: referenceSize,
        },
      }, true);
      expect(offsets.top).toBe(219);
      expect(offsets.bottom).toBe(319);
    });
  });

  it('does not integerize the offsets if second argument is `false`', () => {
    ALL_SIZE_COMBINATIONS.forEach(([popperSize, referenceSize]) => {
      const offsets = getRoundedOffsets({
        placement: 'bottom',
        offsets: {
          popper: { ...popperSize, ...ROUNDS_UP, top: 218.6, bottom: 318.6 },
          reference: referenceSize,
        },
      }, false);
      expect(offsets.left).toBe(ROUNDS_UP.left);
      expect(offsets.right).toBe(ROUNDS_UP.right);
      expect(offsets.top).toBe(218.6);
      expect(offsets.bottom).toBe(318.6);
    });
  });
});
