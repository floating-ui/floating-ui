import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'gatsby';
import popperLogo from '../images/popper-logo.svg';
import stripes from '../images/stripes.svg';

import { media } from './Framework';
import { GitHub } from 'react-feather';
import { css } from '@emotion/core';

const HeaderStyled = styled.header`
  background-image: url(${stripes}),
    radial-gradient(400px, #fff, #fff1e1 20%, #ffa0b1);
  text-align: center;
  padding: 60px 25px 50px;
  background-size: cover;
  background-position: center 60%;
`;

const Logo = styled.img`
  height: 200px;
  user-select: none;
  margin-bottom: 25px;
`;

const Slogan = styled.h2`
  margin: 0 auto;
  max-width: 100%;
  font-family: 'Luckiest Guy', sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #c83b50;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 30px;
  line-height: 1.1;
  margin-bottom: -15px;

  ${media.sm} {
    font-size: 36px;
  }
`;

const SubSlogan = styled.p`
  color: #642f45;
  font-size: 22px;
  font-weight: bold;
  font-style: italic;
  margin-bottom: 20px;
  line-height: 1.2;
`;

const buttonCss = css`
  display: inline-block;
  background: white;
  padding: 10px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 700;
  margin-top: 10px;
  color: #c83b50;
  box-shadow: 0 8px 16px -4px rgba(200, 59, 80, 0.5);
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;

  &:hover {
    background: #c73a50;
    color: white;
    border-color: #c73a50;
  }
`;

const DocsLink = styled(Link)`
  position: absolute;
  top: 0;
  right: 0;
  margin: 0 15px;
`;

const Header = () => (
  <HeaderStyled>
    <DocsLink css={buttonCss} to="/docs">
      Documentation
    </DocsLink>
    <Logo src={popperLogo} alt="Popper logo" draggable="false" />
    <Slogan>Tooltip Positioning Engine</Slogan>
    <SubSlogan>Includes popovers, drop-downs, and more</SubSlogan>
    <a
      css={buttonCss}
      href="https://github.com/popperjs/popper.js"
      rel="nofollow noreferrer"
    >
      <GitHub style={{ verticalAlign: -7, marginRight: 5 }} /> Star on GitHub
    </a>
  </HeaderStyled>
);

export default Header;
