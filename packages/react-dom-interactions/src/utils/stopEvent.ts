import React from 'react';

export function stopEvent(
  event:
    | React.MouseEvent
    | React.KeyboardEvent
    | React.FocusEvent
    | KeyboardEvent
    | FocusEvent
) {
  event.preventDefault();
  event.stopPropagation();
}
