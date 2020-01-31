import React, { useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { MdxRoutes } from '@pauliescanlon/gatsby-mdx-routes';
import { createTree } from '../utils/createTree';
import processRoutes from '../utils/processRoutes';
import { media } from './Framework';
import Docsearch from './Docsearch';
import popperText from '../images/popper-text.svg';
import { Menu } from 'react-feather';

export const NAVIGATION_WIDTH = 260;

const Container = styled.div`
  background: #c83b50;
  position: fixed;
  top: 0;
  height: 100%;
  width: ${NAVIGATION_WIDTH}px;
  transform: translateX(-${NAVIGATION_WIDTH}px);
  display: none;
  z-index: 2;
  box-shadow: 10px 0 20px -2px rgba(80, 0, 20, 0.2);

  ${props =>
    props.open &&
    css`
      display: flex;
      flex-direction: column;
      transform: translateX(0);
    `}

  ${media.lg} {
    display: flex;
    flex-direction: column;
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
  width: 100%;
  padding: 6px 0 0;
  display: none;

  ${media.lg} {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const PopperTextLogo = ({ mobile }) => (
  <Link
    to="/"
    css={css`
      display: block;
      margin: 0 auto;
      user-select: none;
      margin-top: ${mobile ? '-12px' : '0'};
      &,
      &:hover {
        border-width: 0;
      }
    `}
  >
    <img
      src={popperText}
      draggable="false"
      alt="Popper Logo"
      css={css`
        width: 100px;
        height: 50px;
      `}
    />
  </Link>
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
  display: block;
  background-color: white;
  color: #c83b50;
  border: none;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  margin: 10px 10px 0 10px;

  ${media.lg} {
    display: none;
  }
`;

const MenuContents = styled.div`
  overflow: auto;
  min-height: 0;
  flex: 1;
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
          <Container open={menuOpen}>
            <PopperTextLogoContainer>
              <PopperTextLogo />
            </PopperTextLogoContainer>
            <CloseMenuButton onClick={closeMenu}>Close Menu</CloseMenuButton>

            <Docsearch scrolled={scrolled} name="docs" />

            <MenuContents ref={menuRef} onScroll={handleScroll}>
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
