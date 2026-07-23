"use client";

import { AboutTitle } from "@/components/AboutTitle";
import { AboutSection } from "@/components/AboutSection";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { SelectedWork } from "@/components/SelectedWork";

import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { HeroSection } from "@/components/HeroSection";
import { GlitchReveal } from "@/components/GlitchReveal";
export default function Home() {
  return (
    <main className="bg-[#000000] min-h-screen text-white font-sans overflow-x-clip selection:bg-[#ffd400]/30 selection:text-[#ffd400]">
      <Preloader />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── ABOUT ────────────────────────────────────────────────── */}
      {/* <AboutTitle /> */}
      <AboutSection />

      {/* ── WORK & EXPERIENCE ────────────────────────────────────── */}
      <ExpertiseSection />
      
      <GlitchReveal>
        <SelectedWork />
      </GlitchReveal>
      


      {/* ── CTA & FOOTER ─────────────────────────────────────────── */}
      <GlitchReveal>
        <CTASection />
      </GlitchReveal>
      <Footer />
    </main>
  );
}
