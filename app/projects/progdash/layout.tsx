import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProgDash | Powerlifting Program Viewer",
  description:
    "Sign in with Google and load your powerlifting program from Google Sheets into a clean, readable interface.",
  openGraph: {
    title: "ProgDash | Powerlifting Program Viewer",
    description:
      "Sign in with Google and load your powerlifting program from Google Sheets into a clean, readable interface.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ProgDash | Powerlifting Program Viewer",
    description:
      "Sign in with Google and load your powerlifting program from Google Sheets into a clean, readable interface.",
  },
};

export default function ProgDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
