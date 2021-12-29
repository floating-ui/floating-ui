import 'tailwindcss/tailwind.css';
import '@reach/skip-nav/styles.css';
import '../assets/global.css';

import {useAnalytics} from '../lib/hooks/useAnalytics';

function MyApp({Component, pageProps}) {
  useAnalytics();
  return <Component {...pageProps} />;
}

export default MyApp;
