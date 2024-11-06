import type {Middleware} from '@floating-ui/core';
import {Platform, StatusBar} from 'react-native';

/**
 * Adjusts the y-coordinate for Android by adding the height
 * of the status bar when `sameScrollView` option is false.
 */
export const adjustYCoordOnAndroid = (sameScrollView: boolean): Middleware => {
  return {
    name: 'adjustYCoordOnAndroid',
    fn: ({x, y}) => {
      if (Platform.OS === 'android' && StatusBar.currentHeight && !sameScrollView) {
        return {
          x,
          y: y + StatusBar.currentHeight,
        };
      } else {
        return {x, y};
      }
    },
  };
};
