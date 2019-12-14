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
import Highlight from './Highlight';

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
  font-size: 30px;
  -webkit-font-smoothing: antialasing;
  text-align: center;
  margin-bottom: 15px;
  margin-top: 40px;
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

const ExampleArea = styled.div`
  position: relative;
  width: 350px;
  height: 350px;
  background: #271d2f;
  border-radius: 20px;

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(255, 230, 157, 1);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;

const DotContainer = styled(ExampleArea)`
  text-align: center;
`;

const ScrollContainer = styled(ExampleArea)`
  overflow-y: scroll;

  &::after {
    content: '';
    display: block;
    width: 1px;
    height: 800px;
  }
`;

const ExampleBox = styled.article`
  background-color: #18111c;
  border-radius: 20px;
  display: grid;
  grid-template-columns: 350px auto;
  margin-bottom: 60px;
`;
const ExampleText = styled.div`
  padding: 20px;
  display: grid;
  align-items: center;
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

const placementExampleCode = `
import { createPopper } from '@popperjs/core';

createPopper(
  document.querySelector('#popcornbox'),
  document.querySelector('#tooltip'),
  {
    // top, right, bottom, left
    placement: clickedPlacement,
  }
)
`.trim();

const scrollContainerExampleCode = `
import { createPopper } from '@popperjs/core';

createPopper(
  document.querySelector('#popcornbox'),
  document.querySelector('#tooltip'),
  { placement: 'right', }
)
`.trim();

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

        <ExampleBox>
          <Example />
          <ExampleText>
            <p>Click on the dots to place the tooltip.</p>
            <Highlight code={placementExampleCode} />
          </ExampleText>
        </ExampleBox>

        <Heading>Overflow prevention</Heading>
        <ExampleBox>
          <ScrollExample />

          <ExampleText>
            <p>
              Scroll the container to watch the tooltip stay within the
              boundary.
            </p>
            <Highlight code={scrollContainerExampleCode} />
          </ExampleText>
        </ExampleBox>
      </Container>
    </MDXProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
