import { createPopper } from '../../../lib/popper.js';
import { useRef, useLayoutEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

export const usePopper = (options = {}) => {
  const referenceRef = useRef();
  const popperRef = useRef();
  const instanceRef = useRef();

  const mergedOptions = useMemo(
    () => ({
      ...options,
      modifiers: [
        ...(options.modifiers || []),
        {
          name: 'arrow',
          options: {
            padding: 5,
          },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    }),
    [options]
  );

  useLayoutEffect(() => {
    const instance = createPopper(
      referenceRef.current,
      popperRef.current,
      mergedOptions
    );

    instanceRef.current = instance;

    return () => {
      instance.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    instanceRef.current.setOptions(mergedOptions);
    instanceRef.current.update();
  }, [mergedOptions]);

  return {
    reference: referenceRef,
    popper: popperRef,
    instance: instanceRef,
  };
};

export const Tooltip = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: ${props => (props.dark ? '#333' : '#fff')};
  color: ${props => (props.dark ? '#fff' : '#642f45')};
  backdrop-filter: blur(20px) saturate(180%);
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  text-align: left;
  pointer-events: none;

  ${props =>
    props.hide &&
    css`
      &[data-popper-escaped] {
        opacity: 0.5;
      }

      &[data-popper-reference-hidden] {
        opacity: 0;
      }
    `}

  &[data-popper-placement^='top'] > [data-popper-arrow] {
    bottom: -5px;
  }

  &[data-popper-placement^='right'] > [data-popper-arrow] {
    left: -5px;
  }

  &[data-popper-placement^='bottom'] > [data-popper-arrow] {
    top: -5px;
  }

  &[data-popper-placement^='left'] > [data-popper-arrow] {
    right: -5px;
  }
`;

export const Arrow = styled.div`
  &,
  &::before {
    width: 10px;
    height: 10px;
    position: absolute;
    z-index: -1;
  }

  &::before {
    content: '';
    transform: rotate(45deg);
    background: ${props => (props.dark ? '#333' : '#fff')};
    top: 0;
    left: 0;
  }
`;
