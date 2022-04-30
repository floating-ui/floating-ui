import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script
            async
            defer
            data-website-id="15719ba2-10f1-4303-8a19-bed14d1e5d4f"
            src="https://626cfbd8a2fb4e5308c41baf--fantastic-pixie-a91050.netlify.app/floating.js"
          />
        </Head>
        <body
          className="bg-gray-900 text-gray-100"
          data-remove-transitions=""
        >
          <div id="focus-root" tabIndex={-1} />
          <div id="floating-root" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
