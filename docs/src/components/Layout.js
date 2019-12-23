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
import { Container, media } from './Framework';
import { MdxRoutes } from '@pauliescanlon/gatsby-mdx-routes';

import Navigation, { NAVIGATION_WIDTH, BLACKLIST } from './Navigation';
import './layout.css';
import './prism-base2tone-pool-dark.css';

const Main = styled.main`
  margin-left: 0;
  color: #333;
  padding-top: 45px;

  ${media.md} {
    padding-top: 0;
    margin-left: ${NAVIGATION_WIDTH}px;
  }
`;

const Footer = styled.footer`
  border-top: 1px solid #eee;
  padding: 25px 0;
  color: #aaa;
  text-align: center;

  ${media.md} {
    margin-left: ${NAVIGATION_WIDTH}px;
  }
`;

const NavButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  margin-top: 50px;
`;

const NavButtonContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${media.md} {
    flex-direction: row;
  }
`;

const PlaceholderNavButton = styled.a`
  padding: 50px 25px;
  width: 100%;
  border: none;
  pointer-events: none;
  display: none;

  ${media.md} {
    display: block;
  }
`;

const NavButton = styled(Link)`
  font-size: 25px;
  padding: 50px 25px;
  width: 100%;
  color: #c83b50;
  border-bottom: 0;

  ${media.md} {
    max-width: 50%;
  }

  &:last-of-type {
    text-align: right;
    border-bottom: 1px solid #eee;
    order: -1;

    ${media.md} {
      border-bottom: none;
      border-left: 1px solid #eee;
      order: initial;
    }
  }

  &:hover {
    background-color: #ffe9ec;
  }
`;

const NavButtonDirection = styled.span`
  position: relative;
  top: -1px;
  opacity: 0.7;
  font-size: 0.8em;

  &[data-prev] {
    margin-right: 20px;
  }

  &[data-next] {
    margin-left: 20px;
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
          body {
            background-color: #ffffff;
          }

          h1 {
            font-size: 40px;
            margin-top: 0;
            padding-top: 20px;
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
            border-bottom: 1px solid #ececec;
            padding-top: 20px;
            margin-bottom: 40px;
          }

          blockquote {
            margin: 0;
            padding: 0.5em 30px;
            border-radius: 0px 10px 10px 0px;
            background-color: #fff8d4;
            color: #c83b50;
            border-left: 3px dashed #c83b50;
          }

          ul {
            padding-left: 20px;
            line-height: 2;
          }

          a {
            text-decoration: none;
            color: #00a3ac;
            border-bottom: 2px solid #b7e7e5;
            padding-bottom: 1px;
            font-weight: bold;

            &:hover {
              background-color: #d9f6f4;
              border-bottom-color: #00a3ac;
            }

            &:active {
              border-bottom-style: dashed;
            }
          }
        `}
      />
      <div>
        <Navigation root="/" target="location" />
        <CarbonAds data-light style={{ float: 'right', marginLeft: 20 }} />
        <Main>
          <Container>{children}</Container>
          <MdxRoutes>
            {routes => {
              const { prev, next } = getPrevNextRoutes(routes);
              return (
                <NavButtonWrapper>
                  <NavButtonContainer>
                    {prev ? (
                      <NavButton to={prev.slug}>
                        <NavButtonDirection data-prev>Prev</NavButtonDirection>
                        {prev.title}
                      </NavButton>
                    ) : (
                      <PlaceholderNavButton />
                    )}
                    {next ? (
                      <NavButton to={next.slug}>
                        {next.title}
                        <NavButtonDirection data-next>Next</NavButtonDirection>
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
        <Footer>© {new Date().getFullYear()} MIT License</Footer>
      </div>
    </MDXProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
