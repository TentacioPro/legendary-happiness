import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add a CSP meta tag to allow fonts */}
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'self'; font-src 'self' data:;"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
