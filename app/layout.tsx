import { ReactScan } from "@/components/utils/ReactScan";
import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import Header from "@/components/nav/Header";

const heading = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-heading",
});

const body = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700", "800"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Movie Box",
  description:
    "Discover, search, and download your favorite movies with ease. Our app lets you find the latest releases, timeless classics, and hidden gems—all in one place. With powerful search, seamless torrenting, and a personalized favorites list, your movie collection is just a tap away.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactScan />
      <body className={`${heading.variable} ${body.variable} antialiased`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
