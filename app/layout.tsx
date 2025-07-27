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

export const metadata: Metadata = {
  title: "Steiny's - Smashed to Perfection",
  description: "Premium halal burgers & Nashville hot chicken. Experience the best smashburgers and crispy chicken sandwiches in NYC. 100% Halal, fresh daily.",
  keywords: "halal burgers, smashburger, nashville hot chicken, halal restaurant, nyc burgers, steiny's",
  openGraph: {
    title: "Steiny's - Smashed to Perfection",
    description: "Premium halal burgers & Nashville hot chicken",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
