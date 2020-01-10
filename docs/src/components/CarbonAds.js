import React, { useEffect, useRef } from 'react';
import { LinkStyled } from './Framework';

import './carbonAds.css';

const CarbonAds = ({
  url = 'https://cdn.carbonads.com/carbon.js?serve=CKYIE2QW&placement=fezvrastagithubiopopperjs',
  ...props
}) => {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (node) {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.id = '_carbonads_js';
      node.prepend(script);
    }

    return () => (node.innerHTML = '');
  }, [ref, url]);

  return (
    <div {...props} ref={ref}>
      <div className="carbonplaceholder">
        <span className="carbon-text">
          Don't mind tech-related ads? Consider disabling your ad-blocker to
          help us!
          <br />
          They are small and unobtrusive.
          <br />
          Alternatively, consider to support us on{' '}
          <LinkStyled href="https://opencollective.com/popperjs">
            Open Collective
          </LinkStyled>
          !
        </span>
      </div>
    </div>
  );
};

export default CarbonAds;
