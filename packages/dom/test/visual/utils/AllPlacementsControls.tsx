import type {Placement} from '@floating-ui/core';
import {allPlacements} from './allPlacements';
import {Controls} from './Controls';
import {stringifyPlacement} from './stringifyPlacement';

const logicalPlacements: Placement[] = [
  {side: 'inline-start', align: 'start'},
  {side: 'inline-start', align: 'center'},
  {side: 'inline-start', align: 'end'},
  {side: 'inline-end', align: 'start'},
  {side: 'inline-end', align: 'center'},
  {side: 'inline-end', align: 'end'},
];

export function AllPlacementsControls({
  placement,
  setPlacement,
  includeLogical = false,
}: {
  placement: Placement;
  setPlacement: (placement: Placement) => void;
  /** Whether to render logical inline placements in addition to physical ones. */
  includeLogical?: boolean;
}) {
  const placementsToRender = includeLogical
    ? [...allPlacements, ...logicalPlacements]
    : allPlacements;
  return (
    <Controls>
      {placementsToRender.map((p) => (
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
