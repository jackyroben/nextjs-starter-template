import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/service-worker-registration";
import MobileInstallPrompt from "@/components/mobile-install-prompt";

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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dating App" />
        <meta name="application-name" content="Dating App" />
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <ServiceWorkerRegistration />
        <MobileInstallPrompt />
      </body>
    </html>
  );
}
