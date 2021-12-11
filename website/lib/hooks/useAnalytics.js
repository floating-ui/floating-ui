import {useRouter} from 'next/router';
import {useEffect} from 'react';

export const TRACKING_ID = 'G-VH2T6VDP54';

function pageview(url) {
  window.gtag('config', TRACKING_ID, {page_path: url});
}

export function useAnalytics() {
  const {events} = useRouter();

  useEffect(() => {
    events.on('routeChangeComplete', pageview);
    return () => {
      events.off('routeChangeComplete', pageview);
    };
  }, [events]);
}
