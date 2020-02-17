import React, { useEffect, useRef } from 'react';
import { ExternalLinkStyled } from './Framework';

import './Ads.css';

const Ads = ({
  url = 'https://app.codefund.io/properties/720/funder.js',
  ...props
}) => {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (node) {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      node.prepend(script);
    }

    return () => (node.innerHTML = '');
  }, [ref, url]);

  return (
    <div {...props} ref={ref}>
      <div id="codefund" />
      <div className="cf-wrapper cf-fallback">
        <span className="cf-text">
          Don't mind tech-related ads? Consider disabling your ad-blocker to
          help us!
          <br />
          They are small and unobtrusive.
          <br />
          Alternatively, consider to support us on{' '}
          <ExternalLinkStyled to="https://opencollective.com/popperjs">
            Open Collective
          </ExternalLinkStyled>
          !
        </span>
      </div>
    </div>
  );
};

export default Ads;
