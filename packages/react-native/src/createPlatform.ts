import type {Platform, VirtualElement} from '@floating-ui/core';
import {Dimensions, Platform as RNPlatform, StatusBar} from 'react-native';
import type {View} from 'react-native';

const ORIGIN = {x: 0, y: 0};

const isAndroid = RNPlatform.OS === 'android';

function isView(reference: View | VirtualElement): reference is View {
  return 'measure' in reference;
}

export const createPlatform = ({
  offsetParent,
  sameScrollView = true,
}: {
  offsetParent: View;
  sameScrollView: boolean;
  scrollOffsets: {
    x: number;
    y: number;
  };
}): Platform => ({
  getElementRects({
    reference,
    floating,
  }: {
    reference: View | VirtualElement;
    floating: View;
  }) {
    return new Promise((resolve) => {
      const onMeasure = (offsetX = 0, offsetY = 0) => {
        floating.measure(
          (x: number, y: number, width: number, height: number) => {
            const floatingRect = {width, height, ...ORIGIN};
            const method = sameScrollView ? 'measure' : 'measureInWindow';

            if (isView(reference)) {
              reference[method](
                (x: number, y: number, width: number, height: number) => {
                  y =
                    isAndroid && !sameScrollView && StatusBar.currentHeight
                      ? y + StatusBar.currentHeight
                      : y;
                  const referenceRect = {
                    width,
                    height,
                    x: x - offsetX,
                    y: y - offsetY,
                  };

                  resolve({reference: referenceRect, floating: floatingRect});
                },
              );
            } else {
              const boundingRect = reference.getBoundingClientRect();
              const referenceRect = {
                width: boundingRect.width,
                height: boundingRect.height,
                x: boundingRect.x - offsetX,
                y: boundingRect.y - offsetY,
              };

              resolve({reference: referenceRect, floating: floatingRect});
            }
          },
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
      ...ORIGIN,
    });
  },
  convertOffsetParentRelativeRectToViewportRelativeRect({rect, elements}) {
    return new Promise((resolve) => {
      const onMeasure = (offsetX = 0, offsetY = 0) => {
        resolve({...rect, x: rect.x + offsetX, y: rect.y + offsetY});
      };

      if (offsetParent) {
        offsetParent.measure(onMeasure);
      } else if (sameScrollView && elements && isView(elements.reference)) {
        elements.reference.measure(
          (localX, localY, _width, _height, pageX, pageY) => {
            onMeasure(pageX - localX, pageY - localY);
          },
        );
      } else {
        onMeasure();
      }
    });
  },
  getDimensions: (element) =>
    new Promise((resolve) =>
      element.measure((x: number, y: number, width: number, height: number) =>
        resolve({width, height}),
      ),
    ),
});
