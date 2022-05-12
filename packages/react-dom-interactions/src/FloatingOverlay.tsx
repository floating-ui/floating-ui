import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

const identifier = 'data-floating-ui-scroll-lock';

interface NavigatorUAData {
  brands: Array<{brand: string; version: string}>;
  mobile: boolean;
  platform: string;
}

// Avoid Chrome DevTools blue warning
export function getPlatform(): string {
  const uaData = (navigator as any).userAgentData as
    | NavigatorUAData
    | undefined;

  if (uaData?.platform) {
    return uaData.platform;
  }

  return navigator.platform;
}

/**
 * Provides base styling for a fixed overlay element to dim content or block
 * pointer events behind a floating element.
 * It's a regular `<div>`, so it can be styled via any CSS solution you prefer.
 * @see https://floating-ui.com/docs/FloatingOverlay
 */
export const FloatingOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & {lockScroll?: boolean}
>(function FloatingOverlay({lockScroll = false, ...rest}, ref) {
  useLayoutEffect(() => {
    if (!lockScroll) {
      return;
    }

    const alreadyLocked = document.body.hasAttribute(identifier);
    if (alreadyLocked) {
      return;
    }

    document.body.setAttribute(identifier, '');

    // RTL <body> scrollbar
    const scrollbarX =
      Math.round(document.documentElement.getBoundingClientRect().left) +
      document.documentElement.scrollLeft;
    const paddingProp = scrollbarX ? 'paddingLeft' : 'paddingRight';

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // Only iOS doesn't respect `overflow: hidden` on document.body, and this
    // technique has fewer side effects.
    if (!/iP(hone|ad|od)|iOS/.test(getPlatform())) {
      Object.assign(document.body.style, {
        overflow: 'hidden',
        [paddingProp]: `${scrollbarWidth}px`,
      });

      return () => {
        document.body.removeAttribute(identifier);
        Object.assign(document.body.style, {
          overflow: '',
          [paddingProp]: '',
        });
      };
    }

    // iOS 12 does not support `visuaViewport`.
    const offsetLeft = window.visualViewport?.offsetLeft ?? 0;
    const offsetTop = window.visualViewport?.offsetTop ?? 0;
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;

    Object.assign(document.body.style, {
      position: 'fixed',
      overflow: 'hidden',
      top: `${-(scrollY - Math.floor(offsetTop))}px`,
      left: `${-(scrollX - Math.floor(offsetLeft))}px`,
      right: '0',
      [paddingProp]: `${scrollbarWidth}px`,
    });

    return () => {
      Object.assign(document.body.style, {
        position: '',
        overflow: '',
        top: '',
        left: '',
        right: '',
        [paddingProp]: '',
      });

      document.body.removeAttribute(identifier);
      window.scrollTo(scrollX, scrollY);
    };
  }, [lockScroll]);

  return (
    <div
      ref={ref}
      {...rest}
      style={{
        position: 'fixed',
        overflow: 'auto',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        ...rest.style,
      }}
    />
  );
});
