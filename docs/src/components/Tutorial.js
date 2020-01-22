import React, { useState, forwardRef } from 'react';
import styled from '@emotion/styled';
import { usePopper } from './Popper';
import { css } from '@emotion/core';

let id = 0;
function getId() {
  return ++id;
}

const Box = styled.div`
  background: white;
  border-radius: 8px;
  padding: 50px 25px 75px;
  text-align: center;
`;

const Button = styled.button`
  background: white;
  border: 1px solid #ccc;
  color: #333;
  font-size: 100%;
  padding: 5px 10px;
`;

const Tooltip = forwardRef((props, ref) => (
  <div
    {...props}
    ref={ref}
    role="tooltip"
    css={css`
      background: #333;
      color: white;
      font-weight: bold;
      padding: 4px 8px;
      font-size: 13px;
      border-radius: 4px;
      text-align: left;

      &[data-popper-placement^='top'] > [data-popper-arrow] {
        bottom: -4px;
      }

      &[data-popper-placement^='bottom'] > [data-popper-arrow] {
        top: -4px;
      }

      &[data-popper-placement^='left'] > [data-popper-arrow] {
        right: -4px;
      }

      &[data-popper-placement^='right'] > [data-popper-arrow] {
        left: -4px;
      }
    `}
  />
));

const Arrow = styled.div`
  &,
  &::before {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: -1;
  }

  &::before {
    content: '';
    transform: rotate(45deg);
    background: #333;
  }
`;

const useId = () => useState(() => `tooltip-${getId()}`)[0];

export const Result1 = () => {
  const { reference, popper } = usePopper(null);
  const id = useId();

  return (
    <Box>
      <Button ref={reference} aria-describedby={id}>
        My button
      </Button>
      <Tooltip ref={popper} id={id}>
        My tooltip
      </Tooltip>
    </Box>
  );
};

export const Result2 = () => {
  const { reference, popper } = usePopper(null);
  const id = useId();

  return (
    <Box>
      <Button ref={reference} aria-describedby={id}>
        My button
      </Button>
      <Tooltip ref={popper} id={id}>
        My tooltip
        <Arrow data-popper-arrow />
      </Tooltip>
    </Box>
  );
};

export const Result3 = () => {
  const { reference, popper } = usePopper({
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  return (
    <Box>
      <Button ref={reference} aria-describedby={id}>
        My button
      </Button>
      <Tooltip ref={popper} id={id}>
        My tooltip
        <Arrow data-popper-arrow />
      </Tooltip>
    </Box>
  );
};

export const Result4 = () => {
  const [display, setDisplay] = useState('none');
  const id = useId();
  const { reference, popper } = usePopper({
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  function show() {
    setDisplay('block');
  }

  function hide() {
    setDisplay('none');
  }

  return (
    <Box>
      <Button
        ref={reference}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        aria-describedby={id}
      >
        My button
      </Button>
      <Tooltip id={id} ref={popper} style={{ display }}>
        My tooltip
        <Arrow data-popper-arrow />
      </Tooltip>
    </Box>
  );
};
