import type { Metadata } from "next";
import { Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGNC | #After A.I.",
  description: "We architect high-fidelity products and systems for founders building complicated things.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${spaceMono.variable} antialiased bg-black text-white`}
        suppressHydrationWarning
      >
        <Preloader />
        {children}
      </body>
    </html>
  );
}
