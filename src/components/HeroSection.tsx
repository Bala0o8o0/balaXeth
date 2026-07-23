"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SystemReadout } from "@/components/SystemReadout";
import { MobileNav } from "@/components/MobileNav";
import { ArwesCard } from "@/components/ArwesCard";
import ProfileLiquidShader from "@/components/ProfileLiquidShader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FileDown,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Flame,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
//  HERO IMAGE SIZE CONFIG
//  ✏️  Only edit these two values to resize the profile image.
// ─────────────────────────────────────────────────────────────────
const HERO_IMAGE_HEIGHT_MOBILE = "550px"; // 📱 mobile  (< 768px)
const HERO_IMAGE_HEIGHT_DESKTOP = "590px"; // 🖥️ desktop (≥ 768px)

// ─────────────────────────────────────────────────────────────────
//  SCRAMBLE HEADING COMPONENT
// ─────────────────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
const TARGET = "PRODUCT DEVELOPER";

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
      {/* Tiny mono label placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="mb-1.5 flex items-center gap-1.5"
      />

      {/* Main Scramble Text */}
      <h2 className="text-[#0f0c0c] sm:text-xl md:text-2xl lg:text-[20px] font-extralight uppercase leading-tight tracking-[0.3em]">
        {display.split("").map((ch, i) => (
          <span
            key={i}
            className={
              ch !== " " &&
              i >=
                TARGET.split("").filter((_, j) => j < i && TARGET[j] !== " ")
                  .length &&
              !revealed
                ? "text-[#ffd400bd]"
                : "text-[#ffd400]"
            }
          >
            {ch}
          </span>
        ))}
        {!revealed && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="ml-0.5 text-[#ffd400]"
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
        <div className="h-[1px] w-3 bg-[#ffd400] animate-pulse" />
        <span className="text-white/40 text-[11px] font-bold tracking-[0.25em] uppercase">
          UI&nbsp;/&nbsp;AI&nbsp;/&nbsp;MVP
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  HERO SECTION COMPONENT
// ─────────────────────────────────────────────────────────────────
export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [isFireEnabled, setIsFireEnabled] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  // Refs for Scroll-Driven Animation
  const containerRef = useRef<HTMLDivElement>(null);
  const visualWrapperRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);
  const resumeCardRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context((self) => {
      // ── ENTRANCE ANIMATIONS (Runs on both mobile and desktop) ──
      // Delayed by 4.5s to synchronize perfectly with the Preloader fading out
      const entranceTl = gsap.timeline({
        delay: 4.5,
      });

      // Navigation
      if (navRef.current) {
        entranceTl.fromTo(
          navRef.current,
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          0.4,
        );
      }

      // Resume Card
      if (resumeCardRef.current) {
        entranceTl.fromTo(
          resumeCardRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          0.9,
        );
      }

      // Socials Card
      if (socialsRef.current) {
        entranceTl.fromTo(
          socialsRef.current,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          1.0,
        );
      }

      // ── SCROLL-TRIGGER TIMELINE (Only on desktop >= 768) ───────
      // Initialize only after the entrance timeline completes to prevent property animation overwrites
      if (window.innerWidth >= 768) {
        entranceTl.eventCallback("onComplete", () => {
          self.add(() => {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=150%", // Pins for 1.5x viewport height
                scrub: true,
                pin: true,
                pinSpacing: true,
                invalidateOnRefresh: true,
              },
            });

            // 1. Fade out and slide up navigation (0% to 25% scroll progress)
            tl.fromTo(
              navRef.current,
              { opacity: 1, y: 0 },
              {
                opacity: 0,
                y: -40,
                duration: 0.25,
                ease: "power1.inOut",
              },
              0,
            );

            // 2. Scale down, fade out, and slide up scramble heading (0% to 45% scroll progress)
            tl.fromTo(
              headingRef.current,
              { opacity: 1, scale: 1, y: 0 },
              {
                opacity: 0,
                scale: 0.8,
                y: -30,
                duration: 0.45,
                ease: "power1.inOut",
              },
              0,
            );

            // 3. Scale down, translate outward, and fade out resume card (0% to 45% scroll progress)
            tl.fromTo(
              resumeCardRef.current,
              { opacity: 1, scale: 1, x: 0, y: 0 },
              {
                opacity: 0,
                scale: 0.8,
                x: -50,
                y: 30,
                duration: 0.45,
                ease: "power1.inOut",
              },
              0,
            );

            // 4. Scale down, translate outward, and fade out socials card (0% to 45% scroll progress)
            tl.fromTo(
              socialsRef.current,
              { opacity: 1, scale: 1, x: 0, y: 0 },
              {
                opacity: 0,
                scale: 0.8,
                x: 55,
                y: 30,
                duration: 0.45,
                ease: "power1.inOut",
              },
              0,
            );

            // 5. Scale down and fade out "BALA" background text (0% to 55% scroll progress)
            tl.fromTo(
              bgTextRef.current,
              { opacity: 1, scale: 1 },
              {
                opacity: 0,
                scale: 0.6,
                duration: 0.55,
                ease: "power1.inOut",
              },
              0,
            );

            // 6. Fade out the profile image container at the very end of the zoom (75% to 100% scroll progress)
            tl.fromTo(
              profileContainerRef.current,
              { opacity: 1 },
              {
                opacity: 0,
                duration: 0.25,
                ease: "power1.in",
              },
              0.75,
            );
          });
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [mounted]);

  return (
    <div ref={containerRef} className="w-full relative">
      {/* ── BALA BACKGROUND TEXT ────────────────────────────────── */}
      <div
        ref={bgTextRef}
        className="absolute top-[55%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:-translate-y-[45%] z-10 w-full flex justify-center pointer-events-none select-none px-[1px] overflow-hidden md:overflow-visible origin-center"
      >
        <motion.h1
          className="text-[32vw] sm:text-[26vw] md:text-[22vw] xl:text-[260px] font-black leading-none tracking-tighter sm:tracking-[0.1em] scale-x-[0.95] sm:scale-x-[1.2] origin-center flex opacity-70 max-w-full"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          {["B", "A", "L", "A"].map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(20px)", y: 50, scale: 0.8 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.2 + index * 0.15,
                ease: "easeOut",
              }}
              style={{ color: "#ffd400", opacity: 0.15 }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      {/* ── PROFILE IMAGE ───────────────────────────────────────────
           Full screen container relative to containerRef to prevent clipping
      ──────────────────────────────────────────────────────────── */}
      <div
        ref={profileContainerRef}
        className="absolute inset-0 z-30 flex items-end justify-center pointer-events-none origin-bottom overflow-hidden"
        style={{
          display: mounted && isDesktop ? "flex" : "none",
        }}
      >
        <motion.div
          id="profile-img-node"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="w-full h-full relative pointer-events-auto origin-bottom"
        >
          <ProfileLiquidShader isAnimationEnabled={isFireEnabled} />
        </motion.div>
      </div>

      <motion.div
        ref={visualWrapperRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-40 w-full h-[100svh] min-h-[600px] bg-transparent flex flex-col pt-4 md:pt-6 px-4 sm:px-6 md:px-10 lg:px-12 pb-4 md:pb-6 group"
      >
        {/* ── TOP NAVIGATION ─────────────────────────────────────── */}
        <nav
          ref={navRef}
          className="md:hidden relative z-20 flex items-center justify-between text-[#ffd400] text-[10px] sm:text-xs md:text-sm font-extrabold tracking-widest uppercase w-full"
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center cursor-target group"
            >
              {/* Animated Hacker Hexagon HUD */}
              <svg
                className="absolute w-14 h-14 md:w-16 md:h-16 pointer-events-none"
                viewBox="0 0 100 100"
                style={{ transform: "translateZ(0px)" }}
              >
                {/* Outer Hexagon with Crawling Dashes */}
                <motion.polygon
                  points="50,8 86.37,29 86.37,71 50,92 13.63,71 13.63,29"
                  stroke="#ffd400"
                  strokeWidth="1.2"
                  strokeDasharray="15 25"
                  fill="none"
                  opacity="0.5"
                  className="filter drop-shadow-[0_0_4px_#ffd400]"
                  animate={{ strokeDashoffset: [0, 160] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
                {/* Inner Pulsing Dotted Hexagon */}
                <motion.polygon
                  points="50,16 79.44,33 79.44,67 50,84 20.56,67 20.56,33"
                  stroke="#ffd400"
                  strokeWidth="0.8"
                  strokeDasharray="4 6"
                  fill="none"
                  opacity="0.3"
                  animate={{ opacity: [0.15, 0.45, 0.15] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {/* Scanline Gradient & Clip Path */}
                <defs>
                  <linearGradient
                    id="laserGrad"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#ffd400" stopOpacity="0" />
                    <stop offset="50%" stopColor="#ffd400" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ffd400" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="hexClip">
                    <polygon points="50,8 86.37,29 86.37,71 50,92 13.63,71 13.63,29" />
                  </clipPath>
                </defs>
                {/* Vertical Scanning Laser */}
                <g clipPath="url(#hexClip)">
                  <motion.rect
                    x="0"
                    width="100"
                    height="12"
                    fill="url(#laserGrad)"
                    animate={{ y: [-15, 115] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </g>
              </svg>

              {/* Central Dragon Logo */}
              <div className="relative w-7 h-7 md:w-8 md:h-8 flex items-center justify-center z-10">
                <img
                  src="/assets/dragon_logo.png"
                  alt="Dragon Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_6px_#ffd400]"
                />
              </div>

              {/* Pulsing glow background */}
              <motion.div
                animate={{ opacity: [0.05, 0.15, 0.05] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-2 bg-[#ffd400] rounded-full blur-md -z-10"
              />
            </motion.div>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-14">
            <a
              href="#portfolio"
              className="hover:opacity-60 font-light transition-opacity"
            />
          </div>

          {/* Right — Contact / Fire Toggle / Mobile Nav */}
          <div className="flex items-center gap-4 lg:gap-8 pointer-events-auto">
            <div className="hidden md:block">
              <a href="#contact" className="block group">
                <ArwesCard
                  type="corners"
                  className="py-2 md:py-3 px-5 md:px-6 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255, 212, 0,0.3)]"
                >
                  <span className="text-[#ffd400] group-hover:text-[#ffd400] text-[10px] sm:text-xs font-bold tracking-widest uppercase block">
                    Contact ME
                  </span>
                </ArwesCard>
              </a>
            </div>

            {/* Fire Effect Toggle */}
            <div className="hidden md:flex items-center group relative cursor-pointer">
              <button
                onClick={() => setIsFireEnabled(!isFireEnabled)}
                className={`w-9 h-9 md:w-10 md:h-10 border rounded-lg bg-[#000000] flex items-center justify-center transition-all duration-300 ${
                  isFireEnabled
                    ? "border-[#ffd400] shadow-[0_0_15px_rgba(255, 212, 0,0.4)]"
                    : "border-[#ffd400]/30 hover:border-[#ffd400]/60"
                }`}
                title="Toggle Fire Animation"
              >
                <Flame
                  className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-300 ${
                    isFireEnabled ? "text-[#ffd400]" : "text-[#ffd400]/40"
                  }`}
                />
              </button>
            </div>

            <div className="md:hidden mt-2">
              <MobileNav />
            </div>
          </div>
        </nav>

        {/* BALA background text moved to absolute backdrop layer z-10 */}

        {/* ── HERO INTERACTIVE LAYERS (text + bottom cards) ─────────── */}
        <div className="relative flex-1 w-full flex flex-col pointer-events-none z-40 pt-2 md:pt-4">
          {/* Top Left — Sci-Fi Scramble Title */}
          <div
            ref={headingRef}
            className="pointer-events-auto mt-10 sm:mt-16 md:mt-8 origin-left"
          >
            <ScrambleHeading />
          </div>

          {/* Bottom Cards */}
          <div className="mt-auto pb-2 md:pb-4 w-full flex flex-row justify-between items-end gap-1 sm:gap-6 pointer-events-none">
            {/* Resume Card (Apple Curved, Minimal) */}
            <div
              ref={resumeCardRef}
              className="pointer-events-auto relative w-[48%] sm:w-full sm:max-w-[180px] md:max-w-[220px] z-50 shrink-0 origin-bottom-left"
            >
              <div
                id="resume-card-node"
                className="bg-[#050505]/95 backdrop-blur-md rounded-[22px] p-3 md:p-3.5 flex flex-col gap-3 relative z-10 shadow-[0_0_15px_rgba(255,212,0,0.05)] hover:shadow-[0_0_20px_rgba(255,212,0,0.15)] transition-shadow duration-500"
              >
                {/* Looped Alien Pixel Animation */}
                <div className="w-full flex justify-center py-2 opacity-80">
                  <div className="grid grid-cols-11 gap-[1.5px] md:gap-[2px]">
                    {[
                      0,0,1,0,0,0,0,0,1,0,0,
                      0,0,0,1,0,0,0,1,0,0,0,
                      0,0,1,1,1,1,1,1,1,0,0,
                      0,1,1,0,1,1,1,0,1,1,0,
                      1,1,1,1,1,1,1,1,1,1,1,
                      1,0,1,1,1,1,1,1,1,0,1,
                      1,0,1,0,0,0,0,0,1,0,1,
                      0,0,0,1,1,0,1,1,0,0,0
                    ].map((isFilled, i) => (
                      <motion.div
                        key={i}
                        className={`w-[4px] h-[4px] md:w-[5px] md:h-[5px] rounded-sm ${
                          isFilled ? "bg-[#ffd400]" : "bg-transparent"
                        }`}
                        animate={isFilled ? { opacity: [0.2, 1, 0.2] } : {}}
                        transition={
                          isFilled
                            ? {
                                duration: 1.2 + (i % 3) * 0.4,
                                repeat: Infinity,
                                delay: (i % 7) * 0.1,
                                ease: "easeInOut",
                              }
                            : {}
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Download CTA Button */}
                <a
                  href="/assets/Bala_Murugan_CV.pdf"
                  download="Bala_Murugan_CV.pdf"
                  className="block w-full pointer-events-auto cursor-target z-20 mt-1"
                >
                  <button className="w-full bg-[#ffd400]/10 hover:bg-[#ffd400]/20 border border-[#ffd400]/30 hover:border-[#ffd400] transition-colors duration-300 rounded py-1.5 md:py-2 px-2 flex items-center justify-center gap-2 group/btn">
                    <FileDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ffd400]/80 group-hover/btn:text-[#ffd400] transition-colors" />
                    <span className="text-[#ffd400]/90 group-hover/btn:text-[#ffd400] text-[8px] md:text-[10px] font-bold tracking-widest uppercase">
                      Download CV
                    </span>
                  </button>
                </a>
              </div>
            </div>

            {/* Socials Card */}
            <div
              ref={socialsRef}
              id="socials-node"
              className="pointer-events-auto relative w-[48%] sm:w-full sm:max-w-[260px] md:max-w-[300px] z-50 shrink-0 origin-bottom-right"
            >
              <div className="p-2 sm:p-4 md:p-6 relative">
                {/* Social Icons */}
                <div className="grid grid-cols-2 place-items-center gap-y-3 sm:flex sm:w-full sm:justify-between sm:items-center">
                  {[
                    {
                      icon: Github,
                      label: "GITHUB",
                      href: "https://github.com/Bala0o8o0",
                    },
                    {
                      icon: Twitter,
                      label: "X",
                      href: "https://x.com/balaXeth",
                    },
                    {
                      icon: Linkedin,
                      label: "LINKEDIN",
                      href: "https://www.linkedin.com/in/bala-murugan-a3ba20240/",
                    },
                    {
                      icon: Instagram,
                      label: "INSTAGRAM",
                      href: "https://www.instagram.com/balaxeth",
                    },
                  ].map((Social, i) => (
                    <div
                      key={i}
                      className="group flex flex-col items-center gap-1.5 md:gap-3 z-20"
                    >
                      <a
                        href={Social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 sm:w-10 sm:h-10 md:w-14 md:h-14 border border-[#ffd400]/30 rounded-lg md:rounded-xl bg-[#000000] flex items-center justify-center hover:bg-[#ffd400]/20 hover:border-[#ffd400] transition-all duration-300 shadow-[0_0_10px_rgba(255, 212, 0,0)] hover:shadow-[0_0_20px_rgba(255, 212, 0,0.6)] group-hover:-translate-y-1 pointer-events-auto"
                      >
                        <Social.icon className="w-4 h-4 md:w-6 md:h-6 text-[#ffd400] group-hover:scale-110 transition-transform duration-300" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
