"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { CyberScanner } from "@/components/CyberScanner";
import { HoloWave } from "@/components/HoloWave";
import { AboutTitle } from "@/components/AboutTitle";
import { AboutSection } from "@/components/AboutSection";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { SelectedWork } from "@/components/SelectedWork";
import { ExperienceTeaser } from "@/components/ExperienceTeaser";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { MobileNav } from "@/components/MobileNav";
import {
  ArrowDownRight,
  FileDown,
  Github,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { ArwesCard } from "@/components/ArwesCard";
import ProfileLiquidShader from "@/components/ProfileLiquidShader";

const ParticleBackground = dynamic(
  () => import("@/components/ParticleBackground"),
  {
    ssr: false,
  },
);

// ─── Sci-Fi Scramble Heading ──────────────────j─────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
const TARGET = "⚡PRODUCT DEVELOPER";

function ScrambleHeading() {
  const [display, setDisplay] = useState("##################");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let frame = 0;
    let interval: ReturnType<typeof setInterval>;

    const start = () => {
      interval = setInterval(() => {
        frame++;
        const progress = Math.min(frame / 18, 1);
        const revealCount = Math.floor(progress * TARGET.length);
        setDisplay(
          TARGET.split("")
            .map((ch, i) => {
              if (i < revealCount) return ch;
              if (ch === " ") return " ";
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join(""),
        );
        if (progress >= 1) {
          clearInterval(interval);
          setRevealed(true);
        }
      }, 55);
    };

    const delay = setTimeout(start, 1200);
    return () => {
      clearTimeout(delay);
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 1.0 }}
    >         
      {/* Tiny mono label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="mb-1.5 flex items-center gap-1.5"
      >
        {/* <div className="h-[1.5px] w-5 bg-[#ff0000c1]" />
        <span className="text-[#FF0000]/50 text-[12px] font-mono tracking-[0.3em] uppercase">
          SYS.ID // MVP-0x01
        </span> */}
      </motion.div>

      {/* Main Scramble Text */}
      <h2 className="text-[#FF0000]  sm:text-xl md:text-2xl lg:text-[20px] font-extralight uppercase leading-tight tracking-[0.3em]">
        {display.split("").map((ch, i) => (
          <span
            key={i}
            className={
              ch !== " " &&
              i >=
                TARGET.split("").filter((_, j) => j < i && TARGET[j] !== " ")
                  .length &&
              !revealed
                ? // ? "text-[#FF0000]/40"
                  "text-[#ff0000bd]"
                : "text-[#FF0000]"
            }
          >
            {ch}
          </span>
        ))}
        {!revealed && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="ml-0.5 text-[#FF0000]"
          >
            _
          </motion.span>
        )}
      </h2>

      {/* Small subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.5 }}
        className="mt-1.5 flex items-center gap-1.5"
      >
        <div className="h-[1px] w-3 bg-[#ff0000] animate-pulse" />
        <span className="text-white/40 text-[11px] font-bold tracking-[0.25em] uppercase">
          AI&nbsp;/&nbsp;MVP&nbsp;/&nbsp;NEXT.JS
        </span>
      </motion.div>
    </motion.div>
  );
}
// ───────────────────────────────────────────────────────────────────────────

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="bg-[#050505] min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#FF0000]/30 selection:text-[#FF0000]">
      <Preloader />
      {/* <ParticleBackground /> */}

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 w-full h-[100svh] min-h-[600px] bg-transparent flex flex-col pt-4 md:pt-6 px-4 sm:px-6 md:px-10 lg:px-12 pb-4 md:pb-6 group"
      >
        {/* Top Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-20 flex items-center justify-between text-[#FF0000] text-[10px] sm:text-xs md:text-sm font-extrabold tracking-widest uppercase"
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center cursor-target"
              style={{
                perspective: "500px",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Central Dragon Logo */}
              <div
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
                style={{
                  position: "relative",
                  transform: "translateZ(0px)",
                  transformStyle: "preserve-3d",
                }}
              >
                <Image
                  src="/assets/dragon_logo.png"
                  alt="Dragon Logo"
                  fill
                  sizes="(max-width: 768px) 32px, 40px"
                  className="object-contain filter drop-shadow-[0_0_8px_#FF0000]"
                  priority
                />
              </div>

              {/* Horizontal 3D Orbiting Text Ring */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none animate-orbit-text-h"
                style={{ transformStyle: "preserve-3d" }}
              >
                {Array.from("BALA•BALA•").map((char, i, arr) => {
                  const angle = (i * 360) / arr.length;
                  return (
                    <span
                      key={`h-${i}`}
                      className="absolute text-[7px] md:text-[8px] font-black text-[#FF0000] drop-shadow-[0_0_3px_#FF0000] select-none font-mono"
                      style={{
                        transform: `rotateY(${angle}deg) translateZ(var(--orbit-radius)) rotateY(${-angle}deg)`,
                        backfaceVisibility: "visible",
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>

              {/* Vertical 3D Orbiting Text Ring */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none animate-orbit-text-v"
                style={{ transformStyle: "preserve-3d" }}
              >
                {Array.from("BALA•BALA•").map((char, i, arr) => {
                  const angle = (i * 360) / arr.length;
                  return (
                    <span
                      key={`v-${i}`}
                      className="absolute text-[7px] md:text-[8px] font-black text-[#FF0000] drop-shadow-[0_0_3px_#FF0000] select-none font-mono"
                      style={{
                        transform: `rotateX(${angle}deg) translateZ(var(--orbit-radius)) rotateX(${-angle}deg)`,
                        backfaceVisibility: "visible",
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>

              {/* Subtle pulsing background glow for the logo */}
              <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-3 bg-[#FF0000] rounded-full blur-md -z-10"
                style={{ transform: "translateZ(-10px)" }}
              />
            </motion.div>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-14">
            {/* <a href="#about" className="hover:opacity-60 transition-opacity">
              About
            </a> */}
            <a
              href="#portfolio"
              className="hover:opacity-60 font-light transition-opacity"
            >
              {/* <span> PORTFOLIO </span> */}
            </a>
          </div>

          {/* Right Auth / Action */}
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="hidden md:block">
              <a href="#contact" className="block group">
                <ArwesCard
                  type="corners"
                  className="py-2 md:py-3 px-5 md:px-6 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                >
                  <span className="text-white/70 group-hover:text-[#FF0000] transition-colors duration-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase block">
                    Contact Me
                  </span>
                </ArwesCard>
              </a>
            </div>
            <div className="md:hidden mt-2">
              <MobileNav />
            </div>
          </div>
        </motion.nav>

        <div
          className="absolute top-[55%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:-translate-y-[45%] z-0 w-full flex justify-center pointer-events-none select-none px-[1px] overflow-hidden md:overflow-visible"
          data-scroll
          data-scroll-speed="-0.3"
        >
          <motion.h1
            className="text-[32vw] sm:text-[26vw] md:text-[22vw] xl:text-[260px] font-black leading-none tracking-tighter sm:tracking-[0.1em] scale-x-[0.95] sm:scale-x-[1.2] origin-center flex opacity-70 max-w-full"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {["B", "A", "L", "A"].map((char, index) => (
              <motion.span
                key={index}
                initial={{
                  opacity: 0,
                  filter: "blur(20px)",
                  y: 50,
                  scale: 0.8,
                }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
                transition={{
                  duration: 1.2,
                  delay: 0.2 + index * 0.15,
                  ease: "easeOut",
                }}
                style={{
                  color: "#FF0000",
                  opacity: 0.15,
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Profile Image - Interactive WebGL Particles */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 items-end justify-center pointer-events-none"
          data-scroll
          data-scroll-speed="0.15"
          style={{
            display: mounted && window.innerWidth >= 768 ? "flex" : "none",
            width: "min(1500px, 95vw)",
            height: "550px", // Fixed window height to ensure safe layout and framing
            minHeight: "87vh", // Ensures the image rises high across the screen
          }}
        >
          <motion.div
            id="profile-img-node"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.7 }}
            className="w-full h-full relative pointer-events-auto origin-bottom"
          >
            {/* desktopScale=1.0 guarantees zero internal clipping of your head. */}
            <ProfileLiquidShader desktopScale={1.0} />
          </motion.div>
        </div>

        {/* Hero Interactive Layers */}
        <div className="relative flex-1 w-full flex flex-col pointer-events-none z-40 pt-2 md:pt-4">
          {/* Top Left Text — Sci-Fi Scramble Title */}
          <div className="pointer-events-auto mt-10 sm:mt-16 md:mt-8">
            <ScrambleHeading />
          </div>

          {/* Bottom Cards Container */}
          <div className="mt-auto pb-2 md:pb-4 w-full flex flex-row justify-between items-end gap-1 sm:gap-6 pointer-events-none">
            {/* Pure Red Running Border Resume Card (Compact & Rounded) */}
            <motion.div
              transition={{ duration: 0.6, delay: 0.9 }}
              className="pointer-events-auto relative w-[48%] sm:w-full sm:max-w-[240px] md:max-w-[280px] z-50 shrink-0"
            >
              <div className="relative p-[1px] overflow-hidden rounded-xl md:rounded-2xl bg-[#FF0000]/10 group">
                {/* The "Running Border" Animation - Rotating Conical Gradient */}
                <div className="absolute inset-[-100%] animate-[spin_30s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,#FF0000_360deg)] opacity-100 group-hover:animate-[spin_15s_linear_infinite]" />

                {/* Card Content Area */}
                <div
                  id="resume-card-node"
                  className="bg-[#050505] rounded-xl md:rounded-2xl p-2 md:p-5 flex flex-col gap-2 md:gap-4 relative z-10 overflow-hidden"
                >
                  {/* Background Subtle Red Glow */}
                  <div className="absolute -right-8 -bottom-8 w-16 h-16 bg-[#FF0000]/5 rounded-full blur-2xl group-hover:bg-[#FF0000]/10 transition-all duration-700" />

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 text-[#FF0000] relative z-10">
                    {/* Spider Core Icon (Static) */}
                    <div className="relative w-7 h-7 md:w-12 md:h-12 rounded-full flex items-center justify-center p-0.5 md:p-1 border border-[#FF0000]/30 shrink-0">
                      <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center overflow-hidden border border-[#FF0000]/20">
                        <motion.span
                          className="text-lg md:text-2xl select-none leading-none"
                          animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 2, -2, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{
                            filter:
                              "brightness(0) saturate(100%) invert(14%) sepia(95%) saturate(7407%) hue-rotate(3deg) brightness(101%) contrast(116%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          🕷️
                        </motion.span>
                      </div>
                    </div>

                    {/* Pure Red Readout */}
                    <div className="flex flex-col flex-1 min-w-0 w-full md:w-auto font-bold">
                      <span className="text-[7px] md:text-[9px] tracking-[0.1em] md:tracking-[0.2em] text-[#FF0000]">
                        System Readout:
                      </span>
                      <HoloWave className="my-0.5 md:my-1 w-full" />
                      <div className="flex justify-between items-center text-[5px] md:text-[7px] font-mono text-[#FF0000]/60">
                        <span>SYNC: OK</span>
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          [ ON ]
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  {/* Small Red Button */}
                  <button className="flex items-center justify-between w-full bg-[#FF0000]/5 hover:bg-[#FF0000]/20 border border-[#FF0000]/20 hover:border-[#FF0000]/60 transition-all duration-300 rounded-md md:rounded-lg py-1.5 md:py-2 px-2 md:px-4 text-[7px] md:text-[10px] font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase relative z-10 group/btn">
                    <span className="text-[#FF0000]/80 group-hover/btn:text-[#FF0000] transition-colors">
                      <span className="md:hidden">DL.CV</span>
                      <span className="hidden md:inline">Download.CV</span>
                    </span>
                    <FileDown className="w-3 h-3 md:w-4 md:h-4 text-[#FF0000]/60 group-hover/btn:text-[#FF0000] transition-colors" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Bottom Right Social Area */}
            <motion.div
              id="socials-node"
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="pointer-events-auto relative w-[48%] sm:w-full sm:max-w-[260px] md:max-w-[300px] shrink-0"
            >
              <div className="p-2 sm:p-4 md:p-6 relative">
                {/* Status Line */}
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3 w-full">
                  <span className="text-[6px] md:text-xs font-bold tracking-[0.1em] md:tracking-[0.3em] uppercase text-[#FF0000]">
                    Link Terminals
                  </span>
                  <div className="flex-1 h-[1px] bg-[#FF0000]/50" />
                </div>

                {/* Holographic Signal Wave Stack */}
                <div className="w-full opacity-60 mb-2 md:mb-6 mt-1 md:mt-2 hidden md:block">
                  <CyberScanner />
                </div>

                {/* Social Icons Stack */}
                <div className="grid grid-cols-2 place-items-center gap-y-3 sm:flex sm:w-full sm:justify-between sm:items-center mt-3 md:mt-6">
                  {[
                    { icon: Github, label: "GITHUB" },
                    { icon: Twitter, label: "TWITTER" },
                    { icon: Linkedin, label: "LINKEDIN" },
                    { icon: Instagram, label: "INSTA" },
                  ].map((Social, i) => (
                    <div
                      key={i}
                      className="group flex flex-col items-center gap-1.5 md:gap-3"
                    >
                      <a
                        href="#"
                        className="w-10 h-10 sm:w-10 sm:h-10 md:w-14 md:h-14 border border-[#FF0000]/30 rounded-lg md:rounded-xl bg-[#000000] flex items-center justify-center hover:bg-[#FF0000]/20 hover:border-[#FF0000] transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0)] hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] group-hover:-translate-y-1"
                      >
                        <Social.icon className="w-4 h-4 md:w-6 md:h-6 text-[#FF0000] group-hover:scale-110 transition-transform duration-300" />
                      </a>
                      {/* Label */}
                      <span className="text-[#FF0000] text-[6px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-widest transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]">
                        {Social.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Glitch decoding title separating Hero from About */}
      <AboutTitle />

      {/* The new About Section */}
      <AboutSection />

      {/* Expertise & Experience Sections */}
      <ExpertiseSection />
      <SelectedWork />
      <ExperienceTeaser />

      {/* Call to Action for Portfolio */}
      <CTASection />

      {/* Futuristic Systems Footer */}
      <Footer />
    </main>
  );
}
