import {act, cleanup, fireEvent, render, within} from '@testing-library/react';
import {useState} from 'react';
import {createPortal} from 'react-dom';
import {afterEach, expect, test, vi} from 'vitest';

import {safePolygon, useFloating, useHover, useInteractions} from '../../src';
import type {HandleClose} from '../../src/hooks/useHover';

function App({
  portal,
  enabled = true,
  handleClose = safePolygon({requireIntent: false}),
}: {
  portal?: HTMLElement;
  enabled?: boolean;
  handleClose?: HandleClose;
}) {
  const [open, onOpenChange] = useState(false);
  const {refs, context} = useFloating({open, onOpenChange});
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useHover(context, {enabled, handleClose}),
  ]);
  const floating = open && (
    <div role="tooltip" {...getFloatingProps({ref: refs.setFloating})}>
      Floating content
    </div>
  );
  return (
    <>
      <button {...getReferenceProps({ref: refs.setReference})}>
        Reference
      </button>
      {portal ? createPortal(floating, portal) : floating}
    </>
  );
}

function appendContainer(parent: Node = document.body) {
  const container = document.createElement('div');
  parent.appendChild(container);
  return container;
}

function appendShadowContainer(
  mode: ShadowRootMode,
  parent: Node = document.body,
) {
  const host = appendContainer(parent);
  return appendContainer(host.attachShadow({mode}));
}

const layouts = [
  ['light DOM', () => ({container: appendContainer()})],
  ['open shadow root', () => ({container: appendShadowContainer('open')})],
  ['closed shadow root', () => ({container: appendShadowContainer('closed')})],
  [
    'nested closed shadow roots',
    () => ({
      container: appendShadowContainer(
        'closed',
        appendShadowContainer('closed'),
      ),
    }),
  ],
  [
    'outer closed reference root and inner closed floating root',
    () => {
      const container = appendShadowContainer('closed');
      return {
        container,
        portal: appendShadowContainer('closed', container.getRootNode()),
      };
    },
  ],
  [
    'inner closed reference root and outer closed floating root',
    () => {
      const portal = appendShadowContainer('closed');
      return {
        container: appendShadowContainer('closed', portal.getRootNode()),
        portal,
      };
    },
  ],
  [
    'closed reference root and document portal',
    () => ({
      container: appendShadowContainer('closed'),
      portal: appendContainer(),
    }),
  ],
  [
    'document reference and closed floating root',
    () => ({
      container: appendContainer(),
      portal: appendShadowContainer('closed'),
    }),
  ],
  [
    'separate closed shadow roots',
    () => ({
      container: appendShadowContainer('closed'),
      portal: appendShadowContainer('closed'),
    }),
  ],
] as const;

async function setup(
  createLayout: () => {container: HTMLElement; portal?: HTMLElement},
  handleClose?: HandleClose,
) {
  const {container, portal} = createLayout();
  const result = render(<App portal={portal} handleClose={handleClose} />, {
    container,
  });
  const reference = within(container).getByRole('button');
  vi.spyOn(reference, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 0, 100, 20),
  );
  fireEvent.mouseEnter(reference);
  await act(async () => {});
  const queries = within(portal || container);
  const floating = queries.getByRole('tooltip');
  vi.spyOn(floating, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 30, 100, 50),
  );
  fireEvent.mouseLeave(reference, {clientX: 50, clientY: 20});
  return {...result, container, portal, reference, floating, queries};
}

function move(target: Element, clientX: number, clientY: number) {
  fireEvent.mouseMove(target, {
    bubbles: true,
    composed: true,
    clientX,
    clientY,
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

test.each(layouts)(
  'safePolygon preserves hovering in %s and closes outside',
  async (_, createLayout) => {
    const {reference, floating, queries} = await setup(createLayout);
    move(floating, 50, 60);
    expect(queries.queryByRole('tooltip')).toBeInTheDocument();

    move(reference, 50, 10);
    expect(queries.queryByRole('tooltip')).toBeInTheDocument();

    move(floating, 50, 60);
    expect(queries.queryByRole('tooltip')).toBeInTheDocument();

    move(document.body, 200, 200);
    expect(queries.queryByRole('tooltip')).not.toBeInTheDocument();
  },
);

test.each(layouts)(
  'custom close handler sees one original target in %s and is cleaned up',
  async (_, createLayout) => {
    const targets: EventTarget[] = [];
    const handler = vi.fn((event: MouseEvent) => {
      targets.push(event.composedPath()[0]);
    });
    const {container, portal, reference, floating, unmount} = await setup(
      createLayout,
      () => handler,
    );
    // The direct mouseleave check is separate from the subscribed mousemoves.
    handler.mockClear();
    targets.length = 0;

    move(floating, 50, 60);
    move(reference, 50, 10);
    move(document.body, 200, 200);
    expect(handler).toHaveBeenCalledTimes(3);
    expect(targets).toEqual([floating, reference, document.body]);

    unmount();
    move(container, 200, 200);
    if (portal) move(portal, 200, 200);
    move(document.body, 200, 200);
    expect(handler).toHaveBeenCalledTimes(3);
  },
);

test('disabling useHover cleans up closed-root and document movement handlers', async () => {
  const handler = vi.fn();
  const handleClose: HandleClose = () => handler;
  const {container, portal, reference, floating, rerender} = await setup(
    () => ({
      container: appendShadowContainer('closed'),
      portal: appendShadowContainer('closed'),
    }),
    handleClose,
  );
  handler.mockClear();
  move(floating, 50, 60);
  expect(handler).toHaveBeenCalledTimes(1);

  rerender(<App portal={portal} handleClose={handleClose} enabled={false} />);
  move(floating, 50, 60);
  move(reference, 50, 10);
  move(container, 200, 200);
  move(document.body, 200, 200);
  expect(handler).toHaveBeenCalledTimes(1);
});
