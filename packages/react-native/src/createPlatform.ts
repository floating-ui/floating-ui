import {Dimensions} from 'react-native';
import {
  Platform,
  Dimensions as DimensionsType,
  rectToClientRect,
} from '@floating-ui/core';

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

      if (offsetParent.current) {
        offsetParent.current.measure(onMeasure);
      } else {
        onMeasure();
      }
    });
  },
  getClippingClientRect() {
    const {width, height} = Dimensions.get('window');
    return Promise.resolve(
      rectToClientRect({
        width,
        height,
        ...(sameScrollView ? scrollOffsets : ORIGIN),
      })
    );
  },
  convertOffsetParentRelativeRectToViewportRelativeRect({rect}) {
    return new Promise((resolve) => {
      const onMeasure = (offsetX = 0, offsetY = 0) => {
        resolve({...rect, x: rect.x + offsetX, y: rect.y + offsetY});
      };

      if (offsetParent.current) {
        offsetParent.current.measure(onMeasure);
      } else {
        onMeasure();
      }
    });
  },
  getDocumentElement: () => Promise.resolve({}),
  // these are the properties accessed on an offsetParent
  getOffsetParent: () =>
    Promise.resolve({
      clientLeft: 0,
      clientTop: 0,
      clientWidth: 0,
      clientHeight: 0,
    }),
  getDimensions: ({element}) =>
    new Promise((resolve) =>
      element.measure(({width, height}: DimensionsType) =>
        resolve({width, height})
      )
    ),
  isElement: () => Promise.resolve(true),
});
