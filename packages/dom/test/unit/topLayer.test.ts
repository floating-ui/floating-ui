import {expect, test} from 'vitest';

import {computePosition, hide, platform} from '../../src';

const browserTest =
  typeof HTMLElement.prototype.showPopover === 'function' ? test : test.skip;

for (const modal of [false, true]) {
  for (const transformed of [false, true]) {
    browserTest(
      `top-layer descendants escape external ancestors (modal=${modal}, transformed=${transformed})`,
      async () => {
        const outer = document.createElement('div');
        outer.style.cssText =
          'position:absolute;left:0;top:0;width:10px;height:10px;overflow:hidden;transform:translateZ(0)';
        const layer = document.createElement(modal ? 'dialog' : 'div');
        if (!modal) layer.setAttribute('popover', 'manual');
        layer.style.cssText =
          'position:fixed;inset:auto;left:200px;top:200px;margin:0;padding:0;border:0;width:300px;height:200px;overflow:auto';
        if (transformed) layer.style.transform = 'translateZ(0)';
        const reference = document.createElement('div');
        reference.style.cssText = 'height:20px;width:80px;margin-top:40px';
        const space = document.createElement('div');
        space.style.height = '600px';
        const floating = document.createElement('div');
        floating.setAttribute('popover', 'manual');
        floating.style.cssText =
          'position:fixed;inset:auto;margin:0;width:80px;height:40px';
        layer.append(reference, space, floating);
        outer.append(layer);
        document.body.append(outer);
        try {
          if (modal) (layer as HTMLDialogElement).showModal();
          else layer.showPopover();
          floating.showPopover();
          const getClippingRect = (
            element: Element,
            boundary: 'clippingAncestors' | Element | [] = 'clippingAncestors',
          ) =>
            platform.getClippingRect.call(
              {...platform, _c: new Map()},
              {
                element,
                boundary,
                rootBoundary: 'viewport',
                strategy: 'fixed',
              },
            );
          const viewport = await getClippingRect(reference, []);
          expect(await getClippingRect(layer)).toEqual(viewport);
          expect(await getClippingRect(floating)).toEqual(viewport);
          expect(await getClippingRect(reference)).toEqual(
            await getClippingRect(reference, layer),
          );
          expect(
            (
              await computePosition(reference, floating, {
                strategy: 'fixed',
                middleware: [hide()],
              })
            ).middlewareData.hide?.referenceHidden,
          ).toBe(false);
          layer.scrollTop = 80;
          expect(
            (
              await computePosition(reference, floating, {
                strategy: 'fixed',
                middleware: [hide()],
              })
            ).middlewareData.hide?.referenceHidden,
          ).toBe(true);
          // An explicit boundary remains authoritative, even outside the top layer.
          expect(await getClippingRect(reference, outer)).not.toEqual(
            await getClippingRect(reference),
          );
        } finally {
          outer.remove();
        }
      },
    );
  }
}
