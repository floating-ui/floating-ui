import type {Platform, VirtualElement} from '@floating-ui/core';
import {Dimensions, Platform as RNPlatform, StatusBar} from 'react-native';
import type {View} from 'react-native';

const ORIGIN = {x: 0, y: 0};

const isAndroid = RNPlatform.OS === 'android';

function shouldAdjustYCoordOnAndroid(): boolean {
  if (!isAndroid) {
    return false;
  }

  const rnVersion = (
    RNPlatform.constants as
      | {reactNativeVersion?: {major: number; minor: number}}
      | undefined
  )?.reactNativeVersion;

  // React Native 0.86+ (facebook/react-native#56056) includes the status bar
  // height in measureInWindow under edge-to-edge, so adding StatusBar.currentHeight
  // double-counts it.
  if (rnVersion && (rnVersion.major > 0 || rnVersion.minor >= 86)) {
    return false;
  }

  return true;
}

function isView(reference: View | VirtualElement): reference is View {
  return 'measure' in reference;
}

export const createPlatform = ({
  offsetParent,
  sameScrollView = true,
  scrollOffsets = ORIGIN,
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
                    shouldAdjustYCoordOnAndroid() &&
                    !sameScrollView &&
                    StatusBar.currentHeight
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
        resolve({width, height}),
      ),
    ),
});
