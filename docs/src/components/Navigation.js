import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';

const BLACKLIST = /^\/$/;

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
    <ul>
      {allSiteNavigation.edges.map(edge => (
        <li>
          <Link to={edge.node.path}>{edge.node.title}</Link>
          {!edge.node.path.match(BLACKLIST) && (
            <ul>
              {edge.node.childrenSiteNavigation.map(node => (
                <li>
                  <Link to={node.path}>{node.title}</Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
