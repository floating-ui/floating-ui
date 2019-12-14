import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import styled from 'styled-components';

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
  const { allSiteNavigation } = useStaticQuery(graphql`
    query allSiteNavigation {
      allSiteNavigation(filter: { fields: { isRoot: { eq: true } } }) {
        edges {
          node {
            title
            path
            childrenSiteNavigation {
              title
              path
              order
              fields {
                isRoot
              }
            }
          }
        }
      }
    }
  `);

  return (
    <Container>
      {allSiteNavigation.edges.map(edge => (
        <li>
          <Item to={edge.node.path}>{edge.node.title}</Item>
          {!edge.node.path.match(BLACKLIST) && (
            <ul style={{ listStyle: 'none' }}>
              {edge.node.childrenSiteNavigation.map(node => (
                <li>
                  <Item to={node.path}>{node.title}</Item>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </Container>
  );
}
