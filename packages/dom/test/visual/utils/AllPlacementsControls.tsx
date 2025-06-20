import type {Placement} from '../../../src';
import {allPlacements} from './allPlacements';
import {Controls} from './Controls';
import {stringifyPlacement} from './stringifyPlacement';

export function AllPlacementsControls({
  placement,
  setPlacement,
}: {
  placement: Placement;
  setPlacement: (placement: Placement) => void;
}) {
  return (
    <Controls>
      {allPlacements.map((p) => (
        <button
          key={stringifyPlacement(p)}
          data-testid={`placement-${stringifyPlacement(p)}`}
          onClick={() => setPlacement(p)}
          style={{
            backgroundColor:
              p.side === placement.side && p.align === placement.align
                ? 'black'
                : '',
          }}
        >
          {stringifyPlacement(p)}
        </button>
      ))}
    </Controls>
  );
}
