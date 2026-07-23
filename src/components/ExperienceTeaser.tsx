"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Signal, BatteryFull, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CyberTelemetry from "./CyberTelemetry";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
          className="absolute w-1 h-1 bg-white"
        />
      ))}
    </div>
  );
}

export function ExperienceTeaser() {
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      router.push("/experience");
    }, 1500);
  };

  return (
    <section className="relative w-full py-12 md:py-20 px-6 md:px-12 lg:px-24 bg-transparent z-10 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambience Removed for Brightness */}

      {/* ── Section Title ── */}
      <div className="mb-8 text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-px bg-[#ffd400]" />
          <span className="text-[#ffd400] font-mono text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.6em] font-black uppercase">
            
          </span>
          <div className="w-8 h-px bg-[#ffd400]" />
        </div>
        <h2
          className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          my <span className="text-[#ffd400]">experience</span>
        </h2>
      </div>

      <div className="w-full max-w-6xl relative border border-[#ffd400]/40 bg-black/90 shadow-[0_0_30px_rgba(255, 212, 0,0.15)] overflow-hidden">
        {/* ── Top Technical Header ── */}
        <div className="grid grid-cols-2 border-b border-[#ffd400]/20 bg-[#ffd400]/5">
          <div className="p-3 border-r border-[#ffd400]/20 flex items-center">
            <span
              className="text-white font-black text-xs tracking-widest"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              PROFILE
            </span>
          </div>
          <div className="p-3 flex items-center justify-end gap-4">
            <Signal className="w-3 h-3 text-[#ffd400] opacity-50" />
            <BatteryFull className="w-3 h-3 text-[#ffd400] opacity-50" />
          </div>
        </div>

        {/* ── Main Data Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Bio Data + CTA */}
          <div className="border-r border-[#ffd400]/20 p-5 space-y-6 flex flex-col justify-center">
            <div className="space-y-1">
              <span className="text-white/40 text-[8px] font-mono uppercase tracking-widest">
                Name
              </span>
              <div className="text-white font-mono text-[10px] font-bold tracking-widest">
                BALA MURUGAN
              </div>
            </div>

            {/* ── CTA BUTTON (Now below the ID) ── */}
            <button onClick={handleConnect} disabled={isConnecting} className="group block w-full text-left">
              <div className={`w-full py-3 ${isConnecting ? "bg-[#ffd400] border-white" : "bg-[#ffd400]/10 border-[#ffd400]/40 hover:bg-[#ffd400]"} border flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_10px_rgba(255, 212, 0,0.1)] hover:shadow-[0_0_20px_rgba(255, 212, 0,0.4)]`}>
                <span className={`${isConnecting ? "text-white animate-pulse" : "text-[#ffd400] group-hover:text-black"} font-black uppercase tracking-[0.4em] text-[9px] transition-colors`}>
                  {isConnecting ? "LOADING..." : "VIEW EXPERIENCE"}
                </span>
                {!isConnecting && <ArrowUpRight className="w-4 h-4 text-[#ffd400] group-hover:text-black transition-colors" />}
              </div>
            </button>

            {/* Cyber Telemetry Status Panel */}
            <div className="h-16 w-full relative border border-[#ffd400]/20 bg-[#ffd400]/5 overflow-hidden">
              <CyberTelemetry />
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono">
              <span className="text-white/30 uppercase tracking-widest">
                Status
              </span>
              <span className="text-[#ffd400] font-bold">AVAILABLE</span>
            </div>
          </div>

          {/* Right: The Spider Scan */}
          <div className="relative p-5 bg-black flex items-center justify-center min-h-[220px]">
            {/* Technical Grid */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
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
              className="absolute z-20 border border-white w-44 h-24"
            />

            <div className="absolute top-2 right-4 text-[7px] font-mono text-white/40 uppercase tracking-widest">
              Profile Image
            </div>
          </div>
        </div>

        {/* ── Status Table ── */}
        <div className="border-t border-[#ffd400]/20 p-5 bg-[#ffd400]/2">
          <div className="space-y-2">
            {[
              { label: "NAME", value: "BALA MURUGAN" },
              { label: "ROLE", value: "AI DEVELOPER" },
              { label: "STATUS", value: "ACTIVE" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-1 border-b border-[#ffd400]/10 last:border-0"
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

        <div className="p-1.5 bg-[#ffd400] text-black text-center">
          <span className="text-[7px] font-black tracking-[0.4em] uppercase">
            2022 - 2026
          </span>
        </div>
      </div>

      {/* Glitch Overlay Transition */}
      <AnimatePresence>
        {isConnecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-[#ffd400] overflow-hidden"
          >
             <motion.div
               animate={{
                 x: [-10, 10, -5, 5, 0],
                 y: [5, -5, 10, -10, 0],
                 opacity: [0.8, 1, 0.5, 0.9, 1],
                 scale: [1.02, 0.98, 1.05, 0.95, 1]
               }}
               transition={{ duration: 0.15, repeat: Infinity, repeatType: "mirror" }}
               className="absolute inset-0 bg-transparent opacity-40 mix-blend-multiply"
               style={{
                 backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)"
               }}
             />
             
             {/* Scanlines (Darker for red background) */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.2)_1px,transparent_1px)] bg-[size:4px_4px] mix-blend-multiply opacity-50" />
             
             {/* Glitching Dragon Logo */}
             <motion.div
               animate={{ 
                 x: [-15, 15, -5, 20, -10, 5],
                 y: [-5, 5, -2, 8, -6, 2],
                 filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(180deg)", "hue-rotate(270deg)"],
                 scale: [1, 1.1, 0.95, 1.15, 0.9, 1.05],
                 skewX: [0, 10, -10, 15, -5, 0]
               }}
               transition={{ duration: 0.15, repeat: Infinity, ease: "linear" }}
               className="relative z-10 mix-blend-normal flex items-center justify-center"
               style={{ filter: "drop-shadow(5px 0 0 #00FFFF) drop-shadow(-5px 0 0 #FF00FF)" }}
             >
               <img
                 src="/assets/dragon_logo.png"
                 alt="Glitch Dragon Logo"
                 className="w-[150px] h-[150px] md:w-[250px] md:h-[250px] object-contain brightness-0 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
               />
             </motion.div>
             
             {/* Random glitch lines */}
             <motion.div
               animate={{ 
                 top: ["10%", "40%", "80%", "20%", "90%"], 
                 height: ["2px", "15px", "4px", "25px", "8px"],
                 opacity: [0.3, 0.8, 0.2, 0.9, 0.5]
               }}
               transition={{ duration: 0.1, repeat: Infinity }}
               className="absolute left-0 w-full bg-white mix-blend-overlay"
             />
             <motion.div
               animate={{ 
                 top: ["80%", "20%", "50%", "90%", "10%"], 
                 height: ["5px", "2px", "12px", "3px", "20px"],
                 opacity: [0.5, 0.2, 0.7, 0.4, 0.8]
               }}
               transition={{ duration: 0.12, repeat: Infinity }}
               className="absolute left-0 w-full bg-black mix-blend-overlay"
             />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
