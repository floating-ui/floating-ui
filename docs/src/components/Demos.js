import React, { useRef, useLayoutEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { usePopper, Tooltip, Arrow } from './Popper';
import { ExampleArea } from './Landing';

const ClippingParentStyled = styled(ExampleArea)`
  overflow-y: scroll;
  height: 350px;
  margin: 0 auto;
  border: 2px dashed #ff6b81;
  background-color: #281e36;

  ${props =>
    props.scrollable &&
    css`
      &::before {
        content: '';
        display: block;
        height: 400px;
      }

      &::after {
        content: '';
        display: block;
        height: 550px;
      }
    `}
`;

const Reference = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  background: #b886fd;
  border: 2px solid #b886fd;
  color: black;
  font-weight: bold;
`;

const ClippingParent = props => {
  const scrollRef = useRef();

  useLayoutEffect(() => {
    scrollRef.current.scrollTop = 300;
  }, []);

  return <ClippingParentStyled ref={scrollRef} {...props} />;
};

export const ArrowDemo = () => {
  const { reference, popper } = usePopper({ placement: 'right' });

  return (
    <>
      <ClippingParent scrollable>
        <Reference
          ref={reference}
          css={css`
            position: absolute;
            left: 15px;
          `}
        >
          Reference
        </Reference>
        <Tooltip ref={popper}>
          <div
            css={css`
              display: grid;
              place-items: center;
              height: 200px;
              width: 100px;
            `}
          ></div>
          <Arrow data-popper-arrow />
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
          css={css`
            position: absolute;
            left: 50%;
            margin-left: -75px;
          `}
        >
          Reference
        </Reference>
      </ClippingParent>
      <Tooltip ref={popper} hide>
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
      <Tooltip ref={popper}>Tooltip</Tooltip>
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
          css={css`
            position: absolute;
            top: 10px;
            left: 10px;
          `}
        >
          Reference
        </Reference>
        <Tooltip ref={popper}>Tooltip wider than its reference</Tooltip>
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
          css={css`
            position: absolute;
            left: 50%;
            margin-left: -75px;
          `}
        >
          Reference
        </Reference>
        <Tooltip ref={popper}>Tooltip</Tooltip>
      </ClippingParent>
    </>
  );
};

export const VirtualElementDemo = () => {
  const { reference, popper, instance } = usePopper({
    placement: 'right-start',
    modifiers: [
      {
        name: 'flip',
        enabled: false,
      },
      {
        name: 'preventOverflow',
        options: {
          tether: false,
          altAxis: true,
        },
      },
    ],
  });

  if (!reference.current) {
    reference.current = {
      getBoundingClientRect: generateGetBoundingClientRect(),
    };
  }

  function generateGetBoundingClientRect(x = 0, y = 0) {
    return () => ({
      width: 0,
      height: 0,
      top: y,
      right: x,
      bottom: y,
      left: x,
    });
  }

  function handleMouseMove({ clientX: x, clientY: y }) {
    const getBoundingClientRect = generateGetBoundingClientRect(x, y);
    reference.current.getBoundingClientRect = getBoundingClientRect;
    instance.current.update();
  }

  useLayoutEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  });

  return (
    <ClippingParent scrollable>
      <Tooltip ref={popper}>Tooltip</Tooltip>
    </ClippingParent>
  );
};
