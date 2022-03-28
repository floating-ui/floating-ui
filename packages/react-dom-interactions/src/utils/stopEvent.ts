import React from 'react';

export function stopEvent(
  event:
    | React.MouseEvent
    | React.KeyboardEvent
    | React.FocusEvent
    | KeyboardEvent
) {
  event.preventDefault();
  event.stopPropagation();
}
