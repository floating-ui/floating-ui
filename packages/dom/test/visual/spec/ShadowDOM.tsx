import type {Placement, Strategy} from '@floating-ui/core';
import {useState} from 'react';

import {allPlacements} from '../utils/allPlacements';
import {Controls} from '../utils/Controls';
import {defineElements} from '../utils/shadowDOM';

type UseCase =
  | 'direct-host-child'
  | 'deep-host-child'
  | 'relative-host-with-shadowed-floating-child';
const USE_CASES: UseCase[] = [
  'direct-host-child',
  'deep-host-child',
  'relative-host-with-shadowed-floating-child',
];

const STRATEGIES: Strategy[] = ['absolute', 'fixed'];

type CSSPosition = 'static' | 'relative' | 'absolute';
const CSS_POSITIONS: CSSPosition[] = ['static', 'relative', 'absolute'];

defineElements();

export function ShadowDOM() {
  const [useCase, setUseCase] = useState<UseCase>('direct-host-child');
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [cssPosition, setCssPosition] = useState<CSSPosition>('static');
  const [strategy, setStrategy] = useState<Strategy>('absolute');
  const [withTransform, setWithTransform] = useState<boolean>(false);
  const [polyfill, setPolyfill] = useState('false');

  const UseCaseTag = useCase;
  const hostOptions = {
    placement,
    strategy,
    polyfill,
    style: {
      position: cssPosition,
      transform: withTransform ? 'translate(0)' : 'none',
    },
  };

  return (
    <>
      <h1>Shadow DOM</h1>
      <p>
        The floating element should be positioned correctly when contained
        within shadow DOM.
      </p>
      <div className="container">
        {UseCaseTag === 'relative-host-with-shadowed-floating-child' ? (
          <relative-position-host>
            <div id="reference" className="reference">
              Reference
            </div>
            <shadowed-floating-owner {...hostOptions} />
          </relative-position-host>
        ) : (
          <UseCaseTag {...hostOptions} />
        )}
      </div>

      <h3>Shadow DOM structure</h3>
      <Controls>
        {USE_CASES.map((localUseCase) => (
          <button
            key={localUseCase}
            data-testid={`use-case-${localUseCase}`}
            onClick={() => setUseCase(localUseCase)}
            style={{
              backgroundColor: localUseCase === useCase ? 'black' : '',
            }}
          >
            {localUseCase}
          </button>
        ))}
      </Controls>

      <h3>Host position</h3>
      <Controls>
        {CSS_POSITIONS.map((localPosition) => (
          <button
            key={String(localPosition)}
            data-testid={`css-position-${localPosition}`}
            onClick={() => setCssPosition(localPosition)}
            style={{
              backgroundColor: localPosition === cssPosition ? 'black' : '',
            }}
          >
            {String(localPosition)}
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
              backgroundColor:
                localWithTransform === withTransform ? 'black' : '',
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

      <h3>Polyfill</h3>
      <Controls>
        {['true', 'false'].map((strBool) => (
          <button
            key={strBool}
            data-testid={`polyfill-${strBool}`}
            onClick={() => setPolyfill(strBool)}
            style={{
              backgroundColor: strBool === polyfill ? 'black' : '',
            }}
          >
            {strBool}
          </button>
        ))}
      </Controls>
    </>
  );
}
