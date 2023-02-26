import {
  arrow,
  autoUpdate,
  FloatingArrow,
  offset,
  Placement,
  useFloating,
} from '@floating-ui/react';
import {useRef, useState} from 'react';

import type {Props} from '../../../src/components/FloatingArrow';

const ROUND_D =
  'M0 20C0 20 2.06906 19.9829 5.91817 15.4092C7.49986 13.5236 8.97939 12.3809 10.0002 12.3809C11.0202 12.3809 12.481 13.6451 14.0814 15.5472C17.952 20.1437 20 20 20 20H0Z';

function Demo({
  placement,
  arrowProps,
  floatingStyle,
}: {
  placement: Placement;
  arrowProps: Partial<React.SVGAttributes<SVGSVGElement> & Props>;
  floatingStyle?: React.CSSProperties;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const arrowRef = useRef<SVGSVGElement>(null);

  const {x, y, strategy, refs, context} = useFloating({
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
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            background: 'black',
            color: 'white',
            padding: 10,
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
  return (
    <>
      <h1>Arrow</h1>
      <p></p>
      <div className="container" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
        {allPlacements.map((placement) => (
          <Demo key={placement} placement={placement} arrowProps={{}} />
        ))}
      </div>
      <div className="container" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
        {allPlacements.map((placement) => (
          <Demo
            key={placement}
            placement={placement}
            arrowProps={{roundness: 50}}
          />
        ))}
      </div>
      <div className="container" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
        {allPlacements.map((placement) => (
          <Demo
            key={placement}
            placement={placement}
            arrowProps={{roundness: 100}}
          />
        ))}
      </div>
      <div className="container" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
        {allPlacements.map((placement) => (
          <Demo
            key={placement}
            placement={placement}
            arrowProps={{
              fill: 'white',
              stroke: 'black',
              strokeWidth: 2,
              roundness: 25,
            }}
            floatingStyle={{
              border: '1px solid black',
              color: 'black',
              background: 'white',
            }}
          />
        ))}
      </div>
      <div className="container" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
        {allPlacements.map((placement) => (
          <Demo
            key={placement}
            placement={placement}
            arrowProps={{
              width: 20,
              height: 20,
              fill: 'white',
              stroke: 'black',
              strokeWidth: 4,
              d: ROUND_D,
            }}
            floatingStyle={{
              border: '2px solid black',
              color: 'black',
              background: 'white',
            }}
          />
        ))}
      </div>
    </>
  );
};
