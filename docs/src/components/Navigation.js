import React, { Fragment } from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { MdxRoutes } from '@pauliescanlon/gatsby-mdx-routes';
import { createTree } from '../utils/createTree';

const BLACKLIST = ['/404'];

const Container = styled.div`
  background: #c83b50;
  padding: 20px 10px;
  position: fixed;
  height: 100vh;
  width: 250px;
  overflow: auto;
`;

const SpaceHolder = styled.div`
  height: 100vh;
  width: 250px;
`;

const Ul = styled.ul`
  list-style: none;
  padding: 0;
  padding-left: ${props => (props.root ? 0 : 20)}px;
`;

const Item = styled(Link)`
  display: block;
  color: white;
  text-decoration: none;
  padding: 12px 20px 5px 20px;
  text-transform: uppercase;
  font-size: 20px;
  font-family: 'Luckiest Guy', sans-serif;
  -webkit-font-smoothing: antialiased;
`;

const Block = ({ route }) => (
  <Fragment>
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
        {route.children
          .sort((a, b) => a.children.length - b.children.length)
          .map((route, index) => (
            <Block route={route} />
          ))}
      </Ul>
    </Ul>
  </Fragment>
);

export default function Navigation({ description, lang, meta, title }) {
  return (
    <MdxRoutes>
      {routes => (
        <SpaceHolder>
          <Container>
            {createTree(
              routes
                .map(route => ({
                  ...route,
                  slug: route.slug.replace(/\/$/, ''),
                }))
                .filter(route => !BLACKLIST.includes(route.slug))
                .sort(
                  (a, b) => a.slug.split('/').length - b.slug.split('/').length
                )
            ).map((route, index) => (
              <Block route={route} key={index} />
            ))}
          </Container>
        </SpaceHolder>
      )}
    </MdxRoutes>
  );
}
