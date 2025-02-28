import * as React from 'react';

import {
  arrow,
  FloatingArrow,
  platform,
  safePolygon,
  shift,
  useClick,
  useClientPoint,
  useDismiss,
  useFloating,
  useFloatingRootContext,
  useFocus,
  useHover,
  useInnerOffset,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from '../src';

App;
function App() {
  const arrowRef = React.useRef(null);
  useFloating();
  const {refs, floatingStyles, update, context} = useFloating({
    placement: 'right',
    middleware: [shift(), arrow({element: arrowRef}), false, null, undefined],
    strategy: 'fixed',
    platform: {
      ...platform,
    },
    open: true,
    transform: false,
    elements: {
      floating: null,
      reference: null,
    },
  });
  useFloating({
    elements: {
      floating: document.body,
      reference: document.body,
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
  refs.setPositionReference({
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

  const ref1 = React.useRef<HTMLDivElement>(null);
  const ref2 = React.useRef<HTMLDivElement>(null);
  const ref = useMergeRefs([ref1, ref2, arrowRef, null]);

  const {context: contextGeneric} = useFloating<HTMLDivElement>();

  return (
    <div ref={ref} style={floatingStyles}>
      <FloatingArrow context={context} />
      <FloatingArrow context={contextGeneric} />
      <FloatingArrow
        ref={arrowRef}
        context={context}
        stroke="black"
        strokeWidth={2}
        fill="black"
        width={14}
        height={14}
        tipRadius={50}
      />
    </div>
  );
}

NarrowRefType;
function NarrowRefType() {
  const floating1 = useFloating();
  const floating2 = useFloating<HTMLButtonElement>();
  const floating3 = useFloating<HTMLAnchorElement>({
    elements: {
      reference: {
        contextElement: null,
        // @ts-expect-error
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
      },
    },
  });
  useInteractions([
    useClick(floating2.context),
    useDismiss(floating2.context),
    useFocus(floating2.context),
    useHover(floating2.context, {
      handleClose: safePolygon(),
    }),
    useListNavigation(floating2.context, {
      listRef: {current: []},
      activeIndex: null,
    }),
    useRole(floating2.context),
    useTypeahead(floating2.context, {
      listRef: {current: []},
      activeIndex: null,
    }),
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
      {/* @ts-expect-error */}
      <button ref={floating3.reference} />
      <button ref={floating1.refs.setReference} />
      <button ref={floating1.refs.setFloating} />
      <button ref={floating1.refs.setPositionReference} />
    </>
  );
}

function Root() {
  const context = useFloatingRootContext({
    elements: {
      floating: null,
      reference: null,
    },
  });

  useClick(context);
  useDismiss(context);
  useFocus(context);
  useHover(context);
  useListNavigation(context, {
    listRef: {current: []},
    activeIndex: null,
  });
  useRole(context);
  useTypeahead(context, {
    listRef: {current: []},
    activeIndex: null,
  });
  useClientPoint(context);
  useInnerOffset(context, {
    onChange: () => {},
    overflowRef: {current: null},
  });
}

Root;
