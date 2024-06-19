import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import LayoutWrapper from "./_components/layout/MainWrapper";
import Header from "./_components/nav/Header";
import Footer from "./_components/sections/Footer";

const header = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  variable: "--font-header",
});

const body = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Movie Box",
  description:
    "A movie database app built with Next.js and TypeScript. Browse, search, and view tv-series and movie details.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={header.variable + " " + body.variable}>
        <Providers>
          <LayoutWrapper>
            <Header />
            {children}
            <Footer />
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
