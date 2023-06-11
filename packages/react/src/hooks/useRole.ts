import * as React from 'react';

import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {useId} from './useId';

export interface UseRoleProps {
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
 * Adds base screen reader props to the reference and floating elements for a
 * given floating element `role`.
 * @see https://floating-ui.com/docs/useRole
 */
export function useRole<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  props: UseRoleProps = {}
): ElementProps {
  const {open, floatingId} = context;
  const {enabled = true, role = 'dialog'} = props;

  const referenceId = useId();

  return React.useMemo(() => {
    const floatingProps = {id: floatingId, role};

    if (!enabled) {
      return {};
    }

    if (role === 'tooltip') {
      return {
        reference: {
          'aria-describedby': open ? floatingId : undefined,
        },
        floating: floatingProps,
      };
    }

    return {
      reference: {
        'aria-expanded': open ? 'true' : 'false',
        'aria-haspopup': role === 'alertdialog' ? 'dialog' : role,
        'aria-controls': open ? floatingId : undefined,
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
  }, [enabled, role, open, floatingId, referenceId]);
}
