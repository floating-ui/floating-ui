import type {Platform, VirtualElement} from '@floating-ui/core';
import {Dimensions, Platform as RNPlatform, StatusBar} from 'react-native';
import type {View} from 'react-native';

const ORIGIN = {x: 0, y: 0};

const isAndroid = RNPlatform.OS === 'android';

function isView(reference: View | VirtualElement): reference is View {
  return 'measure' in reference;
}

function getOffsetParentOffset(
  offsetParent: View | null | undefined,
  measureInWindow: boolean,
  cb: (x?: number, y?: number) => void,
) {
  if (!offsetParent) {
    cb();
    return;
  }

  offsetParent.measure(
    (
      x: number,
      y: number,
      _width: number,
      _height: number,
      pageX: number,
      pageY: number,
    ) => {
      cb(
        measureInWindow && pageX != null ? pageX : x,
        measureInWindow && pageY != null ? pageY : y,
      );
    },
  );
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

      getOffsetParentOffset(offsetParent, measureInWindow, onMeasure);
    });
  },
  getClippingRect() {
    const {width, height} = Dimensions.get('window');

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

      getOffsetParentOffset(offsetParent, measureInWindow, onMeasure);
    });
  },
  getDimensions: (element) =>
    new Promise((resolve) =>
      element.measure((x: number, y: number, width: number, height: number) =>
        resolve({width, height}),
      ),
    ),
});
