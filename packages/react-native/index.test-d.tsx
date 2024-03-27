import * as React from 'react';
import {View} from 'react-native';

import {arrow, offset, shift, useFloating} from './src';

App;
function App() {
  const arrowRef = React.useRef(null);
  useFloating();
  const {update, refs, elements} = useFloating({
    placement: 'right',
    middleware: [offset(() => 5), shift(), arrow({element: arrowRef})],
    // @ts-expect-error - does not exist in React Native
    strategy: 'fixed',
  });
  refs.setReference(null);
  refs.setReference({
    getBoundingClientRect() {
      return {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
      };
    },
  });
  update();
  refs.setReference(null);
  refs.setFloating(null);
  refs.setOffsetParent(null);

  elements.reference.x;
  elements.floating.x;
  elements.offsetParent.x;

  return <View ref={arrowRef} />;
}
