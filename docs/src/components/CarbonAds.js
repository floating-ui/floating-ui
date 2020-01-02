import React, { useEffect, useRef } from 'react';
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
      node.appendChild(script);
    }

    return () => (node.innerHTML = '');
  }, [ref, url]);

  return <div {...props} ref={ref} />;
};

export default CarbonAds;
