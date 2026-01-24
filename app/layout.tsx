import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wentao | Engineer + Developer",
  description: "Building cool stuff with code",
  openGraph: {
    title: "Wentao | Engineer + Developer",
    description: "Building cool stuff with code",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Wentao | Engineer + Developer",
    description: "Building cool stuff with code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
