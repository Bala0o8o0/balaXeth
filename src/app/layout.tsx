import type { Metadata } from "next";
import { Inter, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import TargetCursor from "@/components/TargetCursor";
import HudSounds from "@/components/HudSounds";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
});
const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BALAXETH | AI PRODUCT DEVELOPER ",
  description: "Portfolio of Bala, AI Product Developer & MVP Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} ${rajdhani.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased bg-[#000000] text-white overflow-x-hidden" suppressHydrationWarning>
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <TargetCursor targetSelector="a, button, [role='button'], .cursor-target" />
        <HudSounds />
      </body>
    </html>
  );
}

