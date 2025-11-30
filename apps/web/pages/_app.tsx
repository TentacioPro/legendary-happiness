import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  // Optimize font loading
  useEffect(() => {
    // Preload fonts on mount
    if (typeof window !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    }
  }, []);

  return <Component {...pageProps} />;
}
