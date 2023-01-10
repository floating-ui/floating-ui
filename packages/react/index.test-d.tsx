import {useRef} from 'react';

import {
  arrow,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from '.';

App;
function App() {
  const arrowRef = useRef(null);
  useFloating();
  const {reference, floating, positionReference, update} = useFloating({
    placement: 'right',
    middleware: [
      shift(),
      arrow({element: arrowRef}),
      false && shift(),
      null,
      undefined,
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
  positionReference({
    contextElement: document.body,
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
  positionReference(document.body);

  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref = useMergeRefs([ref1, ref2, arrowRef, null]);

  return <div ref={ref} />;
}

NarrowRefType;
function NarrowRefType() {
  const floating1 = useFloating();
  const floating2 = useFloating<HTMLButtonElement>();
  const floating3 = useFloating<HTMLAnchorElement>();
  useInteractions([
    useClick(floating2.context),
    useDismiss(floating2.context),
    useFocus(floating2.context),
    useHover(floating2.context, {
      handleClose: safePolygon(),
    }),
    useListNavigation(floating2.context),
    useRole(floating2.context),
    useTypeahead(floating2.context),
  ]);

  // @ts-expect-error
  floating1.refs.reference.current?.contains(document.body);
  // @ts-expect-error
  floating2.refs.reference.current?.contains(document.body);
  // @ts-expect-error
  floating3.refs.reference.current?.contains(document.body);

  // @ts-expect-error
  floating1.elements.reference?.contains(document.body);
  // @ts-expect-error
  floating2.elements.reference?.contains(document.body);
  // @ts-expect-error
  floating3.elements.reference?.contains(document.body);

  floating1.refs.domReference.current?.contains(document.body);
  floating2.refs.domReference.current?.focus();
  floating3.refs.domReference.current?.focus();

  // @ts-expect-error
  floating1.elements.domReference?.focus();
  floating2.elements.domReference?.focus();
  floating3.elements.domReference?.focus();

  floating2.refs.setPositionReference({
    getBoundingClientRect() {
      return {
        x: 0,
        y: 0,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
      };
    },
  });

  return (
    <>
      <button ref={floating1.reference} />
      <button ref={floating2.reference} />
      {/* @ts-expect-error */}
      <button ref={floating3.reference} />
      <button ref={floating1.refs.setReference} />
      <button ref={floating1.refs.setFloating} />
      <button ref={floating1.refs.setPositionReference} />
    </>
  );
}
