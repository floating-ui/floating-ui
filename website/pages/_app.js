import 'tailwindcss/tailwind.css';
import '@docsearch/css';
import '../assets/reach-skip-nav.css';
import '../assets/global.css';

import {useRouter} from 'next/router';
import {Fragment, useEffect} from 'react';

import Layout from '../lib/components/Layout';

function MyApp({Component, pageProps}) {
  const {pathname} = useRouter();
  const Wrapper = pathname === '/' ? Fragment : Layout;

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
