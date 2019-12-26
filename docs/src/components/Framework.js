import styled from '@emotion/styled';

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
