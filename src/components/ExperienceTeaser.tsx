"use client";

import { motion } from "framer-motion";
import { Signal, BatteryFull, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * UI/UX Pro Max - High-End Technical HUD
 * 1. Layout: CTA integrated into the Bio-Data panel for better flow.
 * 2. Visuals: Persistent theme (Red/Black), no white-flash on hover.
 */

function PixelNoise() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
          }}
          transition={{
            duration: Math.random() * 0.5 + 0.1,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          className="absolute w-1 h-1 bg-[#FF0000]"
        />
      ))}
    </div>
  );
}

export function ExperienceTeaser() {
  return (
    <section className="relative w-full py-12 md:py-20 px-6 md:px-12 lg:px-24 bg-transparent z-10 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambience Removed for Brightness */}

      {/* ── Section Title ── */}
      <div className="mb-8 text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-px bg-[#FF0000]" />
          <span className="text-[#FF0000] font-mono text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.6em] font-black uppercase">
            SYSTEM_HISTORY
          </span>
          <div className="w-8 h-px bg-[#FF0000]" />
        </div>
        <h2
          className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          CAREER <span className="text-[#FF0000]">CHRONICLE</span>
        </h2>
      </div>

      <div className="w-full max-w-2xl relative border border-[#FF0000]/40 bg-black/90 shadow-[0_0_30px_rgba(255,0,0,0.15)] overflow-hidden">
        {/* ── Top Technical Header ── */}
        <div className="grid grid-cols-2 border-b border-[#FF0000]/20 bg-[#FF0000]/5">
          <div className="p-3 border-r border-[#FF0000]/20 flex items-center">
            <span
              className="text-white font-black text-xs tracking-widest"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              B4L4_ARCHIVE
            </span>
          </div>
          <div className="p-3 flex items-center justify-end gap-4">
            <Signal className="w-3 h-3 text-[#FF0000] opacity-50" />
            <BatteryFull className="w-3 h-3 text-[#FF0000] opacity-50" />
          </div>
        </div>

        {/* ── Main Data Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Bio Data + CTA */}
          <div className="border-r border-[#FF0000]/20 p-5 space-y-6 flex flex-col justify-center">
            <div className="space-y-1">
              <span className="text-white/40 text-[8px] font-mono uppercase tracking-widest">
                Ident_ID
              </span>
              <div className="text-white font-mono text-[10px] font-bold tracking-widest">
                BALA_MURUGAN_XP
              </div>
            </div>

            {/* ── CTA BUTTON (Now below the ID) ── */}
            <Link href="/experience" className="group block">
              <div className="w-full py-3 bg-[#FF0000]/10 border border-[#FF0000]/40 flex items-center justify-center gap-3 transition-all duration-300 hover:bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,0.1)] hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]">
                <span className="text-[#FF0000] group-hover:text-black font-black uppercase tracking-[0.4em] text-[9px] transition-colors">
                  ACCESS_LOGS
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#FF0000] group-hover:text-black transition-colors" />
              </div>
            </Link>

            {/* Pixel Noise Panel */}
            <div className="h-16 w-full relative border border-[#FF0000]/20 bg-[#FF0000]/5 overflow-hidden">
              <PixelNoise />
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono">
              <span className="text-white/30 uppercase tracking-widest">
                Link_State
              </span>
              <span className="text-[#FF0000] font-bold">SECURED</span>
            </div>
          </div>

          {/* Right: The Spider Scan */}
          <div className="relative p-5 bg-[#080000] flex items-center justify-center min-h-[220px]">
            {/* Technical Grid */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#FF0000 1px, transparent 1px), linear-gradient(90deg, #FF0000 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <PixelNoise />

            {/* Spider Image - Bigger & Brighter */}
            <div className="relative w-68 h-48 brightness-125 contrast-110">
              <Image
                src="/spder.png"
                alt="Scan Subject"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-contain"
                priority
              />
            </div>

            {/* Dynamic Targeting Frame - Darker border */}
            <motion.div
              animate={{
                opacity: [0.6, 0.3, 0.6],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute z-20 border border-[#980202] w-44 h-24"
            />

            <div className="absolute top-2 right-4 text-[7px] font-mono text-[#FF0000]/40 uppercase tracking-widest">
              Scan_Type: Bio_Core
            </div>
          </div>
        </div>

        {/* ── Status Table ── */}
        <div className="border-t border-[#FF0000]/20 p-5 bg-[#FF0000]/2">
          <div className="space-y-2">
            {[
              { label: "NAME", value: "BALA MURUGAN" },
              { label: "FUNCTION", value: "AI DEVELOPER" },
              { label: "STATUS", value: "OPERATIONAL" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-1 border-b border-[#FF0000]/10 last:border-0"
              >
                <span className="text-white/40 text-[9px] font-bold tracking-widest uppercase">
                  {item.label}
                </span>
                <span className="text-white text-[9px] font-black uppercase tracking-widest font-mono">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── System Footer ── */}
        <div className="p-1.5 bg-[#FF0000] text-black text-center">
          <span className="text-[7px] font-black tracking-[0.4em] uppercase">
            LINK_STABLE // ARCHIVE_READY
          </span>
        </div>
      </div>
    </section>
  );
}
