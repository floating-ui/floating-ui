import {useRef} from 'react';
import {useFloating, shift, arrow} from '.';

App;
function App() {
  const arrowRef = useRef(null);
  useFloating();
  const {reference, floating, update} = useFloating({
    placement: 'right',
    middleware: [shift(), arrow({element: arrowRef})],
    strategy: 'fixed',
  });
  reference(null);
  reference({
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
  reference(null);
  floating(null);
  update();
  return <div ref={arrowRef} />;
}
