// @flow
import type { Modifier, ModifierArguments } from '../types';
import { bottom, top, left, right, end } from '../enums';
import detectOverflow, {
  type Options as DetectOverflowOptions,
} from '../utils/detectOverflow';
import getBasePlacement from '../utils/getBasePlacement';
import getVariation from '../utils/getVariation';
import isVerticalPlacement from '../utils/isVerticalPlacement';

export type Options = {|
  ...DetectOverflowOptions,
|};

export const size = (options: $Shape<Options> = {}): Modifier => ({
  name: 'size',
  async fn(modifierArguments: ModifierArguments) {
    const { placement, rects } = modifierArguments;

    const overflow = await detectOverflow(modifierArguments, options);
    const basePlacement = getBasePlacement(placement);
    const isEnd = getVariation(placement) === end;

    let heightSide;
    let widthSide;

    if (isVerticalPlacement(placement)) {
      heightSide = basePlacement;
      widthSide = isEnd ? left : right;
    } else {
      widthSide = basePlacement;
      heightSide = isEnd ? top : bottom;
    }

    return {
      data: {
        height: rects.popper.height - overflow[heightSide],
        width: rects.popper.width - overflow[widthSide],
      },
    };
  },
});
