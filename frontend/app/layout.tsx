import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import ClickSpark from "@/components/ClickSpark";
import { ScreensaverGate } from "@/components/ScreensaverGate";
import { getArtworks } from "@/lib/api/artworks";
import "./globals.css";

// Gambetta isn't in next/font/google's bundled font list (verified: build
// fails with "Unknown font"), so it's loaded the same way the source design
// loads it — a Google Fonts CSS2 <link> — while IBM Plex Sans still goes
// through next/font/google for self-hosting/optimization.
const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Raul Barbosa — Illustrator & Animator",
  description: "Portfolio of Raul Barbosa Neto — illustration, character design, and concept art.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const artworks = await getArtworks();

  // Same slide selection as the entry gate always used: priority-1 artworks,
  // then priority-2, in the createdAt-desc order the backend already returns.
  const slides = artworks
    .filter((a) => a.featuredPriority === 1 || a.featuredPriority === 2)
    .sort((a, b) => a.featuredPriority - b.featuredPriority)
    .map((a) => a.coverImage)
    .slice(0, 5);

  return (
    <html lang="en" className={`${ibmPlexSans.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gambetta:ital,wght@0,300..700;1,300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
          <ScreensaverGate slides={slides}>{children}</ScreensaverGate>
        </ClickSpark>
      </body>
    </html>
  );
}
