import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import 'docsearch.js/dist/cdn/docsearch.css';
import { media } from './Framework';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const DocsearchContainer = styled.div`
  padding-bottom: 10px;
  display: none;
  ${media.lg} {
    display: block;
  }

  ${props =>
    props.scrolled &&
    css`
      box-shadow: 0 10px 15px -4px rgba(100, 0, 0, 0.3);
    `}
  .algolia-autocomplete {
    display: flex !important;
    flex-direction: column;
    align-items: stretch;
    margin: 10px 10px 0 10px;
  }
  input {
    border: 0;
    border-radius: 20px;
    padding: 10px 20px;
  }

  .algolia-autocomplete .ds-dropdown-menu:before {
    left: 10px;
  }
`;

export default ({ name, className, scrolled }) => {
  useEffect(() => {
    if (canUseDOM) {
      import('docsearch.js').then(docsearch =>
        docsearch.default({
          apiKey: 'd5fa05c4e33e776fbf2b8021cbc15b37',
          indexName: 'popper',
          inputSelector: `.docsearch-input-${name}`,
          algoliaOptions: { facetFilters: ['tags:v2'] },
        })
      );
    }
  }, [name]);

  return (
    <DocsearchContainer className={className} scrolled={scrolled}>
      <input
        type="search"
        placeholder="Search the docs..."
        className={`docsearch-input-${name}`}
      />
    </DocsearchContainer>
  );
};
