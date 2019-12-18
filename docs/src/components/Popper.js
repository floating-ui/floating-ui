import { createPopper } from '../../../lib/popper.js';
import { useRef, useLayoutEffect, useEffect } from 'react';
import styled from '@emotion/styled';

export const usePopper = (options = {}) => {
  const referenceRef = useRef();
  const popperRef = useRef();

  const popperInstanceRef = useRef();

  useLayoutEffect(() => {
    const popperInstance = createPopper(
      referenceRef.current,
      popperRef.current,
      options
    );

    popperInstanceRef.current = popperInstance;

    return () => {
      popperInstance.destroy();
    };
  }, []);

  useEffect(() => {
    popperInstanceRef.current.setOptions(options);
    popperInstanceRef.current.update();
  }, [options]);

  return {
    reference: referenceRef,
    popper: popperRef,
  };
};

export const Tooltip = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: white;
  color: #333;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  text-align: left;
  pointer-events: none;
  color: #642f45;

  &[data-popper-placement^='top'] {
    > [data-popper-arrow] {
      bottom: -5px;
      margin: 0 6px;
    }
  }

  &[data-popper-placement^='right'] {
    > [data-popper-arrow] {
      left: -5px;
      margin: 6px 0;
    }
  }

  &[data-popper-placement^='bottom'] {
    > [data-popper-arrow] {
      top: -5px;
      margin: 0 6px;
    }
  }

  &[data-popper-placement^='left'] {
    > [data-popper-arrow] {
      right: -5px;
      margin: 6px 0;
    }
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
    background: white;
    top: 0;
    left: 0;
  }
`;
