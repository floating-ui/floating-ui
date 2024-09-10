import 'tailwindcss/tailwind.css';
import '@docsearch/css';
import '../assets/reach-skip-nav.css';
import '../assets/global.css';

import {Figtree} from 'next/font/google';
import {useRouter} from 'next/router';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {flushSync} from 'react-dom';

import Layout from '../lib/components/Layout';
import {useLocalStorage} from '../lib/hooks/useLocalStorage';

const VariableFont = Figtree({
  variable: '--font-variable',
  subsets: ['latin'],
});

const AppContext = createContext({});
export const useAppContext = () => useContext(AppContext);

function MyApp({Component, pageProps}) {
  const {pathname, events} = useRouter();
  const Wrapper = pathname === '/' ? 'div' : Layout;

  const [packageContext, setPackageContext] = useLocalStorage(
    'package-context',
    'dom',
  );
  const [isPackageTooltipTouched, setIsPackageTooltipTouched] =
    useLocalStorage('package-context-tooltip-touched', false);

  const [pageTransitionStatus, setPageTransitionStatus] =
    useState('initial');
  const [articleTransitionStatus, setArticleTransitionStatus] =
    useState('initial');

  useEffect(() => {
    function handleRouteChangeComplete() {
      flushSync(() => {
        setPageTransitionStatus('in');
        setArticleTransitionStatus('in');
      });
    }

    events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      events.off(
        'routeChangeComplete',
        handleRouteChangeComplete,
      );
    };
  }, [events]);

  const appContext = useMemo(
    () => ({
      packageContext,
      setPackageContext,
      pageTransitionStatus,
      setPageTransitionStatus,
      articleTransitionStatus,
      setArticleTransitionStatus,
      isPackageTooltipTouched,
      setIsPackageTooltipTouched,
    }),
    [
      packageContext,
      setPackageContext,
      pageTransitionStatus,
      articleTransitionStatus,
      isPackageTooltipTouched,
      setIsPackageTooltipTouched,
    ],
  );

  useEffect(() => {
    document.body.removeAttribute('data-remove-transitions');
  }, []);

  return (
    <AppContext.Provider value={appContext}>
      <Wrapper className={VariableFont.variable}>
        <Component {...pageProps} />
      </Wrapper>
    </AppContext.Provider>
  );
}

export default MyApp;
