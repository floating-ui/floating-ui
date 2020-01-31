/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useState, useLayoutEffect, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import styled from '@emotion/styled';
import {
  Crop,
  Layers,
  Heart,
  Check,
  ChevronRight,
  CloudLightning,
  Move,
  ArrowUp,
  ArrowDown,
} from 'react-feather';
import Highlight from './Highlight';
import CarbonAds from './CarbonAds';
import SEO from './Seo';

import Header from './Header';
import InstallBar from './InstallBar';
import { Container, LinkStyled, media, Footer, sizes } from './Framework';
import { usePopper, Tooltip, Arrow } from './Popper';
import { ProductCard, Grid } from './ProductCard';

import microsoftLogo from '../images/logos/microsoft.svg';
import atlassianLogo from '../images/logos/atlassian.svg';
import bootstrapLogo from '../images/logos/bootstrap.svg';
import drupalLogo from '../images/logos/drupal.svg';
import gitlabLogo from '../images/logos/gitlab.svg';
import mediumLogo from '../images/logos/medium.svg';
import adobeLogo from '../images/logos/adobe.svg';

import 'modern-normalize';
import './layout.css';
import './prism-base2tone-pool-dark.css';

import popcornBox from '../images/popcorn-box.svg';
import { css } from '@emotion/core';

const UsedByContainer = styled.div`
  margin-top: 40px;
`;

const UsedByLogo = styled(props => (
  <a
    href={props.href}
    target="_blank"
    className={props.className}
    title={props.alt}
    rel="noopener noreferrer"
  >
    <img src={props.src} alt={props.alt} />
  </a>
))`
  opacity: 0.2;
  transition: opacity 0.2s ease-in-out;
  &:hover {
    opacity: 1;
  }
  img {
    height: 40px;
    margin: 10px;
  }
`;

const Button = styled.a`
  display: inline-block;
  background: white;
  padding: 10px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 700;
  margin-top: 10px;
  color: #c83b50;
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;

  &:hover {
    background: #c73a50;
    color: white;
    border-color: #c73a50;
  }
`;

const Heading = styled.h3`
  font-family: 'Luckiest Guy', sans-serif;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 30px;
  -webkit-font-smoothing: antialiased;
  margin-top: 15px;
  margin-bottom: 15px;
  line-height: 1.1;
  color: #f4e0f1;
`;

const PopcornBox = forwardRef((props, ref) => (
  <img
    ref={ref}
    alt="Popcorn box"
    {...props}
    css={css`
      position: relative;
      left: 50%;
      width: 134px;
      height: 120px;
      margin-left: -67px;
      transform: scale(0.8);

      ${media.sm} {
        transform: scale(1);
      }
    `}
  />
));

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
  width: 50px;
  height: 50px;
  padding: 0;
  border: none;
  background: none;
  transition: transform 0.4s cubic-bezier(0.54, 1.5, 0.38, 1.2);
  cursor: pointer;
  outline: 0;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;

  &:focus > div {
    box-shadow: 0 0 0 6px rgba(255, 100, 150, 0.4);
  }

  &:hover {
    transform: scale(1.5);
  }

  &[data-placement^='top'] {
    top: 0;
    left: 50%;
    margin-left: -25px;
  }

  &[data-placement^='bottom'] {
    bottom: 0;
    left: 50%;
    margin-left: -25px;
  }

  &[data-placement='top-start'],
  &[data-placement='bottom-start'] {
    left: calc(50% - 50px);
  }

  &[data-placement='top-end'],
  &[data-placement='bottom-end'] {
    left: calc(50% + 50px);
  }

  &[data-placement^='right'] {
    right: 0;
    top: 50%;
    margin-top: -25px;
  }

  &[data-placement^='left'] {
    left: 0;
    top: 50%;
    margin-top: -25px;
  }

  &[data-placement='left-start'],
  &[data-placement='right-start'] {
    top: calc(50% - 50px);
  }

  &[data-placement='left-end'],
  &[data-placement='right-end'] {
    top: calc(50% + 50px);
  }
`;

const Dot = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid #ff6b81;
  background: ${props => (props.selected ? '#ff6b81' : 'transparent')};
  border-radius: 50%;
`;

const Section = styled.section`
  background-color: #281e36;
  padding: 40px 0;
  font-size: 16px;
  text-align: center;

  ${media.lg} {
    font-size: 18px;
    padding: 50px 0;
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid #362c4f;
  }
`;

export const ExampleArea = styled.div`
  position: relative;
  width: 100%;
  scrollbar-color: rgba(255, 230, 157, 1) transparent;
  border-radius: 10px;

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
  height: 350px;
  text-align: center;
  margin: 0 auto;

  ${media.lg} {
    height: 450px;
  }
`;

export const ScrollContainer = styled(ExampleArea)`
  overflow-y: scroll;
  overscroll-behavior: contain;
  height: 350px;
  margin: 0 auto;
  border: 2px dashed #ff6b81;
  background-color: #281e36;

  ${media.lg} {
    height: 450px;
  }

  &::before {
    content: '';
    display: block;
    width: 1px;
    height: 600px;
  }

  &::after {
    content: '';
    display: block;
    width: 1px;
    height: 600px;
  }
`;

const ExampleBox = styled.article`
  padding: 40px 0;
  display: flex;
  flex-direction: column-reverse;

  &:not(:last-of-type) {
    border-bottom: 1px solid #44395d;
  }

  ${media.lg} {
    display: grid;
    grid-template-columns: 2fr 3fr;
    align-items: start;
    font-size: 17px;
    padding: 50px 0;
  }

  strong {
    color: #ff6b81;
  }

  p {
    margin-top: 0;
  }
`;

const ExampleText = styled.div`
  padding: 20px 0 0;
  display: grid;
  align-items: center;
  margin-bottom: 20px;

  ${media.lg} {
    padding: 0 40px;
    margin-bottom: 0;
  }
`;

const Ul = styled.ul`
  padding-left: 20px;
  list-style: none;
  margin-top: 0;
  text-align: left;
`;

const Li = styled.li`
  svg {
    display: inline-block;
    top: 6px;
    left: 2px;
    margin-right: 6px;
    position: relative;
    color: #ff6b81;
    height: 25px;
    margin-left: -30px;
  }

  strong {
    color: #ff6b81;
  }

  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
`;

const components = {
  a: ({ href, ...props }) => <Link to={href} {...props} />,
};

const PlacementExample = () => {
  const [placement, setPlacement] = useState('top');
  const { reference, popper } = usePopper({
    placement,
    modifiers: [
      {
        name: 'flip',
        enabled: false,
      },
      // left/right placements on mobile
      {
        name: 'preventOverflow',
        options: {
          rootBoundary: 'document',
        },
      },
    ],
  });

  const code = `
import { createPopper } from '@popperjs/core';

const popcorn = document.querySelector('#popcorn');
const tooltip = document.querySelector('#tooltip');

createPopper(popcorn, tooltip, {
  placement: '${placement}',
});`;

  return (
    <ExampleBox>
      <DotContainer>
        {['top', 'right', 'bottom', 'left']
          .reduce(
            (placements, basePlacement) => [
              ...placements,
              // clockwise tabbing order
              ...(['bottom', 'left'].indexOf(basePlacement) >= 0
                ? [
                    `${basePlacement}-end`,
                    basePlacement,
                    `${basePlacement}-start`,
                  ]
                : [
                    `${basePlacement}-start`,
                    basePlacement,
                    `${basePlacement}-end`,
                  ]),
            ],
            []
          )
          .map(p => (
            <DotHitArea
              key={p}
              onClick={() => setPlacement(p)}
              onMouseDown={() => setPlacement(p)}
              data-placement={p}
              selected={placement === p}
            >
              <Dot selected={placement === p} />
            </DotHitArea>
          ))}
        <PopcornBox
          ref={reference}
          src={popcornBox}
          css={css`
            position: absolute;
            top: 50%;
            margin-top: -60px;
          `}
        />
        <Tooltip ref={popper}>
          <TooltipName data-small>Tip</TooltipName>
          <TooltipName>Popcorn</TooltipName>
          <Arrow data-popper-arrow />
        </Tooltip>
      </DotContainer>
      <ExampleText>
        <Heading>
          <Move /> Placement
        </Heading>
        <p>
          <strong>Click on the dots</strong> to place the tooltip. There are 12
          different placements to choose from.
        </p>
        <Highlight code={code} />
      </ExampleText>
    </ExampleBox>
  );
};

const PreventOverflowExample = () => {
  const scrollContainerRef = useRef();

  const { reference, popper } = usePopper({
    placement: 'right',
  });

  useLayoutEffect(() => {
    scrollContainerRef.current.scrollTop =
      window.innerWidth <= sizes.lg ? 490 : 450;
  }, []);

  const code = `
import { createPopper } from '@popperjs/core';

const popcorn = document.querySelector('#popcorn');
const tooltip = document.querySelector('#tooltip');

createPopper(popcorn, tooltip, {
  placement: 'right',
});
`;

  return (
    <ExampleBox>
      <ScrollContainer ref={scrollContainerRef}>
        <PopcornBox
          ref={reference}
          src={popcornBox}
          css={css`
            position: absolute;
            left: 100px;
          `}
        />
        <Tooltip ref={popper}>
          <TooltipName>Popcorn</TooltipName>
          <TooltipName>sizes</TooltipName>
          <TooltipName>&amp; Price</TooltipName>

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
      <ExampleText>
        <Heading>
          <Crop /> Overflow prevention
        </Heading>
        <p>
          <strong>Scroll the container</strong> (or the whole page) to see the
          tooltip stay within the boundary. Once the opposite edges of the
          popcorn and tooltip are aligned, the tooltip is allowed to overflow to
          prevent detachment.
        </p>
        <Highlight code={code} />
      </ExampleText>
    </ExampleBox>
  );
};

const FlipExample = () => {
  const { reference, popper } = usePopper({ placement: 'bottom' });
  const scrollContainerRef = useRef();

  useLayoutEffect(() => {
    scrollContainerRef.current.scrollTop =
      window.innerWidth <= sizes.lg ? 490 : 450;
  }, []);

  const code = `
import { createPopper } from '@popperjs/core';

const popcorn = document.querySelector('#popcorn');
const tooltip = document.querySelector('#tooltip');

createPopper(popcorn, tooltip);
`;

  return (
    <ExampleBox>
      <ScrollContainer ref={scrollContainerRef}>
        <PopcornBox ref={reference} src={popcornBox} />
        <Tooltip ref={popper}>
          <TooltipName>Popcorn</TooltipName>
          <TooltipPrice>New Item</TooltipPrice>

          <Arrow data-popper-arrow />
        </Tooltip>
      </ScrollContainer>
      <ExampleText>
        <Heading>
          <ArrowUp />
          <ArrowDown /> Flipping
        </Heading>
        <p>
          <strong>Scroll the container</strong> (or the whole page) to see the
          tooltip flip to the opposite side once it's about to overflow the
          visible area. Once enough space is detected on its preferred side, it
          will flip back.
        </p>
        <Highlight code={code} />
      </ExampleText>
    </ExampleBox>
  );
};

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query LandingTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <MDXProvider components={components}>
      <SEO title="Home" />
      <Header siteTitle={data.site.siteMetadata.title} />
      <InstallBar />
      <CarbonAds />

      <Container maxWidth={1400}>
        <PlacementExample />
        <PreventOverflowExample />
        <FlipExample />
      </Container>

      <Section>
        <Container>
          <Crop size={50} stroke="#ffe69d" />
          <Heading>In a nutshell, Popper:</Heading>
          <Ul>
            <Li>
              <Check />
              <strong>
                Places your tooltip or popover relative to the reference
              </strong>{' '}
              taking into account their sizes, and positions its arrow centered
              to the reference.
            </Li>
            <Li>
              <Check />
              <strong>
                Takes into account the many different contexts it can live in
              </strong>{' '}
              relative to the reference (different offsetParents, different or
              nested scrolling containers).
            </Li>
            <Li>
              <Check />
              <strong>
                Keeps your tooltip or popover in view as best as possible
              </strong>
              . It prevents it from being clipped or cut off (overflow
              prevention) and changes the placement if the original does not fit
              (flipping).
            </Li>
          </Ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <Layers size={50} stroke="#ffe69d" />
          <Heading>Granular configuration with sensible defaults</Heading>
          <p>
            Popper aims to "just work" without you needing to configure much. Of
            course, there are cases where you need to configure Popper beyond
            its defaults – in these cases, Popper shines by offering high
            granularity of configuration to fine-tune the position or behavior
            of your popper.
          </p>
          <p>
            You can extend Popper with your own modifiers (or plugins) to make
            your popper work for you, no matter how advanced the scenario.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <Check size={50} stroke="#ffe69d" />
          <Heading>No compromises</Heading>
          <Ul>
            <Li>
              <Check />
              <strong>No detachment</strong>. Position updates take less than a
              millisecond on average devices. Popper doesn't debounce the
              positioning updates of the tooltip to the point where it will{' '}
              <em>ever</em> detach from its reference, but this doesn't come at
              the cost of poor performance.
            </Li>
            <Li>
              <Check />
              <strong>
                You don't have to change the DOM context of your tooltip or
                popover element
              </strong>
              ; it will work no matter where your popper and reference elements
              live, even in the most complex scenarios like nested scrolling
              containers or alternative offsetParent contexts.
            </Li>
            <Li>
              <Check />
              <strong>Still lightweight</strong>. Handling all of this
              complexity is still done in an efficient manner. The base Popper
              is only 2 kB minzipped.
            </Li>
          </Ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <CloudLightning size={50} stroke="#ffe69d" />
          <Heading>UI Tools Using Popper</Heading>
          <p>
            Looking for some real life examples of UI Kits, Dashboards and
            Design Systems that are implementing Popper? Try these hand picked
            Free & Premium products!
          </p>

          <Grid>
            <ProductCard
              title="Argon Dashboard PRO"
              description="Premium Bootstrap 4 Admin - $79"
              image="https://raw.githack.com/creativetimofficial/public-assets/master/argon-dashboard-pro/argon-dashboard-pro.jpg"
              url="https://www.creative-tim.com/product/argon-dashboard-pro?ref=popper.js.org"
            />

            <ProductCard
              title="Material Dashboard PRO"
              description="Premium Bootstrap 4 Material Admin - $49"
              image="https://raw.githack.com/creativetimofficial/public-assets/master/material-dashboard-pro-html/opt_mdp_thumbnail.jpg"
              url="https://www.creative-tim.com/product/material-dashboard-pro?ref=popper.js.org"
            />

            <ProductCard
              title="Now UI Dashboard PRO"
              description="Premium Bootstrap 4 Admin - $49"
              image="https://raw.githack.com/creativetimofficial/public-assets/master/now-ui-dashboard-pro/now-ui-dashboard-pro.jpg"
              url="https://www.creative-tim.com/product/now-ui-dashboard-pro?ref=popper.js.org"
            />
          </Grid>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heart size={50} stroke="#ffe69d" />
          <Heading>Free open-source, used by millions</Heading>
          <p>
            Popper has billions of hits across the web, is trusted by millions
            of developers in production, and used in popular libraries like
            Bootstrap and Material UI.
          </p>
          <Button
            href="https://opencollective.com/popperjs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support us
          </Button>
          <UsedByContainer>
            <UsedByLogo
              href="https://microsoft.com/"
              src={microsoftLogo}
              alt="Used by Microsoft - Fluent UI"
            />
            <UsedByLogo
              href="https://www.atlassian.com/"
              src={atlassianLogo}
              alt="Used by Atlassian - Atlaskit"
            />
            <UsedByLogo
              href="https://getbootstrap.com/"
              src={bootstrapLogo}
              alt="Used by Bootstrap"
            />
            <UsedByLogo
              href="https://www.adobe.com/"
              src={adobeLogo}
              alt="Used by Adobe - @webspectrum components"
            />
            <UsedByLogo
              href="https://www.drupal.org/"
              src={drupalLogo}
              alt="Used by Drupal"
            />
            <UsedByLogo
              href="https://www.gitlab.com/"
              src={gitlabLogo}
              alt="Used by GitLab"
            />
            <UsedByLogo
              href="https://www.medium.com/"
              src={mediumLogo}
              alt="Used by Medium - text selection tooltip"
            />
          </UsedByContainer>
        </Container>
      </Section>

      <Section>
        <Container>
          <ChevronRight size={50} stroke="#ffe69d" />
          <Heading>Ready to start?</Heading>
          <p>
            Start reading{' '}
            <LinkStyled to="/docs/">Popper's documentation</LinkStyled>!
          </p>
        </Container>
      </Section>

      <Footer>
        <Container>
          <p>© {new Date().getFullYear()} MIT License</p>
        </Container>
      </Footer>
    </MDXProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
