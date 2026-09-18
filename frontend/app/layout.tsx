import type { Metadata } from "next";
import { IBM_Plex_Sans, Permanent_Marker } from "next/font/google";
import ClickSpark from "@/components/ClickSpark";
import { ScreensaverGate } from "@/components/ScreensaverGate";
import { getArtworks } from "@/lib/api/artworks";
import { COLORS } from "@/lib/theme";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  weight: "400",
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
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${permanentMarker.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <ClickSpark sparkColor={COLORS.white} sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
          <ScreensaverGate slides={slides}>{children}</ScreensaverGate>
        </ClickSpark>
      </body>
    </html>
  );
}
