import React from 'react';
import styled from 'emotion';
import popperLogo from '../images/popper-logo.svg';
import stripes from '../images/stripes.svg';

import { media } from './Framework';

const HeaderStyled = styled.header`
  background-image: url(${stripes}),
    radial-gradient(400px, #fff, #fff1e1 20%, #ffa0b1);
  text-align: center;
  padding: 50px 25px;
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
  color: #c83b50;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  height: 25px;
  font-size: 6vw;

  ${media.sm} {
    font-size: 36px;
  }
`;

const SubSlogan = styled.p`
  color: #642f45;
  font-size: 22px;
  font-weight: bold;
  font-style: italic;
  margin-bottom: 0;
`;

const Header = () => (
  <HeaderStyled>
    <Logo src={popperLogo} alt="Popper logo" draggable="false" />
    <Slogan>Tooltip Positioning Engine</Slogan>
    <SubSlogan>Includes popovers, drop-downs, and more</SubSlogan>
  </HeaderStyled>
);

export default Header;
