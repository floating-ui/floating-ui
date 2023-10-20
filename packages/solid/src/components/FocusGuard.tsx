import {isSafari} from '@floating-ui/utils/react';
import {
  Component,
  createMemo,
  createSignal,
  JSX,
  onCleanup,
  onMount,
} from 'solid-js';

import {createAttribute} from '../utils/createAttribute';

// See Diego Haz's Sandbox for making this logic work well on Safari/iOS:
// https://codesandbox.io/s/tabbable-portal-f4tng?file=/src/FocusTrap.tsx

export const HIDDEN_STYLES: JSX.CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'fixed',
  'white-space': 'nowrap',
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

export const FocusGuard: Component<JSX.HTMLAttributes<HTMLSpanElement>> = (
  props,
) => {
  const [role, setRole] = createSignal<'button' | undefined>();

  onMount(() => {
    if (isSafari()) {
      // Unlike other screen readers such as NVDA and JAWS, the virtual cursor
      // on VoiceOver does trigger the onFocus event, so we can use the focus
      // trap element. On Safari, only buttons trigger the onFocus event.
      // NB: "group" role in the Sandbox no longer appears to work, must be a
      // button role.
      setRole('button');
    }

    document.addEventListener('keydown', setActiveElementOnTab);
  });
  onCleanup(() => {
    document.removeEventListener('keydown', setActiveElementOnTab);
  });

  const restProps = createMemo(() => ({
    tabindex: 0,
    // Role is only for VoiceOver
    role: role(),
    'aria-hidden': role() ? undefined : true,
    [createAttribute('focus-guard')]: '',
    style: HIDDEN_STYLES,
  }));

  return <span {...props} {...restProps()} />;
};
