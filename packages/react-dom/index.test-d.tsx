import {useRef} from 'react';
import {useFloating, shift, arrow} from '.';

App;
function App() {
  const arrowRef = useRef(null);
  useFloating();
  const {reference, floating, update} = useFloating({
    placement: 'right',
    middleware: [
      shift(),
      arrow({element: arrowRef}),
      {
        name: 'test',
        async fn({elements}) {
          // @ts-expect-error
          elements.floating.style = '';
          return {};
        },
      },
    ],
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

NarrowRefType;
function NarrowRefType() {
  const floating1 = useFloating();
  const floating2 = useFloating<HTMLButtonElement>();
  const floating3 = useFloating<HTMLAnchorElement>();

  // @ts-expect-error
  floating1.refs.reference.current?.contains(document.body);
  floating2.refs.reference.current?.contains(document.body);
  floating3.refs.reference.current?.contains(document.body);
  return (
    <>
      <button ref={floating1.reference} />
      <button ref={floating2.reference} />
      {/* @ts-expect-error */}
      <button ref={floating3.reference} />
    </>
  );
}
