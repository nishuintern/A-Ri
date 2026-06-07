import type { Metadata } from "next";
import Script from "next/script";import Providers from "@/components/Providers";
import "./globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AÉRI - Le snacking qui vous élève",
  description: "L'équilibre parfait entre tradition millénaire et plaisir instantané",
  alternates: {
    languages: {
      "fr": "https://aerisnacks.com",
      "en": "https://aerisnacks.com",
    },
  },
  openGraph: {
    title: "AÉRI - Le snacking qui vous élève",
    description: "L'équilibre parfait entre tradition millénaire et plaisir instantané",
    url: "https://aerisnacks.com",
    siteName: "AÉRI Snacks",
    images: [
      {
        url: "https://aerisnacks.com/flavor_salt_v2.png",
        width: 1200,
        height: 630,
        alt: "AÉRI Snacks - Makhana Premium",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AÉRI - Le snacking qui vous élève",
    description: "L'équilibre parfait entre tradition millénaire et plaisir instantané",
    images: ["https://aerisnacks.com/flavor_salt_v2.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap" rel="stylesheet" />
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "wxhc6xuglt");
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
