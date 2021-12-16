import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import {TRACKING_ID} from '../lib/hooks/useAnalytics';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            as="image"
            href="/floating-ui.jpg"
          />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', '${TRACKING_ID}');
          `,
            }}
          />
        </Head>
        <body className="bg-gray-900 text-gray-100">
          <div id="floating-root" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
