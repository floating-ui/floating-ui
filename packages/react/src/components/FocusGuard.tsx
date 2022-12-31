import * as React from 'react';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';

import {useEvent} from '../hooks/utils/useEvent';
import {isMac, isSafari} from '../utils/is';

// See Diego Haz's Sandbox for making this logic work well on Safari/iOS:
// https://codesandbox.io/s/tabbable-portal-f4tng?file=/src/FocusTrap.tsx

export const HIDDEN_STYLES: React.CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'fixed',
  whiteSpace: 'nowrap',
  width: '1px',
  top: 0,
  left: 0,
};

let activeElement: HTMLElement | undefined;
let timeoutId: number | undefined;

function setActiveElementOnTab(event: KeyboardEvent) {
  if (event.key === 'Tab') {
    activeElement = event.target as typeof activeElement;
    clearTimeout(timeoutId);
  }
}

function isTabFocus(event: React.FocusEvent<HTMLElement>) {
  const result = activeElement === event.relatedTarget;
  activeElement = event.relatedTarget as typeof activeElement;
  clearTimeout(timeoutId);
  return result;
}

export const FocusGuard = React.forwardRef<
  HTMLSpanElement,
  React.HTMLProps<HTMLSpanElement>
>(function FocusGuard(props, ref) {
  const onFocus = useEvent(props.onFocus);
  const [role, setRole] = React.useState<'button' | undefined>();

  useIsomorphicLayoutEffect(() => {
    if (isSafari()) {
      // Unlike other screen readers such as NVDA and JAWS, the virtual cursor
      // on VoiceOver does trigger the onFocus event, so we can use the focus
      // trap element. On Safari, only buttons trigger the onFocus event.
      // NB: "group" role in the Sandbox no longer appears to work, must be a
      // button role.
      setRole('button');
    }

    document.addEventListener('keydown', setActiveElementOnTab);
    return () => {
      document.removeEventListener('keydown', setActiveElementOnTab);
    };
  }, []);

  return (
    <span
      {...props}
      ref={ref}
      tabIndex={0}
      // Role is only for VoiceOver
      role={role}
      aria-hidden={role ? undefined : true}
      data-floating-ui-focus-guard=""
      style={HIDDEN_STYLES}
      onFocus={(event) => {
        if (isSafari() && isMac() && !isTabFocus(event)) {
          // On macOS we need to wait a little bit before moving
          // focus again.
          event.persist();
          timeoutId = window.setTimeout(() => {
            onFocus(event);
          }, 50);
        } else {
          onFocus(event);
        }
      }}
    />
  );
});
