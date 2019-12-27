import React, { useState } from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { MdxRoutes } from '@pauliescanlon/gatsby-mdx-routes';
import { createTree } from '../utils/createTree';
import processRoutes from '../utils/processRoutes';
import { media } from './Framework';

import popperText from '../images/popper-text.svg';
import { Menu } from 'react-feather';

export const NAVIGATION_WIDTH = 250;

const Container = styled.div`
  background: #c83b50;
  padding: 10px 10px 20px;
  position: fixed;
  top: 0;
  height: 100vh;
  width: ${NAVIGATION_WIDTH}px;
  overflow: auto;
  transform: translateX(-${NAVIGATION_WIDTH}px);
  display: none;
  z-index: 1;
  box-shadow: 10px 0 20px -2px rgba(80, 0, 20, 0.2);

  ${props =>
    props.open &&
    css`
      display: block;
      transform: translateX(0);
    `}

  ${media.lg} {
    display: block;
    transform: translateX(0);
    box-shadow: none;
  }
`;

const Ul = styled.ul`
  list-style: none;
  padding: 0;
  padding-left: ${props => (props.root ? 0 : 15)}px;
  line-height: 1.5;
`;

const Item = styled(Link)`
  display: block;
  color: white;
  text-decoration: none;
  padding: 10px 15px 5px;
  text-transform: uppercase;
  font-size: 18px;
  font-family: 'Luckiest Guy', sans-serif;
  transition: background-color 0.1s;
  border-radius: 20px;
  border: none;
  -webkit-font-smoothing: antialiased;
  font-weight: normal;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
  }

  &:active {
    border-style: none;
  }
`;

const MobileHeader = styled.header`
  display: flex;
  justify-content: space-between;
  position: fixed;
  background-color: #c83b50;
  padding: 15px 0;
  height: 45px;
  width: 100%;
  z-index: 1;

  ${media.lg} {
    display: none;
  }
`;

const PopperTextLogo = ({ mobile }) => (
  <img
    src={popperText}
    draggable="false"
    alt="Popper Logo"
    css={css`
      display: block;
      position: absolute;
      left: 50%;
      top: 0;
      margin-left: -50px;
      width: 100px;
      height: 50px;
      display: ${mobile ? 'block' : 'none'};
      user-select: none;

      ${media.lg} {
        display: ${mobile ? 'none' : 'block'};
        margin-top: 8px;
      }
    `}
  />
);

const MenuButton = styled.button`
  position: fixed;
  border: none;
  color: white;
  font-weight: bold;
  top: 0;
  padding: 8px 15px;
  height: 45px;
  background-color: #c83b50;
  border-radius: 0 0 4px 4px;
`;

const CloseMenuButton = styled.button`
  background-color: white;
  color: #c83b50;
  border: none;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;

  ${media.lg} {
    display: none;
  }
`;

const MenuContents = styled.div`
  ${media.lg} {
    margin-top: 50px;
  }
`;

const Block = ({ route }) => (
  <>
    <Ul root>
      <li>
        <Item
          to={route.slug}
          activeStyle={{
            backgroundColor: '#FFF',
            color: '#C83B50',
            borderRadius: 20,
          }}
        >
          {route.title}
        </Item>
      </li>
      <Ul root={route.slug.split('/').length === 1}>
        {route.children.map((route, index) => (
          <Block key={index} route={route} />
        ))}
      </Ul>
    </Ul>
  </>
);

export default function Navigation({ description, lang, meta, title }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function openMenu() {
    setMenuOpen(true);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <MdxRoutes>
      {routes => (
        <>
          <MobileHeader>
            <MenuButton
              onClick={openMenu}
              aria-expanded={menuOpen ? 'true' : 'false'}
              aria-label="Click to open navigation menu"
            >
              <Menu size={30} />
            </MenuButton>
            <PopperTextLogo mobile />
          </MobileHeader>
          <Container open={menuOpen}>
            <PopperTextLogo />
            <CloseMenuButton onClick={closeMenu}>Close Menu</CloseMenuButton>
            <MenuContents>
              {createTree(processRoutes(routes)).map((route, index) => (
                <Block route={route} key={index} />
              ))}
            </MenuContents>
          </Container>
        </>
      )}
    </MdxRoutes>
  );
}
