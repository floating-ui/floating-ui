import NextLink from 'next/link';
import {useRouter} from 'next/router';
import {forwardRef} from 'react';

import {useAppContext} from '../../pages/_app';

const OUT_DURATION = 75;

export const Link = forwardRef(function Link(props, ref) {
  const {setPageTransitionStatus, setArticleTransitionStatus} =
    useAppContext();
  const router = useRouter();

  const changeRoute = () => {
    setTimeout(() => {
      router.push(props.href);
    }, OUT_DURATION);
  };

  function handleClick(e) {
    props.onClick?.(e);

    const [hrefBase, hrefHash] = props.href.split('#');
    const [asPathBase, asPathHash] = router.asPath.split('#');

    if (
      hrefBase === asPathBase ||
      (hrefBase === asPathBase && hrefHash !== asPathHash) ||
      // plain #hash (table of contents)
      hrefBase === ''
    ) {
      return;
    }

    e.preventDefault();

    if (hrefBase === '/' || asPathBase === '/') {
      setPageTransitionStatus('out');
      changeRoute();
      return;
    }

    if (hrefBase !== asPathBase) {
      setArticleTransitionStatus('out');
      changeRoute();
    }
  }

  return <NextLink ref={ref} {...props} onClick={handleClick} />;
});
