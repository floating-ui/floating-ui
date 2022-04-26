import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

const identifier = 'data-floating-ui-scroll-lock';

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

    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;

    // RTL <body> scrollbar
    const scrollbarX =
      Math.round(document.documentElement.getBoundingClientRect().left) +
      document.documentElement.scrollLeft;
    const paddingProp = scrollbarX ? 'paddingLeft' : 'paddingRight';

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const alreadyLocked = document.body.hasAttribute(identifier);

    if (alreadyLocked) {
      return;
    }

    Object.assign(document.body.style, {
      position: 'fixed',
      overflow: 'hidden',
      top: `-${scrollY}px`,
      left: `-${scrollX}px`,
      right: '0',
      [paddingProp]: `${scrollbarWidth}px`,
    });

    document.body.setAttribute(identifier, '');

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
