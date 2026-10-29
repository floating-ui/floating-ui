import {
  getOverflowAncestors,
  isHTMLElement,
  isShadowRoot,
} from '@floating-ui/utils/dom';
import {computePosition, platform} from '../../src';

const inBrowser = typeof IntersectionObserver === 'function';

afterEach(() => {
  document.body.replaceChildren();
});

describe.runIf(inBrowser)('adopted ancestors', () => {
  test.each([false, true])(
    'positions a fixed floating element (shadow: %s)',
    async (shadow) => {
      const frame = document.body.appendChild(document.createElement('iframe'));
      const panel = document.body.appendChild(document.createElement('div'));
      Object.assign(panel.style, {
        position: 'fixed',
        left: '300px',
        top: '200px',
        transform: 'translateZ(0)',
      });
      const host = frame.contentDocument!.createElement('div');
      host.style.overflow = 'hidden';
      const root = shadow ? host.attachShadow({mode: 'open'}) : host;
      const reference = root.appendChild(document.createElement('button'));
      reference.textContent = 'Reference';
      const floating = root.appendChild(document.createElement('div'));
      floating.textContent = 'Floating';
      Object.assign(floating.style, {position: 'fixed', left: '0', top: '0'});
      panel.append(host);
      expect(host.ownerDocument).toBe(document);
      expect(isHTMLElement(host)).toBe(true);
      expect(isShadowRoot(root)).toBe(shadow);
      expect(getOverflowAncestors(reference)).toContain(host);
      expect(platform.getOffsetParent?.(floating)).toBe(panel);
      const {x, y} = await computePosition(reference, floating, {
        strategy: 'fixed',
        placement: 'bottom-start',
      });
      Object.assign(floating.style, {left: `${x}px`, top: `${y}px`});
      const referenceRect = reference.getBoundingClientRect();
      const floatingRect = floating.getBoundingClientRect();
      expect(floatingRect.left).toBeCloseTo(referenceRect.left);
      expect(floatingRect.top).toBeCloseTo(referenceRect.bottom);
    },
  );
});
