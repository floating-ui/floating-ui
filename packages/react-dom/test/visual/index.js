import {useEffect, useRef, useState} from 'react';
import {render} from 'react-dom';
import {useFloating, offset, flip, getScrollParents} from '../../src';

function App() {
  const [middleware, setMiddleware] = useState();
  const arrowRef = useRef();
  const {
    x,
    y,
    reference,
    floating,
    update,
    middlewareData: {arrow: {x: arrowX, y: arrowY} = {}},
  } = useFloating({
    placement: 'right',
    middleware,
  });

  useEffect(() => {
    if (!reference.current || !floating.current) {
      return;
    }

    const nodes = [
      ...getScrollParents(reference.current),
      ...getScrollParents(floating.current),
    ];

    nodes.forEach((node) => {
      node.addEventListener('scroll', update);
      node.addEventListener('resize', update);
    });

    return () => {
      nodes.forEach((node) => {
        node.removeEventListener('scroll', update);
        node.removeEventListener('resize', update);
      });
    };
  }, [floating, reference, update]);

  return (
    <>
      <div id="reference" ref={reference}>
        Reference
      </div>
      <div
        id="floating"
        ref={floating}
        style={{
          position: 'absolute',
          left: x ?? '',
          top: y ?? '',
        }}
      >
        Floating
        <div
          id="arrow"
          ref={arrowRef}
          style={{
            position: 'absolute',
            left: arrowX ?? '',
            top: arrowY ?? '',
          }}
        ></div>
      </div>
      <button onClick={() => setMiddleware([])}>[]</button>
      <button onClick={() => setMiddleware([offset(10)])}>offset(10)</button>
      <button onClick={() => setMiddleware([offset()])}>offset()</button>
      <button onClick={() => setMiddleware([flip()])}>flip()</button>
    </>
  );
}

render(<App />, document.getElementById('root'));
