import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { clinicConfig } from "@/app/data/clinic";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: `${clinicConfig.clinicName} | Family Dental Clinic`,
  description:
    "Compassionate and modern dental care with online booking, transparent treatment plans, and pain-free smile solutions.",
  openGraph: {
    title: `${clinicConfig.clinicName} | Family Dental Clinic`,
    description:
      "Book your appointment online for modern, pain-free, family dental care.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${clinicConfig.clinicName} | Family Dental Clinic`,
    description:
      "Book your appointment online for modern, pain-free, family dental care.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
