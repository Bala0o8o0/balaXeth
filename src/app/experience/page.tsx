"use client";

import { motion } from "framer-motion";
import { ExperienceSection } from "@/components/ExperienceSection";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ParticleBackground = dynamic(
  () => import("@/components/ParticleBackground"),
  {
    ssr: false,
  },
);

export default function ExperiencePage() {
  return (
    <main className="bg-[#000000] min-h-screen text-white font-sans selection:bg-[#FF0000]/30 selection:text-[#FF0000]">
      <ParticleBackground />
      
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-[#FF0000]/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="group flex items-center gap-2 text-[#FF0000] font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-all"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>RETURN_TO_BASE</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#FF0000] rounded-full animate-pulse" />
            <span className="text-[#FF0000] font-mono text-[10px] tracking-[0.2em] uppercase">
              SECURE_ARCHIVE // 0x44F
            </span>
          </div>
        </div>
      </nav>

      <div className="pt-24">
        {/* We reuse the existing ExperienceSection but it's now the main content of this page */}
        <div data-scroll-section>
            <ExperienceSection />
        </div>
      </div>

      {/* Footer-like status bar for the log page */}
      <footer className="py-10 border-t border-[#FF0000]/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[#FF0000]/40 font-mono text-[10px] tracking-widest uppercase">
            End of encrypted logs // System version 2.4.1
          </p>
        </div>
      </footer>
    </main>
  );
}
