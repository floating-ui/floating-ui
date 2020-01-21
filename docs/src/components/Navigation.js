import React, { useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { MdxRoutes } from '@pauliescanlon/gatsby-mdx-routes';
import { createTree } from '../utils/createTree';
import processRoutes from '../utils/processRoutes';
import { media } from './Framework';

import popperText from '../images/popper-text.svg';
import { Menu } from 'react-feather';

export const NAVIGATION_WIDTH = 260;

const Container = styled.div`
  background: #c83b50;
  position: fixed;
  top: 0;
  height: 100%;
  width: ${NAVIGATION_WIDTH}px;
  overflow: auto;
  transform: translateX(-${NAVIGATION_WIDTH}px);
  display: none;
  z-index: 2;
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
  margin-left: ${props => (props.root ? 0 : 15)}px;
  margin-top: 0;
  line-height: 1.5;

  ${props =>
    !props.root &&
    css`
      margin-left: 15px;
      border-left: 1px solid rgba(255, 200, 200, 0.5);
    `}
`;

const Item = styled(Link)`
  display: block;
  color: white;
  text-decoration: none;
  padding: 6px 15px;
  font-size: 18px;
  transition: background-color 0.1s;
  border-radius: 0 20px 20px 0;
  border: none;
  font-weight: 500;

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
  z-index: 2;

  ${media.lg} {
    display: none;
  }
`;

const PopperTextLogoContainer = styled.div`
  background: #c83b50;
  margin-top: -8px;
  width: 100%;
  position: sticky;
  top: 0;
  padding: 8px 0;
  transition: box-shadow 0.4s ease-out;
  display: none;

  ${media.lg} {
    display: block;
  }

  ${props =>
    props.scrolled &&
    css`
      box-shadow: 0 10px 15px -4px rgba(100, 0, 0, 0.3);
    `}
`;

const PopperTextLogo = ({ mobile }) => (
  <img
    src={popperText}
    draggable="false"
    alt="Popper Logo"
    css={css`
      display: block;
      margin: 0 auto;
      width: 100px;
      height: 50px;
      user-select: none;
      margin-top: ${mobile ? '-12px' : '0'};
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
  position: relative;
  top: 10px;
  left: 15px;
  display: block;
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
  padding: 0 10px 20px 0;
  margin-top: 20px;

  ${media.lg} {
    margin-top: 10px;
  }
`;

const Block = ({ route }) => (
  <>
    <Ul root>
      <li style={{ marginBottom: 0 }}>
        <Item
          to={route.slug}
          activeStyle={{
            backgroundColor: '#FFF',
            color: '#C83B50',
            fontWeight: 'bold',
          }}
        >
          {route.navigationLabel}
        </Item>
      </li>
      <Ul root={route.slug.split('/').length === 2}>
        {route.children.map((route, index) => (
          <Block key={index} route={route} />
        ))}
      </Ul>
    </Ul>
  </>
);

let scrollOffset = 0;

export default function Navigation({ description, lang, meta, path }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef();

  function openMenu() {
    setMenuOpen(true);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleScroll() {
    const scrollTop = menuRef.current.scrollTop;
    scrollOffset = scrollTop;
    setScrolled(scrollTop > 10);
  }

  useLayoutEffect(() => {
    const menu = menuRef.current;
    menu.scrollTop = scrollOffset;

    const currentItem = menu.querySelector('[aria-current="page"]');

    if (currentItem) {
      const rect = currentItem.getBoundingClientRect();

      if (rect.bottom > window.innerHeight || rect.top < 0) {
        currentItem.scrollIntoView();
      }
    }
  }, []);

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
          <Container open={menuOpen} ref={menuRef} onScroll={handleScroll}>
            <PopperTextLogoContainer scrolled={scrolled}>
              <PopperTextLogo />
            </PopperTextLogoContainer>
            <CloseMenuButton onClick={closeMenu}>Close Menu</CloseMenuButton>
            <MenuContents>
              {createTree(processRoutes(routes, path)).map((route, index) => (
                <Block route={route} key={index} />
              ))}
            </MenuContents>
          </Container>
        </>
      )}
    </MdxRoutes>
  );
}
