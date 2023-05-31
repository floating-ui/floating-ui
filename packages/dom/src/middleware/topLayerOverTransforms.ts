import type {MiddlewareState} from '../types';
import {getContainingBlock} from '../utils/getContainingBlock';
import {getWindow} from '../utils/getWindow';

export const topLayerOverTransforms = () => ({
  name: 'topLayer',
  async fn(MiddlewareState: MiddlewareState) {
    const {
      x,
      y,
      elements: {reference, floating},
    } = MiddlewareState;
    let onTopLayer = false;
    let topLayerIsFloating = false;
    const diffCoords = {
      x: 0,
      y: 0,
    };
    try {
      onTopLayer = onTopLayer || floating.matches(':popover-open');
      // eslint-disable-next-line no-empty
    } catch (e) {}
    try {
      onTopLayer = onTopLayer || floating.matches(':open');
      // eslint-disable-next-line no-empty
    } catch (e) {}
    try {
      onTopLayer = onTopLayer || floating.matches(':modal');
      // eslint-disable-next-line no-empty
    } catch (e) {}
    topLayerIsFloating = onTopLayer;
    if (!onTopLayer) {
      const dialogAncestorQueryEvent = new Event('floating-ui-dialog-test', {
        composed: true,
        bubbles: true,
      });
      floating.addEventListener(
        'floating-ui-dialog-test',
        (event: Event) => {
          (event.composedPath() as unknown as Element[]).forEach((el) => {
            if (el === floating || el.localName !== 'dialog') return;
            try {
              onTopLayer = onTopLayer || el.matches(':modal');
              if (onTopLayer) {
                // console.log(el);
              }
              // eslint-disable-next-line no-empty
            } catch (e) {}
          });
        },
        {once: true}
      );
      floating.dispatchEvent(dialogAncestorQueryEvent);
    }
    let overTransforms = false;
    const containingBlock = getContainingBlock(reference as Element);
    if (
      containingBlock !== null &&
      (containingBlock as unknown as typeof window) !==
        getWindow(containingBlock)
    ) {
      overTransforms = true;
    }

    if (onTopLayer && overTransforms && containingBlock) {
      const rect = containingBlock.getBoundingClientRect();
      diffCoords.x = rect.x;
      diffCoords.y = rect.y;
    }

    if (onTopLayer && topLayerIsFloating) {
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: diffCoords,
      };
    }

    if (onTopLayer) {
      return {
        x,
        y,
        data: diffCoords,
      };
    }

    return {
      x: x - diffCoords.x,
      y: y - diffCoords.y,
      data: diffCoords,
    };
  },
});
