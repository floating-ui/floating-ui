import {
  arrow,
  autoUpdate,
  FloatingArrow,
  offset,
  Placement,
  useFloating,
} from '@floating-ui/react';
import {useRef, useState} from 'react';

import type {FloatingArrowProps} from '../../../src/components/FloatingArrow';

const ROUND_D =
  'M0 20C0 20 2.06906 19.9829 5.91817 15.4092C7.49986 13.5236 8.97939 12.3809 10.0002 12.3809C11.0202 12.3809 12.481 13.6451 14.0814 15.5472C17.952 20.1437 20 20 20 20H0Z';

function Demo({
  placement,
  arrowProps,
  floatingStyle,
  floatingProps,
}: {
  placement: Placement;
  arrowProps: Partial<React.SVGAttributes<SVGSVGElement> & FloatingArrowProps>;
  floatingStyle?: React.CSSProperties;
  floatingProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const arrowRef = useRef<SVGSVGElement>(null);

  const {floatingStyles, refs, context} = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), arrow({element: arrowRef})],
  });

  const edgeAlignment = placement.split('-')[1];

  return (
    <div>
      <span
        ref={refs.setReference}
        style={{
          background: 'royalblue',
          padding: 5,
          color: 'white',
        }}
      >
        {placement}
      </span>
      {isOpen && (
        <div
          ref={refs.setFloating}
          className="bg-black text-white p-2 bg-clip-padding"
          {...floatingProps}
          style={{
            ...floatingStyles,
            ...floatingStyle,
          }}
        >
          Tooltip
          <FloatingArrow
            context={context}
            ref={arrowRef}
            staticOffset={edgeAlignment ? '15%' : null}
            {...arrowProps}
          />
        </div>
      )}
    </div>
  );
}

const allPlacements = ['top', 'bottom', 'right', 'left']
  .map(
    (placement) =>
      [placement, `${placement}-start`, `${placement}-end`] as Array<Placement>
  )
  .flat();

export const Main = () => {
  const borderWidth = 1;

  return (
    <>
      <h1 className="text-5xl font-bold">Arrow</h1>
      <h2 className="text-xl font-bold mb-6 my-8">Slight transparency</h2>
      <div className="grid grid-cols-3 place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        {allPlacements.map((placement) => (
          <Demo
            key={placement}
            placement={placement}
            arrowProps={{
              fill: 'rgba(0,0,0,0.75)',
            }}
            floatingProps={{
              className: 'bg-black/75 text-white p-2',
            }}
          />
        ))}
      </div>
      <h2 className="text-xl font-bold mb-6 mt-10">{'tipRadius={2}'}</h2>
      <div className="grid grid-cols-3 place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        {allPlacements.map((placement) => (
          <Demo
            key={placement}
            placement={placement}
            arrowProps={{tipRadius: 2}}
          />
        ))}
      </div>
      <h2 className="text-xl font-bold mb-6 mt-10">{'tipRadius={5}'}</h2>
      <div className="grid grid-cols-3 place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        {allPlacements.map((placement) => (
          <Demo
            key={placement}
            placement={placement}
            arrowProps={{tipRadius: 5}}
          />
        ))}
      </div>
      <h2 className="text-xl font-bold mb-6 mt-10">
        Transparent stroke + tipRadius
      </h2>
      <div className="grid grid-cols-3 place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        {allPlacements.map((placement) => (
          <Demo
            key={placement}
            placement={placement}
            arrowProps={{
              fill: 'white',
              stroke: 'rgba(0,0,0,0.4)',
              strokeWidth: borderWidth,
              tipRadius: 1,
            }}
            floatingStyle={{
              border: `${borderWidth}px solid rgba(0,0,0,0.4)`,
              color: 'black',
              backgroundColor: 'white',
            }}
          />
        ))}
      </div>
      <h2 className="text-xl font-bold mb-6 mt-10">
        Custom path + transparent stroke
      </h2>
      <div className="grid grid-cols-3 place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        {allPlacements.map((placement) => (
          <Demo
            key={placement}
            placement={placement}
            arrowProps={{
              width: 20,
              height: 20,
              fill: 'white',
              stroke: 'rgba(0,0,0,0.4)',
              strokeWidth: borderWidth,
              d: ROUND_D,
            }}
            floatingStyle={{
              border: `${borderWidth}px solid rgba(0,0,0,0.4)`,
              color: 'black',
              backgroundColor: 'white',
            }}
          />
        ))}
      </div>
      <h2 className="text-xl font-bold mb-6 mt-10">
        Tailwind classNames for fill and stroke
      </h2>
      <div className="grid grid-cols-3 place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        {allPlacements.map((placement) => (
          <Demo
            key={placement}
            placement={placement}
            arrowProps={{
              className:
                'fill-white [&>path:first-of-type]:stroke-pink-500 [&>path:last-of-type]:stroke-white',
              strokeWidth: 1,
            }}
            floatingProps={{
              className: 'border border-pink-500 text-pink-500 bg-white p-2',
            }}
          />
        ))}
      </div>
    </>
  );
};
