import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
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
  manifest: "/manifest",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Dating App",
    "application-name": "Dating App",
    "msapplication-TileColor": "#ec4899",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ec4899" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
