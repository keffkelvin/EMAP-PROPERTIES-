import { Newsreader, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader"
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope"
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-plex-mono"
});

export const metadata = {
  title: "Emap Properties — Land, Homes & Stays in Kilifi",
  description:
    "Plots, bungalows, and coastal stays in Kilifi County. Book a virtual or in-person site visit without the trip."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body className="bg-white text-ink font-sans">{children}</body>
    </html>
  );
}
