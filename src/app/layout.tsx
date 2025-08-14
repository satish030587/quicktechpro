import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://quicktechpro.in'),
  title: "QuickTechPro - Complete Tech Solutions | Remote Computer Repair, Website Design & Web Apps",
  description: "QuickTechPro offers comprehensive tech solutions including remote computer repair, professional website design, and custom web application development. India-based, serving globally with transparent pricing.",
  keywords: "remote computer repair, website design, web development, tech support, software solutions, India",
  authors: [{ name: "QuickTechPro" }],
  openGraph: {
    title: "QuickTechPro - Complete Tech Solutions",
    description: "Remote Computer Repair, Website Design & Custom Web Applications",
    url: "https://quicktechpro.in",
    siteName: "QuickTechPro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "QuickTechPro - Complete Tech Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickTechPro - Complete Tech Solutions",
    description: "Remote Computer Repair, Website Design & Custom Web Applications",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
