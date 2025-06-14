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
      {allPlacements.map((localPlacement) => (
        <button
          key={stringifyPlacement(localPlacement)}
          data-testid={`placement-${stringifyPlacement(localPlacement)}`}
          onClick={() => setPlacement(localPlacement)}
          style={{
            backgroundColor: localPlacement === placement ? 'black' : '',
          }}
        >
          {stringifyPlacement(localPlacement)}
        </button>
      ))}
    </Controls>
  );
}
