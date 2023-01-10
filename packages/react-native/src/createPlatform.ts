import {Platform} from '@floating-ui/core';
import {Dimensions} from 'react-native';

const ORIGIN = {x: 0, y: 0};

export const createPlatform = ({
  offsetParent,
  sameScrollView = true,
  scrollOffsets = ORIGIN,
}: {
  offsetParent: any;
  sameScrollView: boolean;
  scrollOffsets: {
    x: number;
    y: number;
  };
}): Platform => ({
  getElementRects({reference, floating}) {
    return new Promise((resolve) => {
      const onMeasure = (offsetX = 0, offsetY = 0) => {
        floating.measure(
          (x: number, y: number, width: number, height: number) => {
            const floatingRect = {width, height, ...ORIGIN};
            const method = sameScrollView ? 'measure' : 'measureInWindow';

            reference[method](
              (x: number, y: number, width: number, height: number) => {
                const referenceRect = {
                  width,
                  height,
                  x: x - offsetX,
                  y: y - offsetY,
                };

                resolve({reference: referenceRect, floating: floatingRect});
              }
            );
          }
        );
      };

      if (offsetParent) {
        offsetParent.measure(onMeasure);
      } else {
        onMeasure();
      }
    });
  },
  getClippingRect() {
    const {width, height} = Dimensions.get('window');
    return Promise.resolve({
      width,
      height,
      ...(sameScrollView ? scrollOffsets : ORIGIN),
    });
  },
  convertOffsetParentRelativeRectToViewportRelativeRect({rect}) {
    return new Promise((resolve) => {
      const onMeasure = (offsetX = 0, offsetY = 0) => {
        resolve({...rect, x: rect.x + offsetX, y: rect.y + offsetY});
      };

      if (offsetParent) {
        offsetParent.measure(onMeasure);
      } else {
        onMeasure();
      }
    });
  },
  getDimensions: (element) =>
    new Promise((resolve) =>
      element.measure((x: number, y: number, width: number, height: number) =>
        resolve({width, height})
      )
    ),
});
