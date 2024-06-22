import {
  getOverflowAncestors,
  shift,
  useFloating,
  type VirtualElement,
} from '@floating-ui/react-dom';
import type {MutableRefObject} from 'react';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {flushSync} from 'react-dom';

import {isElement} from '../../../src/platform/isElement';

export const useScroll = ({
  refs,
  update,
  rtl = false,
}: {
  refs: {
    reference: MutableRefObject<Element | VirtualElement | null>;
    floating: MutableRefObject<HTMLElement | null>;
  };
  update: () => void;
  rtl?: boolean;
}) => {
  const {
    x,
    y,
    refs: floatingRefs,
    strategy,
    update: indicatorUpdate,
  } = useFloating({
    strategy: 'fixed',
    placement: 'top',
    middleware: [shift({crossAxis: true, altBoundary: true, padding: 10})],
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [{scrollX, scrollY}, setScroll] = useState<{
    scrollX: null | number;
    scrollY: null | number;
  }>({
    scrollX: null,
    scrollY: null,
  });

  useEffect(() => {
    if (!refs.reference.current) {
      return;
    }

    const parents = [
      ...(isElement(refs.reference.current)
        ? getOverflowAncestors(refs.reference.current)
        : []),
      ...(refs.floating.current
        ? getOverflowAncestors(refs.floating.current)
        : []),
    ];

    const localUpdate = () => {
      const scroll = scrollRef.current;

      if (scroll) {
        flushSync(() => {
          setScroll({scrollX: scroll.scrollLeft, scrollY: scroll.scrollTop});
        });
      }

      update();
      indicatorUpdate();
    };

    parents.forEach((el) => {
      el.addEventListener('scroll', localUpdate);
    });

    const scroll = scrollRef.current;
    if (scroll) {
      const y = scroll.scrollHeight / 2 - scroll.offsetHeight / 2;
      const x = scroll.scrollWidth / 2 - scroll.offsetWidth / 2;
      scroll.scrollTop = y;
      scroll.scrollLeft = rtl ? -x : x;
    }

    update();

    return () => {
      parents.forEach((el) => {
        el.removeEventListener('scroll', localUpdate);
      });
    };
  }, [refs.floating, refs.reference, update, indicatorUpdate, rtl]);

  useLayoutEffect(() => {
    floatingRefs.setReference(refs.reference.current);
  }, [floatingRefs, refs.reference]);

  const indicator = (
    <div
      className="scroll-indicator"
      ref={floatingRefs.setFloating}
      style={{
        position: strategy,
        top: y ?? '',
        left: x ?? '',
      }}
    >
      x: {scrollX}, y: {scrollY}
    </div>
  );

  return {scrollRef, indicator};
};
