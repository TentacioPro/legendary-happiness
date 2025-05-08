import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from "@/components/header";
import BackToTop from "@/components/back-to-top";
import GridBackground from "@/components/grid-background";

const montserrat = Montserrat({ subsets: ["latin"] });
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
      <body className={montserrat.className}>
        <Header />
        <GridBackground />
        <main className="container overflow-x-hidden lg:px-28">{children}</main>
        <BackToTop />
      </body>
    </html>
  );
}
