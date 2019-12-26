/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';
import CarbonAds from './CarbonAds';
import { Container, media, Footer } from './Framework';
import { MdxRoutes } from '@pauliescanlon/gatsby-mdx-routes';

import Navigation, { NAVIGATION_WIDTH, BLACKLIST } from './Navigation';
import './layout.css';
import './prism-base2tone-pool-dark.css';
import { ChevronRight, ChevronLeft } from 'react-feather';

const Main = styled.main`
  margin-left: 0;
  padding-top: 45px;

  ${media.lg} {
    padding-top: 0;
    margin-left: ${NAVIGATION_WIDTH}px;
  }
`;

const FooterStyled = styled(Footer)`
  background: none;
  border-top: 1px solid #44395d;

  ${media.lg} {
    margin-left: ${NAVIGATION_WIDTH}px;
  }
`;

const NavButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #44395d;
  margin-top: 50px;
`;

const NavButtonContainer = styled(Container)`
  display: flex;
  width: 100%;
  padding: 0;

  ${media.md} {
    padding: 0 40px;
  }
`;

const PlaceholderNavButton = styled.a`
  padding: 50px 25px;
  border: none;
  min-width: 50%;
  pointer-events: none;
`;

const NavDivider = styled.div`
  min-width: 1px;
  background: #44395d;
  height: 100%;
`;

const NavButton = styled(Link)`
  position: relative;
  font-size: 22px;
  padding: 50px 40px;
  color: #4edee5;
  border-bottom: 2px solid transparent;
  transition: none;
  border-bottom: 2px solid transparent;
  flex-grow: 1;

  ${media.md} {
    width: 100%;
  }

  ${media.lg} {
    font-size: 24px;
  }

  &:last-of-type {
    border-bottom-color: transparent;
    text-align: right;
  }

  &:hover {
    background-color: #281e36;
    border-bottom-color: #4edee5;
  }

  &:active {
    border-bottom-style: dashed;
  }
`;

const NavButtonDirection = styled.span`
  position: absolute;
  top: 54px;

  ${media.lg} {
    top: 56px;
  }

  &[data-prev] {
    left: 10px;
  }

  &[data-next] {
    right: 10px;
  }
`;

const components = {
  a: ({ href, ...props }) => <Link to={href} {...props} />,
};

const Layout = ({ children, path }) => {
  function getPrevNextRoutes(routes) {
    const validRoutes = routes
      .filter(
        route => !BLACKLIST.includes(route) && route.slug.includes('modifiers')
      )
      .map(route => ({
        ...route,
        slug: route.slug.replace(/\/$/, ''),
      }));

    const slashlessPath = path.replace(/\/$/, '');

    const currentPathIndex = validRoutes
      .sort((a, b) => a.index - b.index)
      .findIndex(route => route.slug === slashlessPath);

    return {
      prev: validRoutes[currentPathIndex - 1],
      next: validRoutes[currentPathIndex + 1],
    };
  }

  return (
    <MDXProvider components={components}>
      <Global
        styles={css`
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            color: #f4e0f1;
          }

          h1 {
            font-size: 40px;
            margin-top: 0;
            padding-top: 20px;
            line-height: 1.1;
          }

          h2 {
            font-size: 32px;
          }

          h3 {
            font-size: 24px;
            margin-bottom: 10px;
            margin-top: 40px;
          }

          h4 {
            font-size: 20px;
            margin-bottom: 10px;
          }

          h5 {
            font-size: 18px;
          }

          h2::before {
            content: ' ';
            display: block;
            border-bottom: 1px solid #44395d;
            padding-top: 20px;
            margin-bottom: 40px;
          }

          blockquote {
            margin: 0;
            padding: 0.5em 30px;
            border-radius: 0px 10px 10px 0px;
            background-color: rgba(135, 82, 27, 0.25);
            color: #ddc5a1;
            border-left: 2px dashed #ddc5a1;
          }

          h3 > code[class*='language-'] {
            color: #ffe69d;
          }

          ul {
            padding-left: 20px;
            line-height: 2;
          }

          a {
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
          }

          ${media.md} {
            pre[class*='language-'] {
              padding: 15px 20px;
            }
          }
        `}
      />
      <div>
        <Navigation root="/" target="location" />
        <Main>
          <Container>
            {children}
            <CarbonAds />
          </Container>
          <MdxRoutes>
            {routes => {
              const { prev, next } = getPrevNextRoutes(routes);
              return (
                <NavButtonWrapper>
                  <NavButtonContainer>
                    {prev ? (
                      <NavButton to={prev.slug}>
                        <NavButtonDirection data-prev>
                          <ChevronLeft size={28} />
                        </NavButtonDirection>
                        {prev.title}
                      </NavButton>
                    ) : (
                      <PlaceholderNavButton />
                    )}
                    <NavDivider />
                    {next ? (
                      <NavButton to={next.slug}>
                        {next.title}
                        <NavButtonDirection data-next>
                          <ChevronRight size={28} />
                        </NavButtonDirection>
                      </NavButton>
                    ) : (
                      <PlaceholderNavButton />
                    )}
                  </NavButtonContainer>
                </NavButtonWrapper>
              );
            }}
          </MdxRoutes>
        </Main>
        <FooterStyled>© {new Date().getFullYear()} MIT License</FooterStyled>
      </div>
    </MDXProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
