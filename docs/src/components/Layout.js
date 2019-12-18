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
import { Global, css } from '@emotion/core';

import Navigation from './Navigation';
import './layout.css';
import './prism-base2tone-pool-dark.css';

const components = {
  a: ({ href, ...props }) => <Link to={href} {...props} />,
};

const Layout = ({ children }) => {
  return (
    <MDXProvider components={components}>
      <Global
        styles={{
          body: {
            backgroundColor: '#ffffff',
          },
        }}
      />
      <div css={{ display: 'flex' }}>
        <Navigation root="/" target="location" />

        <div
          css={{
            maxWidth: 960,
            margin: '0 auto',
            padding: `0px 1.0875rem 1.45rem`,
            paddingTop: 0,
            flex: 1,
            color: '#222222',
          }}
        >
          <main>{children}</main>
          <footer>
            © {new Date().getFullYear()}, Built with
            {` `}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </footer>
        </div>
      </div>
    </MDXProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
