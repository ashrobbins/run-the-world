import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Run the World",
  description: "Turn your real runs into journeys across the globe.",
  appleWebApp: {
    title: "Run the World",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#6C5CE7",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
