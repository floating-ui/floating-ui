import type {Placement} from '@floating-ui/core';
import type {Offset as OffsetType} from '@floating-ui/core/src/middleware/offset';
import {useFloating, offset} from '@floating-ui/react-dom';
import {allPlacements} from '../utils/allPlacements';
import {useLayoutEffect, useState} from 'react';
import {Controls} from '../utils/Controls';

const VALUES: Array<{offset: OffsetType; name: string}> = [
  {offset: 0, name: '0'},
  {offset: 10, name: '10'},
  {offset: -10, name: '-10'},
  {offset: {crossAxis: 10}, name: 'cA: 10'},
  {offset: {mainAxis: 5, crossAxis: -10}, name: 'mA: 5, cA: -10'},
  {offset: ({floating}) => -floating.height, name: '() => -f.height'},
  {
    offset: ({floating}) => ({crossAxis: -floating.width / 2}),
    name: '() => cA: -f.width/2',
  },
];

export function Offset() {
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [offsetValue, setOffsetValue] = useState<OffsetType>(0);
  const {x, y, reference, floating, strategy, update} = useFloating({
    placement,
    middleware: [offset(offsetValue)],
  });

  useLayoutEffect(update, [offsetValue, update]);

  return (
    <>
      <h1>Offset</h1>
      <p></p>
      <div className="container">
        <div ref={reference} className="reference">
          Reference
        </div>
        <div
          ref={floating}
          className="floating"
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
          }}
        >
          Floating
        </div>
      </div>

      <h2>Offset</h2>
      <Controls>
        {VALUES.map(({offset, name}) => {
          return (
            <button
              key={name}
              onClick={() => setOffsetValue(() => offset)}
              data-testid={`offset-${name}`}
              style={{
                backgroundColor: offset === offsetValue ? 'black' : '',
              }}
            >
              {name}
            </button>
          );
        })}
      </Controls>

      <h2>Placement</h2>
      <Controls>
        {allPlacements.map((localPlacement) => (
          <button
            key={localPlacement}
            data-testid={`placement-${localPlacement}`}
            onClick={() => setPlacement(localPlacement)}
            style={{
              backgroundColor: localPlacement === placement ? 'black' : '',
            }}
          >
            {localPlacement}
          </button>
        ))}
      </Controls>
    </>
  );
}
