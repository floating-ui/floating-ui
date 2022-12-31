import * as React from 'react';

import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {useId} from './useId';

export interface Props {
  enabled?: boolean;
  role?:
    | 'tooltip'
    | 'dialog'
    | 'alertdialog'
    | 'menu'
    | 'listbox'
    | 'grid'
    | 'tree';
}

/**
 * Adds relevant screen reader props for a given element `role`.
 * @see https://floating-ui.com/docs/useRole
 */
export const useRole = <RT extends ReferenceType = ReferenceType>(
  {open}: FloatingContext<RT>,
  {enabled = true, role = 'dialog'}: Partial<Props> = {}
): ElementProps => {
  const rootId = useId();
  const referenceId = useId();

  return React.useMemo(() => {
    const floatingProps = {id: rootId, role};

    if (!enabled) {
      return {};
    }

    if (role === 'tooltip') {
      return {
        reference: {
          'aria-describedby': open ? rootId : undefined,
        },
        floating: floatingProps,
      };
    }

    return {
      reference: {
        'aria-expanded': open ? 'true' : 'false',
        'aria-haspopup': role === 'alertdialog' ? 'dialog' : role,
        'aria-controls': open ? rootId : undefined,
        ...(role === 'listbox' && {
          role: 'combobox',
        }),
        ...(role === 'menu' && {
          id: referenceId,
        }),
      },
      floating: {
        ...floatingProps,
        ...(role === 'menu' && {
          'aria-labelledby': referenceId,
        }),
      },
    };
  }, [enabled, role, open, rootId, referenceId]);
};
