import React, {forwardRef} from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

/**
 * Provides base styling for a fixed overlay element to dim content or block
 * pointer events behind a floating element.
 * It's a regular `<div>`, so it can be styled via any CSS solution you prefer.
 * @see https://floating-ui.com/docs/FloatingOverlay
 */
export const FloatingOverlay = forwardRef<
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

    Object.assign(document.body.style, {
      position: 'fixed',
      overflow: 'hidden',
      top: `-${scrollY}px`,
      left: `-${scrollX}px`,
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
