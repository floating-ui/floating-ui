import React, { useRef, useLayoutEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { usePopper, Tooltip, Arrow } from './Popper';

const ClippingParentStyled = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  background-color: whitesmoke;
  overflow-y: scroll;

  ${props =>
    props.scrollable
      ? css`
          &::before {
            content: '';
            display: block;
            height: 400px;
          }

          &::after {
            content: '';
            display: block;
            height: 500px;
          }
        `
      : css`
          border: 3px solid #c83b50;
        `}
`;

const Reference = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 2px dashed #c83b50;
  color: #c83b50;
  font-weight: bold;
`;

const ClippingParent = props => {
  const scrollRef = useRef();

  useLayoutEffect(() => {
    scrollRef.current.scrollTop = 315;
  }, []);

  return <ClippingParentStyled ref={scrollRef} {...props} />;
};

export const ArrowDemo = () => {
  const { reference, popper } = usePopper({
    placement: 'right',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [10, 0],
        },
      },
    ],
  });

  return (
    <>
      <ClippingParent scrollable>
        <Reference ref={reference} style={{ position: 'absolute', left: 15 }}>
          Reference
        </Reference>
        <Tooltip ref={popper} dark>
          Tooltip
          <br />
          that
          <br />
          is
          <br />
          taller
          <br />
          than
          <br />
          its
          <br />
          reference
          <Arrow data-popper-arrow dark />
        </Tooltip>
      </ClippingParent>
    </>
  );
};

export const HideDemo = () => {
  const { reference, popper } = usePopper();

  return (
    <>
      <ClippingParent scrollable>
        <Reference
          ref={reference}
          style={{
            position: 'absolute',
            left: '50%',
            marginLeft: -50,
          }}
        >
          Reference
        </Reference>
      </ClippingParent>
      <Tooltip ref={popper} dark hide>
        Tooltip
      </Tooltip>
    </>
  );
};

export const OffsetDemo = ({ offset }) => {
  const { reference, popper } = usePopper({
    placement: 'right',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset,
        },
      },
    ],
  });

  return (
    <>
      <Reference ref={reference}>Reference</Reference>
      <Tooltip ref={popper} dark>
        Tooltip
      </Tooltip>
    </>
  );
};

export const PreventOverflowDemo = () => {
  const { reference, popper } = usePopper();

  return (
    <>
      <ClippingParent>
        <Reference
          ref={reference}
          style={{
            position: 'absolute',
            top: 50,
            left: 15,
          }}
        >
          Reference
        </Reference>
        <Tooltip ref={popper} dark>
          Tooltip wider than its reference
        </Tooltip>
      </ClippingParent>
    </>
  );
};

export const FlipDemo = () => {
  const { reference, popper } = usePopper();

  return (
    <>
      <ClippingParent scrollable>
        <Reference
          ref={reference}
          style={{
            position: 'absolute',
            left: '50%',
            marginLeft: -50,
          }}
        >
          Reference
        </Reference>
        <Tooltip ref={popper} dark>
          Tooltip
        </Tooltip>
      </ClippingParent>
    </>
  );
};
