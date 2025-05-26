import * as React from 'react';
import {useModernLayoutEffect, getPlatform} from '@floating-ui/react/utils';

let lockCount = 0;
const scrollbarProperty = '--floating-ui-scrollbar-width';

export interface FloatingOverlayProps {
  /**
   * Whether the overlay should lock scrolling on the document body.
   * @default false
   */
  lockScroll?: boolean;
}

function enableScrollLock() {
  const platform = getPlatform();
  const isIOS =
    /iP(hone|ad|od)|iOS/.test(platform) ||
    // iPads can claim to be MacIntel
    (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const bodyStyle = document.body.style;
  // RTL <body> scrollbar
  const scrollbarX =
    Math.round(document.documentElement.getBoundingClientRect().left) +
    document.documentElement.scrollLeft;
  const paddingProp = scrollbarX ? 'paddingLeft' : 'paddingRight';
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  const scrollX = bodyStyle.left ? parseFloat(bodyStyle.left) : window.scrollX;
  const scrollY = bodyStyle.top ? parseFloat(bodyStyle.top) : window.scrollY;

  bodyStyle.overflow = 'hidden';
  bodyStyle.setProperty(scrollbarProperty, `${scrollbarWidth}px`);

  if (scrollbarWidth) {
    bodyStyle[paddingProp] = `${scrollbarWidth}px`;
  }

  // Only iOS doesn't respect `overflow: hidden` on document.body, and this
  // technique has fewer side effects.
  if (isIOS) {
    // iOS 12 does not support `visualViewport`.
    const offsetLeft = window.visualViewport?.offsetLeft || 0;
    const offsetTop = window.visualViewport?.offsetTop || 0;

    Object.assign(bodyStyle, {
      position: 'fixed',
      top: `${-(scrollY - Math.floor(offsetTop))}px`,
      left: `${-(scrollX - Math.floor(offsetLeft))}px`,
      right: '0',
    });
  }

  return () => {
    Object.assign(bodyStyle, {
      overflow: '',
      [paddingProp]: '',
    });
    bodyStyle.removeProperty(scrollbarProperty);

    if (isIOS) {
      Object.assign(bodyStyle, {
        position: '',
        top: '',
        left: '',
        right: '',
      });
      window.scrollTo(scrollX, scrollY);
    }
  };
}

let cleanup = () => {};

/**
 * Provides base styling for a fixed overlay element to dim content or block
 * pointer events behind a floating element.
 * It's a regular `<div>`, so it can be styled via any CSS solution you prefer.
 * @see https://floating-ui.com/docs/FloatingOverlay
 */
export const FloatingOverlay = React.forwardRef(function FloatingOverlay(
  props: React.ComponentPropsWithoutRef<'div'> & FloatingOverlayProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {lockScroll = false, ...rest} = props;

  useModernLayoutEffect(() => {
    if (!lockScroll) return;

    lockCount++;

    if (lockCount === 1) {
      cleanup = enableScrollLock();
    }

    return () => {
      lockCount--;
      if (lockCount === 0) {
        cleanup();
      }
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
