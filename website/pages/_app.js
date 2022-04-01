import 'tailwindcss/tailwind.css';
import '@reach/skip-nav/styles.css';
import '../assets/global.css';

import {useAnalytics} from '../lib/hooks/useAnalytics';
import Layout from '../lib/components/Layout';
import {useRouter} from 'next/router';
import {Fragment, useEffect} from 'react';

function MyApp({Component, pageProps}) {
  const {pathname} = useRouter();
  const Wrapper = pathname === '/' ? Fragment : Layout;

  useAnalytics();

  useEffect(() => {
    document.body.removeAttribute('data-remove-transitions');
  }, []);

  return (
    <Wrapper>
      <Component {...pageProps} />
    </Wrapper>
  );
}

export default MyApp;
