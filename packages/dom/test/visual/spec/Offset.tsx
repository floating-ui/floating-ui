import type {OffsetOptions, Placement} from '@floating-ui/core';
import {autoUpdate, offset, useFloating} from '@floating-ui/react-dom';
import {useState} from 'react';

import {Controls} from '../utils/Controls';
import {AllPlacementsControls} from '../utils/AllPlacementsControls';

const VALUES: Array<{
  offset: OffsetOptions;
  name: string;
}> = [
  {offset: 0, name: '0'},
  {offset: 10, name: '10'},
  {offset: -10, name: '-10'},
  {offset: {crossAxis: 10}, name: 'cA: 10'},
  {offset: {mainAxis: 5, crossAxis: -10}, name: 'mA: 5, cA: -10'},
  {offset: ({rects}) => -rects.floating.height, name: '() => -f.height'},
  {
    offset: ({rects}) => ({crossAxis: -rects.floating.width / 2}),
    name: '() => cA: -f.width/2',
  },
  {offset: {alignAxis: 5}, name: 'aA: 5'},
  {offset: {alignAxis: -10}, name: 'aA: -10'},
];

export function Offset() {
  const [rtl, setRtl] = useState(false);
  const [placement, setPlacement] = useState<Placement>({
    side: 'bottom',
    align: 'center',
  });
  const [offsetValue, setOffsetValue] = useState<OffsetOptions>(0);
  const {refs, floatingStyles} = useFloating({
    side: placement.side,
    align: placement.align,
    whileElementsMounted: autoUpdate,
    middleware: [
      {
        ...offset(offsetValue),
        options: [offsetValue, rtl, placement],
      },
    ],
  });

  return (
    <>
      <h1>Offset</h1>
      <p></p>
      <div className="container" style={{direction: rtl ? 'rtl' : 'ltr'}}>
        <div ref={refs.setReference} className="reference">
          Reference
        </div>
        <div ref={refs.setFloating} className="floating" style={floatingStyles}>
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
      <AllPlacementsControls
        placement={placement}
        setPlacement={setPlacement}
      />

      <h2>RTL</h2>
      <Controls>
        {[true, false].map((bool) => (
          <button
            key={String(bool)}
            data-testid={`rtl-${bool}`}
            onClick={() => setRtl(bool)}
            style={{
              backgroundColor: rtl === bool ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>
    </>
  );
}
