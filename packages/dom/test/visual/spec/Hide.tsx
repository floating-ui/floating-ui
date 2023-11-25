import type {Placement} from '@floating-ui/core';
import {
  autoUpdate,
  hide,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';

import {allPlacements} from '../utils/allPlacements';
import {Controls} from '../utils/Controls';
import {useScroll} from '../utils/useScroll';

export function Hide() {
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [hierarchy, setHierarchy] = useState('a');
  const isFixedStrategy = ['j', 'k', 'l', 'm', 'o', 'p', 'q'].includes(
    hierarchy,
  );

  const {
    x,
    y,
    refs,
    strategy,
    update,
    middlewareData: {hide: {referenceHidden, escaped} = {}},
  } = useFloating({
    placement,
    strategy: isFixedStrategy ? 'fixed' : 'absolute',
    whileElementsMounted: autoUpdate,
    middleware: [
      hide({strategy: 'referenceHidden'}),
      hide({strategy: 'escaped'}),
      hierarchy === 'o' && shift(),
      size({
        apply: isFixedStrategy
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
    <div ref={refs.setReference} className="reference">
      Reference
    </div>
  );
  let floatingJsx = (
    <div
      ref={refs.setFloating}
      className="floating"
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
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
          {referenceJsx}
        </div>
      </div>
    );
  } else if (hierarchy === 'c') {
    referenceJsx = (
      <div style={{overflow: 'scroll', height: 0}}>
        <div style={{overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: 0, left: 0}}>
            {referenceJsx}
          </div>
        </div>
      </div>
    );
  } else if (hierarchy === 'd') {
    referenceJsx = (
      <div style={{overflow: 'hidden', height: 0}}>
        <div
          ref={refs.setReference}
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
          <div style={{position: 'absolute'}}>{referenceJsx}</div>
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
          <div style={{position: 'absolute'}}>{referenceJsx}</div>
        </div>
      </div>
    );
  } else if (hierarchy === 'g') {
    referenceJsx = (
      <div style={{overflow: 'scroll', height: 0}}>
        <div style={{overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: 0, left: 0}}>
            <div style={{position: 'absolute'}}>{referenceJsx}</div>
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
            <div style={{position: 'absolute'}}>{referenceJsx}</div>
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
              {referenceJsx}
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
        {floatingJsx}
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
        {floatingJsx}
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
          <div>{floatingJsx}</div>
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
          ref={refs.setFloating}
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
  } else if (hierarchy === 'n') {
    // https://github.com/floating-ui/floating-ui/issues/2278
    referenceJsx = (
      <div style={{position: 'fixed', top: 150, left: 225, overflow: 'hidden'}}>
        {referenceJsx}
      </div>
    );
  } else if (hierarchy === 'o') {
    // https://github.com/floating-ui/floating-ui/issues/2167
    floatingJsx = (
      <div
        style={{
          width: 50,
          height: 50,
          overflow: 'auto',
          position: 'absolute',
          top: 50,
          left: 50,
          background: 'blue',
          display: 'inline-block',
        }}
      >
        <div style={{position: 'fixed'}}>
          <div style={{transform: 'translateZ(0)'}}>{floatingJsx}</div>
        </div>
      </div>
    );
  } else if (hierarchy === 'p') {
    // https://github.com/floating-ui/floating-ui/issues/2288
    referenceJsx = (
      <div style={{overflow: 'hidden', height: 0}}>
        <div style={{position: 'relative'}}>
          <div style={{position: 'fixed', top: 100, left: 300}}>
            {referenceJsx}
          </div>
        </div>
      </div>
    );
  } else if (hierarchy === 'q') {
    // https://github.com/floating-ui/floating-ui/issues/2288
    referenceJsx = (
      <div style={{position: 'fixed', overflow: 'hidden', height: 0}}>
        <div style={{position: 'fixed', top: 100, left: 300}}>
          {referenceJsx}
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
        {[
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k',
          'l',
          'm',
          'n',
          'o',
          'p',
          'q',
        ].map((localHierarchy) => (
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
