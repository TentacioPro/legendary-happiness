import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import BackToTop from "@/components/back-to-top";
import GridBackground from "@/components/grid-background";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import WebVitalsReporter from "@/components/layout/WebVitalsReporter";

// Inter font for modern, highly legible typography with zero CLS
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
export const metadata: Metadata = {
  title: "Abishek Maharajan | Portfolio",
  metadataBase: new URL("https://www.abishek-maharajan.online"),
  alternates: {
    canonical: "/",
  },
  authors: [
    { name: "Abishek Maharajan", url: "https://github.com/TentacioPro" },
  ],
  description: "Abishek Maharajan's personal portfolio website",
  openGraph: {
    title: "Abishek Maharajan | Portfolio",
    description: "Abishek Maharajan's personal portfolio website",
    images: [
      {
        url: "/photo.jpeg",
        alt: "Abishek Maharajan's Portrait",
        width: 640,
        height: 800,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical hero video poster for faster LCP */}
        <link rel="preload" href="/memoji_poster.jpg" as="image" />
        {/* Preconnect to improve resource loading */}
        <link rel="dns-prefetch" href="https://www.abishek-maharajan.online" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <ErrorBoundary>
          <WebVitalsReporter />
          <Header />
          <GridBackground />
          <main className="container mx-auto overflow-x-hidden px-4 sm:px-6 md:px-8 lg:px-28">
            {children}
          </main>
          <BackToTop />
        </ErrorBoundary>
      </body>
    </html>
  );
}
