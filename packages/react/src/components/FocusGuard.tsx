import {isSafari} from '@floating-ui/react/utils';
import * as React from 'react';
import useModernLayoutEffect from 'use-isomorphic-layout-effect';

import {createAttribute} from '../utils/createAttribute';

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

export const FocusGuard = React.forwardRef(function FocusGuard(
  props: React.ComponentPropsWithoutRef<'span'>,
  ref: React.ForwardedRef<HTMLSpanElement>,
) {
  const [role, setRole] = React.useState<'button' | undefined>();

  useModernLayoutEffect(() => {
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

  const restProps = {
    ref,
    tabIndex: 0,
    // Role is only for VoiceOver
    role,
    'aria-hidden': role ? undefined : true,
    [createAttribute('focus-guard')]: '',
    style: HIDDEN_STYLES,
  };

  return <span {...props} {...restProps} />;
});
