import 'tailwindcss/tailwind.css';
import '@docsearch/css';
import '../assets/reach-skip-nav.css';
import '../assets/global.css';

import localFont from 'next/font/local';
import {useRouter} from 'next/router';
import {useEffect} from 'react';

import Layout from '../lib/components/Layout';

const VariableFont = localFont({
  src: '../assets/Satoshi-Variable.ttf',
  variable: '--font-variable',
});

function MyApp({Component, pageProps}) {
  const {pathname} = useRouter();
  const Wrapper = pathname === '/' ? 'div' : Layout;

  useEffect(() => {
    document.body.removeAttribute('data-remove-transitions');
  }, []);

  return (
    <Wrapper className={VariableFont.variable}>
      <Component {...pageProps} />
    </Wrapper>
  );
}

export default MyApp;
