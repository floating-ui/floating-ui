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
import CarbonAds from './CarbonAds';

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
        styles={css`
          body {
            background-color: #ffffff;
          }

          h2::before {
            content: ' ';
            display: block;
            border-bottom: 1px solid #ececec;
            padding-top: 44px;
            margin-bottom: 40px;
          }

          blockquote {
            margin: 0;
            padding: 1em 40px;
            border-radius: 2px 20px 20px 2px;
            background-color: #f3f3f3;
          }
        `}
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
          <CarbonAds data-light style={{ float: 'right', marginLeft: 20 }} />
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
