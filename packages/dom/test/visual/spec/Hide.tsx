import type {Placement} from '@floating-ui/core';
import {useFloating, hide} from '@floating-ui/react-dom';
import {allPlacements} from '../utils/allPlacements';
import {useLayoutEffect, useState} from 'react';
import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';

export function Hide() {
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [hierarchy, setHierarchy] = useState('a');

  const {
    x,
    y,
    reference,
    floating,
    strategy,
    update,
    refs,
    middlewareData: {hide: {referenceHidden, escaped} = {}},
  } = useFloating({
    placement,
    middleware: [
      hide({strategy: 'referenceHidden'}),
      hide({strategy: 'escaped'}),
    ],
  });

  const {scrollRef, indicator} = useScroll({refs, update});

  useLayoutEffect(update, [update, hierarchy]);

  let jsx = null;
  if (hierarchy === 'a') {
    jsx = (
      <div ref={reference} className="reference">
        Reference
      </div>
    );
  } else if (hierarchy === 'b') {
    jsx = (
      <div style={{overflow: 'hidden', height: 0}}>
        <div style={{position: 'absolute', top: 0, left: 0}}>
          <div ref={reference} className="reference">
            Reference
          </div>
        </div>
      </div>
    );
  } else if (hierarchy === 'c') {
    jsx = (
      <div style={{overflow: 'scroll', height: 0}}>
        <div style={{overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: 0, left: 0}}>
            <div ref={reference} className="reference">
              Reference
            </div>
          </div>
        </div>
      </div>
    );
  } else if (hierarchy === 'd') {
    jsx = (
      <div style={{overflow: 'hidden', height: 0}}>
        <div
          ref={reference}
          className="reference"
          style={{position: 'absolute', top: 0, left: 0}}
        >
          Reference
        </div>
      </div>
    );
  } else if (hierarchy === 'e') {
    jsx = (
      <div style={{overflow: 'scroll', height: 0, position: 'relative'}}>
        <div style={{overflow: 'hidden'}}>
          <div style={{position: 'absolute'}}>
            <div ref={reference} className="reference">
              Reference
            </div>
          </div>
        </div>
      </div>
    );
  } else if (hierarchy === 'f') {
    jsx = (
      <div
        style={{
          overflow: 'scroll',
          height: 20,
          width: 20,
          position: 'relative',
        }}
      >
        <div style={{overflow: 'hidden'}}>
          <div style={{position: 'absolute'}}>
            <div ref={reference} className="reference">
              Reference
            </div>
          </div>
        </div>
      </div>
    );
  } else if (hierarchy === 'g') {
    jsx = (
      <div style={{overflow: 'scroll', height: 0}}>
        <div style={{overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: 0, left: 0}}>
            <div style={{position: 'absolute'}}>
              <div ref={reference} className="reference">
                Reference
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (hierarchy === 'h') {
    jsx = (
      <div style={{overflow: 'scroll', height: 0}}>
        <div style={{overflow: 'hidden'}}>
          <div
            style={{position: 'absolute', top: 0, left: 0, overflow: 'hidden'}}
          >
            <div style={{position: 'absolute'}}>
              <div ref={reference} className="reference">
                Reference
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (hierarchy === 'i') {
    jsx = (
      <div style={{position: 'relative'}}>
        <div style={{overflow: 'hidden'}}>
          <div
            style={{
              position: 'absolute',
              overflow: 'hidden',
              height: 200,
              width: 200,
              border: '1px solid blue',
            }}
          >
            <div style={{position: 'absolute', left: 20, top: 20}}>
              <div ref={reference} className="reference">
                Reference
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1>Hide</h1>
      <p></p>
      <div className="container" style={{position: 'relative'}}>
        <div className="scroll" ref={scrollRef} data-x>
          {indicator}
          {jsx}
          <div
            ref={floating}
            className="floating"
            style={{
              position: strategy,
              top: y ?? '',
              left: x ?? '',
              backgroundColor: referenceHidden
                ? 'black'
                : escaped
                ? 'yellow'
                : '',
            }}
          >
            Floating
          </div>
        </div>
      </div>

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

      <h2>Hierarchy</h2>
      <Controls>
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].map((localHierarchy) => (
          <button
            key={localHierarchy}
            data-testid={`hierarchy-${localHierarchy}`}
            onClick={() => setHierarchy(localHierarchy)}
            style={{
              backgroundColor: localHierarchy === hierarchy ? 'black' : '',
            }}
          >
            {localHierarchy}
          </button>
        ))}
      </Controls>
    </>
  );
}
