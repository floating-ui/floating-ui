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
  measureInWindow = true,
  scrollOffsets = ORIGIN,
}: {
  offsetParent: View;
  measureInWindow: boolean;
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
            const method = measureInWindow ? 'measureInWindow' : 'measure';

            if (isView(reference)) {
              reference[method](
                (x: number, y: number, width: number, height: number) => {
                  y =
                    isAndroid && measureInWindow && StatusBar.currentHeight
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
    const {width, height: windowHeight} = Dimensions.get('window');

    let height: number;
    if (isAndroid) {
      // on Android, we need to add the status bar height to the window to address the issue
      // mentioned at https://github.com/floating-ui/floating-ui/issues/2904
      // Note: keeping like this for now to avoid breaking changes, but edge-to-edge apps
      // on Android should have a different logic
      const statusBarHeight = StatusBar.currentHeight || 0;
      height = windowHeight + statusBarHeight;
    } else {
      // on web and iOS, no issue with status bar height
      height = windowHeight;
    }

    return Promise.resolve({
      width,
      height,
      ...(measureInWindow ? ORIGIN : scrollOffsets),
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
        resolve({width, height}),
      ),
    ),
});
