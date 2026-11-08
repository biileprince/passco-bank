import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "./components/layout/navigation";
import { Footer } from "./components/layout/footer";

const inter = Inter({ subsets: ["latin"] });
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oguaa.ucc.edu.gh";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "rgb(6,119,0)",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Oguaa Hall | University of Cape Coast",
    template: "%s | Oguaa Hall",
  },
  description:
    "Kwame Eugene's independent Oguaa Hall President campaign and student resource platform for lecture slides, notes, past questions, and community updates.",
  keywords: [
    "Oguaa Hall",
    "University of Cape Coast",
    "UCC student resources",
    "UCC past questions",
    "UCC lecture slides",
    "Kwame Eugene",
  ],
  authors: [{ name: "Oguaa Hall, University of Cape Coast", url: SITE_URL }],
  creator: "Oguaa Hall",
  publisher: "Oguaa Hall",
  category: "education",
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: SITE_URL,
    siteName: "Oguaa Hall",
    title: "Oguaa Hall | University of Cape Coast",
    description:
      "An independent student resource and campaign platform created by Kwame Eugene, aspiring Oguaa Hall President.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oguaa Hall | University of Cape Coast",
    description:
      "Kwame Eugene's Oguaa Hall President campaign, academic resources, and student community platform.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/oguaa-hall-logo.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/oguaa-hall-logo.png",
  },
  applicationName: "Oguaa Hall",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <div className="relative flex min-h-screen flex-col">
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
