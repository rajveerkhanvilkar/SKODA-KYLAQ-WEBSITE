import type { Metadata, Viewport } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadataBase = new URL("https://skoda-kylaq.experience.com");

export const metadata: Metadata = {
  metadataBase,
  title: "Škoda Kylaq | Made to Stand Apart | Cinematic Experience",
  description:
    "Experience the all-new Škoda Kylaq through an immersive, scroll-driven automotive digital journey. Modern Solid design, 1.0L TSI power, MQB-A0-IN platform, and class-leading SUV luxury.",
  keywords: [
    "Skoda Kylaq",
    "Skoda India",
    "Compact SUV",
    "Modern Solid Design",
    "1.0 TSI Turbo",
    "Automotive Experience",
    "Luxury SUV",
    "Test Drive"
  ],
  authors: [{ name: "Škoda Digital Campaign Studio" }],
  openGraph: {
    title: "Škoda Kylaq — Darkness Meets Its Match",
    description: "Experience the cinematic reveal of the all-new compact SUV from Škoda Auto.",
    url: "https://skoda-kylaq.experience.com",
    siteName: "Škoda Kylaq Experience",
    images: [
      {
        url: "/images/features/cinematic_studio.webp",
        width: 1200,
        height: 630,
        alt: "Škoda Kylaq Studio Reveal"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Škoda Kylaq — Modern Solid Compact SUV",
    description: "Explore the scroll-driven automotive experience of Škoda Kylaq.",
    images: ["/images/features/cinematic_studio.webp"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050706"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceGrotesk.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-black text-[#F3F0E8] font-sans selection:bg-[#00A878] selection:text-black">
        {children}
      </body>
    </html>
  );
}
