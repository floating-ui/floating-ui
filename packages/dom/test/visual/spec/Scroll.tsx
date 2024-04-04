import type {Strategy} from '@floating-ui/core';
import {useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';

import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';

type Node =
  | 'referenceScrollParent'
  | 'floatingScrollParent'
  | 'sameScrollParent'
  | 'body';
const NODES: Node[] = [
  'referenceScrollParent',
  'floatingScrollParent',
  'sameScrollParent',
  'body',
];
const STRATEGIES: Strategy[] = ['absolute', 'fixed'];

export function Scroll() {
  const [strategyState, setStrategyState] = useState<Strategy>('absolute');
  const [node, setNode] = useState<Node>('referenceScrollParent');
  const {x, y, refs, update} = useFloating({
    strategy: strategyState,
  });
  const {scrollRef, indicator} = useScroll({refs, update});

  useLayoutEffect(update, [update, node]);

  const referenceJsx = (
    <div
      ref={refs.setReference}
      className="reference"
      style={
        node === 'floatingScrollParent'
          ? {
              position: 'relative',
              top: -350,
            }
          : {}
      }
    >
      Reference
    </div>
  );
  const floatingJsx = (
    <div
      ref={refs.setFloating}
      className="floating"
      style={{
        position: strategyState,
        top: y ?? '',
        left: x ?? '',
      }}
    >
      Floating
    </div>
  );

  return (
    <>
      <h1>Scroll</h1>
      <p>
        The floating element should be positioned correctly when a certain node
        has been scrolled.
      </p>
      <div className="container">
        {[
          'referenceScrollParent',
          'floatingScrollParent',
          'sameScrollParent',
        ].includes(node) ? (
          <>
            <div
              className="scroll"
              ref={scrollRef}
              style={{
                position: ['sameScrollParent', 'floatingScrollParent'].includes(
                  node,
                )
                  ? 'relative'
                  : undefined,
              }}
            >
              {indicator}
              {node !== 'floatingScrollParent' ? referenceJsx : null}
              {floatingJsx}
            </div>
            {node === 'floatingScrollParent' ? referenceJsx : null}
          </>
        ) : (
          <>
            {referenceJsx}
            {floatingJsx}
          </>
        )}
      </div>

      <h3>Strategy</h3>
      <Controls>
        {STRATEGIES.map((strategy) => (
          <button
            key={strategy}
            data-testid={`strategy-${strategy}`}
            onClick={() => setStrategyState(strategy)}
            style={{
              backgroundColor: strategy === strategyState ? 'black' : '',
            }}
          >
            {strategy}
          </button>
        ))}
      </Controls>

      <h3>Node</h3>
      <Controls>
        {NODES.map((localNode) => (
          <button
            key={localNode}
            data-testid={`scroll-${localNode}`}
            style={{
              backgroundColor: localNode === node ? 'black' : '',
            }}
            onClick={() => setNode(localNode)}
          >
            {localNode}
          </button>
        ))}
      </Controls>
      {node === 'body' && <div style={{width: 1, height: 1500}} />}
    </>
  );
}
