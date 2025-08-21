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
  title: "Steiny B's Smashburgers Flatbush - Best Halal Smash Burger & Nashville Hot Chicken in Prospect Lefferts Gardens Brooklyn",
  description: "Steiny B's Smashburgers in Flatbush & Prospect Lefferts Gardens serves NYC's best halal smash burgers, double cheeseburgers, Nashville hot chicken tenders & fast food. Fresh, never frozen, 100% halal. Voted #1 Smashburgers 2025. Order now!",
  keywords: "steiny b's smashburgers, halal burgers flatbush, prospect lefferts gardens restaurants, smash burger brooklyn, double cheeseburger, chicken tenders, fast food flatbush, nashville hot chicken nyc, halal restaurant brooklyn, halal smashburger, flatbush ave restaurants, best burgers nyc 2025, halal food brooklyn, ahi burger, all american burger, au jus burger, avocado bacon burger, avocado burger, bacon avocado burger, bacon burger",
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
      { url: `${S3_BASE_URL}/steiny/images/burgers/jalapeno-cheese-burger.png`, sizes: '32x32', type: 'image/png' },
      { url: `${S3_BASE_URL}/steiny/images/burgers/jalapeno-cheese-burger.png`, sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: `${S3_BASE_URL}/steiny/images/burgers/jalapeno-cheese-burger.png`, sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: `${S3_BASE_URL}/steiny/images/burgers/jalapeno-cheese-burger.png` },
    ],
  },
  openGraph: {
    title: "Steiny B's - Smashed to Perfection",
    description: "Premium halal burgers & Nashville hot chicken. Voted NYC's Top Smashburgers 2025!",
    type: "website",
    siteName: "Steiny B's",
    images: [
      {
        url: `${S3_BASE_URL}/steiny/images/branding/logo-white.png`,
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
    images: [`${S3_BASE_URL}/steiny/images/branding/logo-white.png`],
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
    image: `${S3_BASE_URL}/steiny/images/branding/logo-white.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '942 Flatbush Ave',
      addressLocality: 'Brooklyn',
      addressRegion: 'NY',
      postalCode: '11226',
      addressCountry: 'US'
    },
    telephone: '+13473659254',
    servesCuisine: 'American',
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
        opens: '12:00',
        closes: '00:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday'],
        opens: '12:00',
        closes: '01:00'
      }
    ],
    menu: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://steiny-bs.vercel.app'}/#menu`,
    acceptsReservations: 'False',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '3'
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Gregory Lammy'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5'
        },
        reviewBody: 'Great place !!! Finally a legit smash burger spot in Brooklyn !!! Clean, great staff , and even better food !!!'
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Massiel Melo'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5'
        },
        reviewBody: 'Steiny B\'s smash burgers are packed with flavor and super juicy! I also loved their hot tenders and the sweet chili chicken sandwich, all paired with a side of order crispy fries. Freshly made and delicious. The service was excellent too.'
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'dj FRiTZo'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5'
        },
        reviewBody: 'Burger was tasty and cooked right, and the fries were big fresh cut. lots of sauces to choose from. I tried a chicken tender, and it was the juiciest I ever had.'
      }
    ]
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
