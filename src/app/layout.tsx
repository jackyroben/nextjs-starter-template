import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dating App - Find Your Perfect Match",
  description:
    "Connect with amazing people in your area. Swipe, match, and start meaningful conversations.",
  keywords: ["dating", "match", "relationship", "love", "social"],
  authors: [{ name: "Dating App Team" }],
  openGraph: {
    title: "Dating App - Find Your Perfect Match",
    description:
      "Connect with amazing people in your area. Swipe, match, and start meaningful conversations.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dating App - Find Your Perfect Match",
    description:
      "Connect with amazing people in your area. Swipe, match, and start meaningful conversations.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
