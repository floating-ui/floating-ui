import React from 'react';
import { Link } from 'gatsby';
import styled from 'emotion';
import { MdxRoutes } from '@pauliescanlon/gatsby-mdx-routes';

const BLACKLIST = /^\/$/;

const Container = styled.ul`
  background: #c83b50;
  padding: 20px;
  margin: 0;
  list-style: none;
  position: fixed;
  height: 100vh;
  width: 250px;
`;

const Item = styled(Link)`
  display: block;
  background-color: #fff;
  color: black;
  text-decoration: none;
  padding: 10px 20px;
  margin: 10px 0;
  border-radius: 20px;
`;

export default function Navigation({ description, lang, meta, title }) {
  return (
    <Container>
      <MdxRoutes>
        {routes => (
          <ul>
            {routes.map((route, index) => (
              <li key={index}>
                <Item to={route}>{route}</Item>
              </li>
            ))}
          </ul>
        )}
      </MdxRoutes>
    </Container>
  );
}
