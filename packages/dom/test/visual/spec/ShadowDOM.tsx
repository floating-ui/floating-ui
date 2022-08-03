import type { Placement, Strategy } from '@floating-ui/core';

import { useState } from 'react';
import { Controls } from '../utils/Controls';
import { defineElements } from '../utils/shadowDOM';
import { allPlacements } from '../utils/allPlacements';

type UseCase = 'direct-host-child' | 'deep-host-child';
const USE_CASES: UseCase[] = ['direct-host-child', 'deep-host-child'];

const STRATEGIES: Strategy[] = ['absolute', 'fixed'];

defineElements();

export function ShadowDOM() {
  const [useCase, setUseCase] = useState<UseCase>('direct-host-child');
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [strategy, setStrategy] = useState<Strategy>('absolute');
  const [withTransform, setWithTransform] = useState<boolean>(false);
  const UseCaseTag = useCase;

  return (
    <>
      <h1>Shadow DOM</h1>
      <p>
        The floating element should be positioned correctly when contained within shadow DOM.
      </p>
      <div className='container'>
        <UseCaseTag style={{
          position: strategy,
          transform: withTransform ? "translate(0)" : "none"
        }}
          placement={placement} strategy={strategy}/>
      </div>

      <h3>Shadow DOM structure</h3>
      <Controls>
        {USE_CASES.map((localUseCase) => (
          <button
            key={localUseCase}
            data-testid={`use-case-${localUseCase}`}
            onClick={() =>
              setUseCase(localUseCase)
            }
            style={{
              backgroundColor:
                localUseCase === useCase ? 'black' : '',
            }}
          >
            {localUseCase}
          </button>
        ))}
      </Controls>

      <h3>With transform</h3>
      <Controls>
        {[false, true].map((localWithTransform) => (
          <button
            key={String(localWithTransform)}
            data-testid={`with-transform-${localWithTransform}`}
            onClick={() => setWithTransform(localWithTransform)}
            style={{
              backgroundColor: localWithTransform === withTransform ? 'black' : '',
            }}
          >
            {String(localWithTransform)}
          </button>
        ))}
      </Controls>

      <h3>Placement</h3>
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

      <h3>Strategy</h3>
      <Controls>
        {STRATEGIES.map((localStrategy) => (
          <button
            key={localStrategy}
            data-testid={`strategy-${localStrategy}`}
            onClick={() => setStrategy(localStrategy)}
            style={{
              backgroundColor: localStrategy === strategy ? 'black' : '',
            }}
          >
            {localStrategy}
          </button>
        ))}
      </Controls>
    </>
  );
}
