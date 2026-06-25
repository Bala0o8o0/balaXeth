"use client";

import { AboutTitle }      from "@/components/AboutTitle";
import { AboutSection }    from "@/components/AboutSection";
import { ExpertiseSection} from "@/components/ExpertiseSection";
import { SelectedWork }    from "@/components/SelectedWork";
import { ExperienceTeaser} from "@/components/ExperienceTeaser";
import { CTASection }      from "@/components/CTASection";
import { Footer }          from "@/components/Footer";
import { Preloader }       from "@/components/Preloader";
import { HeroSection }     from "@/components/HeroSection";

export default function Home() {
  return (
    <main className="bg-[#000000] min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#FF0000]/30 selection:text-[#FF0000]">
      <Preloader />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── ABOUT ────────────────────────────────────────────────── */}
      <AboutTitle />
      <AboutSection />

      {/* ── WORK & EXPERIENCE ────────────────────────────────────── */}
      <ExpertiseSection />
      <SelectedWork />
      <ExperienceTeaser />

      {/* ── CTA & FOOTER ─────────────────────────────────────────── */}
      <CTASection />
      <Footer />
    </main>
  );
}
