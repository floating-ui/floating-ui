import {useLayoutEffect, useState} from 'react';
import {Controls} from './Controls';

type Props = {
  children?: React.ReactNode;
  update: () => void;
};

const positions: string[] = [
  'top-left',
  'top',
  'top-right',
  'left',
  'center',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right'
];

const getStyleForPosition = (position: string) => {
  switch(position){
    case 'top-left':
      return {};
    case 'top':
      return { justifyItems: 'center' };
    case 'top-right':
      return { justifyItems: 'end' };
    case 'left':
      return { alignItems: 'center' };
    case 'center':
      return { placeItems: 'center' };
    case 'right':
      return { alignItems: 'center', justifyItems: 'end' };
    case 'bottom-left':
      return { alignItems: 'end' };
    case 'bottom':
      return { alignItems: 'end', justifyItems: 'center' };
    case 'bottom-right':
      return { alignItems: 'end', justifyItems: 'end' };
  }
};

export function Container({children, update}: Props) {
  const [position, setPosition] = useState<string>('center');
  useLayoutEffect(update, [update, position]);

  return (
    <>
      <div className='container' style={{
        position: 'relative',
        overflow: 'scroll',
        ...getStyleForPosition(position)
      }}>
        {children}
      </div>
      <h3>Reference position</h3>
      <Controls>
        {positions.map((localPosition) => (
          <button
            key={localPosition}
            data-testid={`position-${localPosition}`}
            onClick={() => setPosition(localPosition)}
            style={{
              backgroundColor: localPosition === position ? 'black' : '',
            }}
          >
            {localPosition}
          </button>
        ))}
      </Controls>
    </>
  );
}
