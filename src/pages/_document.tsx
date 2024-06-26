import {
  Html, Head, Main, NextScript,
} from 'next/document';

const Document = () => {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="tailwind">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
