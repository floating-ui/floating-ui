import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'gatsby';
import { css } from '@emotion/core';

export const sizes = {
  xs: 360,
  sm: 600,
  md: 768,
  lg: 992,
  xl: 1200,
};

export const media = Object.keys(sizes).reduce((acc, size) => {
  acc[size] = `@media (min-width: ${sizes[size]}px)`;
  return acc;
}, {});

export const Container = styled.div`
  padding: 0 15px;
  max-width: ${props => props.maxWidth || 900}px;
  margin: 0 auto;

  ${media.sm} {
    padding: 0 25px;
  }

  ${media.md} {
    padding: 0 40px;
  }
`;

export const Footer = styled.footer`
  text-align: center;
  background-color: #1c1428;
  padding: 25px 0;
  color: #8e72b4;
`;

const linkCss = css`
  color: #ffe69d;
  text-decoration: none;
  padding-bottom: 1px;
  border-bottom: 2px solid rgba(255, 228, 148, 0.25);
  transition: border-bottom-color 0.15s ease-in-out;

  &:hover {
    border-bottom: 2px solid rgba(255, 228, 148, 1);
  }

  &:active {
    border-bottom-style: dashed;
  }
`;

export const LinkStyled = props => <Link {...props} css={linkCss} />;
export const ExternalLinkStyled = ({ to, ...props }) => (
  <a
    {...props}
    href={to}
    css={linkCss}
    rel="noopener noreferrer"
    target="_blank"
  >
    {/* jsx-a11y/anchor-has-content doesn't infer `children` */}
    {props.children}
  </a>
);
