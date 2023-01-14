import type {Placement} from '@floating-ui/core';
import {hide, size, useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';

import {allPlacements} from '../utils/allPlacements';
import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';

export function Hide() {
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [hierarchy, setHierarchy] = useState('a');
  const isSizeHierarchy = ['j', 'k', 'l', 'm'].includes(hierarchy);

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
    strategy: isSizeHierarchy ? 'fixed' : 'absolute',
    placement,
    middleware: [
      hide({strategy: 'referenceHidden'}),
      hide({strategy: 'escaped'}),
      size({
        apply: isSizeHierarchy
          ? ({elements, availableHeight}) => {
              Object.assign(elements.floating.style, {
                maxHeight: `${availableHeight}px`,
              });
            }
          : ({elements}) =>
              Object.assign(elements.floating.style, {
                maxHeight: '',
              }),
      }),
    ],
  });

  const {scrollRef, indicator} = useScroll({refs, update});

  useLayoutEffect(update, [update, hierarchy]);

  let referenceJsx = (
    <div ref={reference} className="reference">
      Reference
    </div>
  );
  let floatingJsx = (
    <div
      ref={floating}
      className="floating"
      style={{
        position: strategy,
        top: y ?? '',
        left: x ?? '',
        backgroundColor: referenceHidden ? 'black' : escaped ? 'yellow' : '',
      }}
    >
      Floating
    </div>
  );

  if (hierarchy === 'b') {
    referenceJsx = (
      <div style={{overflow: 'hidden', height: 0}}>
        <div style={{position: 'absolute', top: 0, left: 0}}>
          <div ref={reference} className="reference">
            Reference
          </div>
        </div>
      </div>
    );
  } else if (hierarchy === 'c') {
    referenceJsx = (
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
    referenceJsx = (
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
    referenceJsx = (
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
    referenceJsx = (
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
    referenceJsx = (
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
    referenceJsx = (
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
    referenceJsx = (
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
  } else if (hierarchy === 'j') {
    floatingJsx = (
      <div
        style={{
          overflow: 'hidden',
          position: 'relative',
          width: 80,
          height: 40,
        }}
      >
        <div
          ref={floating}
          className="floating"
          style={{position: strategy, top: y ?? 0, left: x ?? 0}}
        >
          Floating
        </div>
      </div>
    );
  } else if (hierarchy === 'k') {
    floatingJsx = (
      <div
        style={{
          overflow: 'hidden',
          position: 'relative',
          width: 80,
          height: 40,
          transform: 'translateZ(0)',
        }}
      >
        <div
          ref={floating}
          className="floating"
          style={{position: strategy, top: y ?? 0, left: x ?? 0}}
        >
          Floating
        </div>
      </div>
    );
  } else if (hierarchy === 'l') {
    floatingJsx = (
      <div
        style={{
          overflow: 'hidden',
          position: 'relative',
          width: 80,
          height: 40,
        }}
      >
        <div style={{transform: 'translateZ(0)'}}>
          <div>
            <div
              ref={floating}
              className="floating"
              style={{position: strategy, top: y ?? 0, left: x ?? 0}}
            >
              Floating
            </div>
          </div>
        </div>
      </div>
    );
  } else if (hierarchy === 'm') {
    floatingJsx = (
      <div
        style={{
          overflow: 'hidden',
          position: 'relative',
          width: 80,
          height: 40,
        }}
      >
        <div
          ref={floating}
          className="floating"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            transform: 'translateZ(0)',
          }}
        >
          Floating
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
          {referenceJsx}
          {floatingJsx}
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
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'].map(
          (localHierarchy) => (
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
          )
        )}
      </Controls>
    </>
  );
}
