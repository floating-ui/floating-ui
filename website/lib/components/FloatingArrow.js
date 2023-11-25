import {
  arrow,
  autoUpdate,
  FloatingArrow,
  offset,
  useFloating,
  useMergeRefs,
} from '@floating-ui/react';
import {cloneElement, forwardRef, useRef} from 'react';

const Example = forwardRef(function Example(
  {children, placement},
  ref,
) {
  const arrowRef = useRef(null);

  const {x, y, strategy, refs, context, isPositioned} =
    useFloating({
      placement,
      middleware: [offset(7), arrow({element: arrowRef})],
      whileElementsMounted: autoUpdate,
    });

  const referenceRef = useMergeRefs([ref, refs.setReference]);

  return (
    <>
      {cloneElement(children, {ref: referenceRef})}
      <div
        ref={refs.setFloating}
        className="bg-gray-800 text-gray-50 rounded p-2 border-blue-500"
        style={{
          position: strategy,
          left: x ?? 0,
          top: y ?? 0,
          visibility: isPositioned ? 'visible' : 'hidden',
        }}
      >
        Floating
        <FloatingArrow
          ref={arrowRef}
          context={context}
          className="fill-gray-800"
        />
      </div>
    </>
  );
});

export function Demo() {
  return (
    <Example>
      <Example placement="top">
        <Example placement="right">
          <Example placement="left">
            <div className="grid place-items-center w-32 h-32 mx-auto border-2 border-gray-1000 border-dashed" />
          </Example>
        </Example>
      </Example>
    </Example>
  );
}
