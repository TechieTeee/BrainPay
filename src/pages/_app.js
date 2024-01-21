// pages/_app.js

import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Nabla&display=swap');
          `}
        </style>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
