/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import styled from 'styled-components';

import Header from './Header';
import InstallBar from './InstallBar';
import { Container } from './Framework';
import { usePopper, Tooltip, Arrow } from './Popper';

import './layout.css';
import './prism-base2tone-pool-dark.css';
import 'modern-normalize';

import popcornBox from '../images/popcorn-box.svg';

const Heading = styled.h3`
  font-family: 'Luckiest Guy', sans-serif;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-size: 40px;
  -webkit-font-smoothing: antialasing;
  text-align: center;
  margin-bottom: 15px;
`;

const ExampleText = styled.p`
  text-align: center;
`;

const PopcornBox = styled.img`
  position: absolute;
  width: 120px;
  height: 120px;
  top: 50%;
  left: 50%;
  margin-left: -60px;
  margin-top: -60px;
`;

const TooltipName = styled.div`
  font-weight: 900;
  text-transform: uppercase;
`;

const TooltipPrice = styled.div`
  font-weight: normal;
`;

const DotHitArea = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 60px;
  height: 60px;
  padding: 0;
  border: none;
  display: ${props => (props.hidden ? 'none' : '')};
  background: none;
  transition: transform 0.4s cubic-bezier(0.54, 1.5, 0.38, 1.2);
  cursor: pointer;

  &:hover {
    transform: scale(1.25);
  }

  &[data-placement^='top'] {
    top: 0;
    left: 50%;
    margin-left: -30px;
  }

  &[data-placement^='right'] {
    right: 0;
    top: 50%;
    margin-top: -30px;
  }

  &[data-placement^='bottom'] {
    bottom: 0;
    left: 50%;
    margin-left: -30px;
  }

  &[data-placement^='left'] {
    left: 0;
    top: 50%;
    margin-top: -30px;
  }
`;

const Dot = styled.div`
  width: 20px;
  height: 20px;
  background: #ffe69d;
  border-radius: 50%;
  border: none;
`;

const DotContainer = styled.div`
  position: relative;
  width: 275px;
  height: 250px;
  text-align: center;
  margin: 0 auto;
`;

const ScrollContainer = styled.div`
  position: relative;
  overflow-y: scroll;
  width: 350px;
  height: 350px;
  background: rgba(0, 0, 0, 0.2);
  margin: 0 auto;

  &::after {
    content: '';
    display: block;
    width: 1px;
    height: 800px;
  }
`;

const components = {
  a: ({ href, ...props }) => <Link to={href} {...props} />,
};

const Example = () => {
  const [placement, setPlacement] = useState('right');
  const { reference, popper } = usePopper({
    placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [10, 0],
        },
      },
    ],
  });

  return (
    <DotContainer>
      {['top', 'right', 'bottom', 'left'].map(p => (
        <DotHitArea
          key={p}
          onClick={() => setPlacement(p)}
          onMouseDown={() => setPlacement(p)}
          data-placement={p}
          hidden={placement === p}
        >
          <Dot />
        </DotHitArea>
      ))}
      <PopcornBox ref={reference} src={popcornBox} />
      <Tooltip ref={popper}>
        <TooltipName>Popcorn</TooltipName>
        <TooltipPrice>New item</TooltipPrice>
        <Arrow data-popper-arrow />
      </Tooltip>
    </DotContainer>
  );
};

const ScrollExample = () => {
  const { reference, popper } = usePopper({
    placement: 'right',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [10, 0],
        },
      },
      {
        name: 'preventOverflow',
        options: {
          tether: 'edges',
        },
      },
    ],
  });

  return (
    <ScrollContainer>
      <PopcornBox ref={reference} src={popcornBox} />
      <Tooltip ref={popper}>
        <TooltipName>Popcorn</TooltipName>
        <TooltipName>Sizes</TooltipName>
        <TooltipName>Price</TooltipName>

        <TooltipPrice>XXS: $1.99</TooltipPrice>
        <TooltipPrice>XS: $2.99</TooltipPrice>
        <TooltipPrice>S: $3.99</TooltipPrice>
        <TooltipPrice>M: $4.99</TooltipPrice>
        <TooltipPrice>L: $5.99</TooltipPrice>
        <TooltipPrice>XL: $6.99</TooltipPrice>
        <TooltipPrice>XXL: $7.99</TooltipPrice>

        <Arrow data-popper-arrow />
      </Tooltip>
    </ScrollContainer>
  );
};

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <MDXProvider components={components}>
      <Header siteTitle={data.site.siteMetadata.title} />
      <InstallBar />
      <Container>
        <Heading>Placement</Heading>
        <ExampleText>Click on the dots to place the tooltip</ExampleText>
        <Example />

        <Heading>Overflow prevention</Heading>
        <ExampleText>
          Scroll the container to watch the tooltip stay within the boundary
        </ExampleText>
        <ScrollExample />
      </Container>
    </MDXProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
