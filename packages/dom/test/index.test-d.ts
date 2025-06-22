import type {Middleware} from '../src';
import {
  arrow,
  autoPlacement,
  computePosition,
  detectOverflow,
  flip,
  hide,
  inline,
  limitShift,
  offset,
  platform,
  shift,
  size,
} from '../src';

// @ts-expect-error
computePosition();
// @ts-expect-error
computePosition(document.body);

computePosition(document.body, document.body);

computePosition(
  {
    getBoundingClientRect: () => ({
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }),
  },
  document.body,
);

computePosition(
  {
    getBoundingClientRect: () => ({
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }),
    contextElement: document.body,
  },
  document.body,
);

computePosition(
  {
    // @ts-expect-error
    getBoundingClientRect: () => ({
      top: 0,
    }),
    // @ts-expect-error
    contextElement: '',
  },
  document.body,
);

computePosition(document.body, document.body, {
  side: 'right',
  align: 'start',
});

computePosition(document.body, document.body, {
  strategy: 'fixed',
});

computePosition(document.body, document.body, {
  // @ts-expect-error
  strategy: 'random',
});

computePosition(document.body, document.body, {
  side: 'right',
  middleware: [
    shift(),
    flip(),
    autoPlacement(),
    offset(),
    hide(),
    size(),
    arrow({element: document.body}),
    inline(),
  ],
});

// @ts-expect-error
arrow();

arrow({element: document.body, padding: 5});
arrow(() => ({element: document.body, padding: 5}));

// @ts-expect-error
arrow({element: 'test'});
shift({
  // @ts-expect-error
  boundary: '',
});
shift({boundary: document.body});
shift({boundary: [document.body]});
shift({boundary: 'clipping-ancestors'});
shift({limiter: limitShift()});
shift({limiter: limitShift({offset: 5})});
shift({limiter: limitShift({offset: {side: 5}})});
shift({limiter: limitShift({offset: {align: 5}})});
shift({limiter: limitShift({offset: {side: 5, align: 5}})});
shift({limiter: limitShift({offset: () => 5})});
shift({limiter: limitShift({offset: () => ({side: 5})})});
shift({limiter: limitShift({offset: () => ({align: 5})})});
shift({limiter: limitShift({offset: () => ({side: 5, align: 5})})});
// @ts-expect-error
shift({limiter: 'test'});
shift(() => ({boundary: document.body}));

flip({
  // @ts-expect-error
  boundary: '',
});
flip({
  boundary: document.body,
  padding: {top: 0},
});
flip({boundary: [document.body]});
flip({boundary: 'clipping-ancestors'});
flip(() => ({boundary: document.body}));
size({
  // @ts-expect-error
  boundary: '',
});
size({boundary: document.body});
size({boundary: [document.body]});
size({boundary: 'clipping-ancestors'});
size(() => ({boundary: document.body}));
autoPlacement({
  // @ts-expect-error
  boundary: '',
});
autoPlacement(() => ({boundary: document.body}));
size({boundary: document.body});
size({boundary: [document.body]});
size({boundary: 'clipping-ancestors'});
size({
  apply({elements, availableHeight, availableWidth}) {
    availableHeight;
    availableWidth;
    // @ts-expect-error
    elements.floating.style = '';
    // @ts-expect-error
    elements.reference.style = '';
  },
});

offset();
offset(5);
offset({side: 5});
offset({align: 5});
offset({side: 5, align: 5});
offset(() => 5);
offset(() => ({side: 5}));
offset(() => ({align: 5}));
offset(() => ({side: 5, align: 5}));
// @ts-expect-error
offset(() => 'test');
// @ts-expect-error
offset('test');
// @ts-expect-error
offset({side: 'test'});
// @ts-expect-error
offset({align: 'test'});

inline(() => ({padding: 5}));

// @ts-expect-error
detectOverflow();

// @ts-expect-error
const middlewareWithoutName: Middleware = {
  fn() {
    return {};
  },
};

const middleware: Middleware = {
  name: 'test',
  fn(args) {
    const {elements} = args;
    // @ts-expect-error
    elements.floating.$$unknown$$;
    // @ts-expect-error
    elements.reference.focus();
    return {};
  },
};

const middlewareWDetectOverflow: Middleware = {
  name: 'test',
  fn(args) {
    // @ts-expect-error
    detectOverflow();
    detectOverflow(args);
    detectOverflow(args, {
      elementContext: 'reference',
      boundary: 'clipping-ancestors',
      rootBoundary: 'document',
      padding: 5,
      altBoundary: true,
    });
    detectOverflow(args, {
      elementContext: 'reference',
      boundary: 'clipping-ancestors',
      rootBoundary: 'document',
      padding: {bottom: 5},
      altBoundary: true,
    });

    return {};
  },
};

computePosition(document.body, document.body, {
  middleware: [middlewareWithoutName, middleware, middlewareWDetectOverflow],
});

computePosition(document.body, document.body, {
  middleware: [null, undefined, false, offset()],
});

computePosition(document.body, document.body, {
  platform: {
    ...platform,
    getOffsetParent: (element) =>
      (element as HTMLElement).offsetParent || window,
  },
});
