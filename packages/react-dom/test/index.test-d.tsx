import * as React from 'react';

import {arrow, offset, platform, shift, useFloating} from '../src';

App;
function App() {
  const arrowRef = React.useRef(null);
  useFloating();
  const {refs, floatingStyles, update} = useFloating({
    open: true,
    transform: false,
    placement: 'right',
    middleware: [
      offset(() => ({mainAxis: 0})),
      shift(),
      arrow({element: arrowRef}),
      {
        name: 'test',
        async fn({elements}) {
          // @ts-expect-error - should not be allowed with strong typing
          elements.floating.style = '';
          return {};
        },
      },
      false,
      null,
      undefined,
    ],
    strategy: 'fixed',
    platform: {
      ...platform,
    },
    elements: {
      floating: null,
      reference: null,
    },
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
  refs.setFloating(null);
  update();
  return <div ref={arrowRef} style={floatingStyles} />;
}

Setters;
function Setters() {
  const {refs} = useFloating({
    elements: {
      floating: document.body,
      reference: document.body,
    },
  });

  return (
    <>
      <div ref={refs.setReference} />
      <div ref={refs.setFloating} />
    </>
  );
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
      <button ref={floating1.refs.setReference} />
      <button ref={floating2.refs.setFloating} />
      {/* @ts-expect-error */}
      <button ref={floating3.reference} />
    </>
  );
}
