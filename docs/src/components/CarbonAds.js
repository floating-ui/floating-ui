import React, { useEffect, useRef } from 'react';
import './carbonAds.css';

const CarbonAds = ({
  url = 'https://cdn.carbonads.com/carbon.js?serve=CKYIE2QW&placement=fezvrastagithubiopopperjs',
  ...props
}) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.id = '_carbonads_js';
      ref.current.appendChild(script);
    }

    return () => (ref.current.innerHTML = '');
  }, [ref]);

  return <div {...props} ref={ref} />;
};

export default CarbonAds;
