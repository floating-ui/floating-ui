import 'tailwindcss/tailwind.css';
import '../assets/reach-skip-nav.css';
import '../assets/global.css';

import Layout from '../lib/components/Layout';
import {useRouter} from 'next/router';
import {Fragment, useEffect} from 'react';

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
