import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const S3_BASE_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL || "https://general-public-image-buckets.s3.amazonaws.com";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://steiny-bs.vercel.app'),
  title: "Steiny B's - Best Halal Burgers NYC | Smashburgers & Nashville Hot Chicken Brooklyn",
  description: "Steiny B's serves NYC's best halal smashburgers & Nashville hot chicken in Brooklyn. Fresh, never frozen, 100% halal certified. Voted #1 Smashburgers 2025. Order now for pickup or delivery!",
  keywords: "steiny b's, halal burgers nyc, best halal burgers brooklyn, smashburger brooklyn, nashville hot chicken nyc, halal restaurant brooklyn, halal smashburger, flatbush ave restaurants, best burgers nyc 2025, halal food brooklyn, steiny's burgers, premium halal burgers, best halal chicken sandwiches, brooklyn halal restaurants, nyc halal burgers delivery",
  authors: [{ name: "Steiny B's Restaurant" }],
  creator: "Steiny B's",
  publisher: "Steiny B's",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Add your Google verification code
  },
  icons: {
    icon: [
      { url: `${S3_BASE_URL}/steiny/images/burgers/cheese-burger.png`, sizes: '32x32', type: 'image/png' },
      { url: `${S3_BASE_URL}/steiny/images/burgers/cheese-burger.png`, sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: `${S3_BASE_URL}/steiny/images/burgers/cheese-burger.png`, sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: `${S3_BASE_URL}/steiny/images/burgers/cheese-burger.png` },
    ],
  },
  openGraph: {
    title: "Steiny B's - Smashed to Perfection",
    description: "Premium halal burgers & Nashville hot chicken. Voted NYC's Top Smashburgers 2025!",
    type: "website",
    siteName: "Steiny B's",
    images: [
      {
        url: `${S3_BASE_URL}/steiny/images/branding/logo-primary.png`,
        width: 1200,
        height: 630,
        alt: "Steiny B's Logo",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Steiny B's - Smashed to Perfection",
    description: "Premium halal burgers & Nashville hot chicken. Voted NYC's Top Smashburgers 2025!",
    images: [`${S3_BASE_URL}/steiny/images/branding/logo-primary.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: "Steiny B's",
    description: "Premium halal burgers & Nashville hot chicken. Voted NYC's Top Smashburgers 2025!",
    image: `${S3_BASE_URL}/steiny/images/branding/logo-primary.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '942 Flatbush Ave',
      addressLocality: 'Brooklyn',
      addressRegion: 'NY',
      postalCode: '11226',
      addressCountry: 'US'
    },
    telephone: '+12125550123',
    servesCuisine: 'American',
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '11:00',
        closes: '22:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday'],
        opens: '11:00',
        closes: '23:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '12:00',
        closes: '21:00'
      }
    ],
    menu: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://steiny-bs.vercel.app'}/#menu`,
    acceptsReservations: 'False'
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#006838" />
        <link rel="preconnect" href="https://general-public-image-buckets.s3.amazonaws.com" />
        <link rel="dns-prefetch" href="https://general-public-image-buckets.s3.amazonaws.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
