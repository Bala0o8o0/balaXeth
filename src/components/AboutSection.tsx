"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { SciFiHUDCard } from "@/components/SciFiHUDCard";
import { useEffect, useRef, useState } from "react";
import {
  Atom,
  Zap,
  Layout,
  Cpu,
  Chrome,
  Triangle,
  Palette,
  Globe,
  Bot,
  Cloud,
  Terminal,
  Database,
} from "lucide-react";

// ─── 3D Hacker Matrix Visualizer ─────────────────────────────────────────────
function Hacker3DVisualizer() {
  const techNodes = [
    { name: "REACT", icon: Layout },
    { name: "NEXT", icon: Globe },
    { name: "FIGMA", icon: Palette },
    { name: "OPENAI", icon: Bot },
    { name: "GOOGLE", icon: Cloud },
    { name: "VERCEL", icon: Terminal },
    { name: "DESIGN", icon: Palette },
    { name: "NODE.JS", icon: Database },
  ];

  return (
    <div
      className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-black/80"
      style={{ perspective: "800px" }}
    >
      {/* 3D Floor Grid */}
      <div
        className="absolute bottom-0 w-[200%] h-[100%] opacity-20 pointer-events-none z-0"
        style={{
          transform: "rotateX(80deg) translateZ(-50px) translateY(100px)",
          transformOrigin: "bottom center",
        }}
      >
        <motion.div
          animate={{ backgroundPositionY: ["0px", "40px"] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Glowing Center Shaft */}
      <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#FF0000]/40 to-transparent shadow-[0_0_30px_#FF0000] pointer-events-none z-10" />

      {/* Rotating 3D Cylinder */}
      <motion.div
        animate={{ rotateY: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="relative w-full h-full flex items-center justify-center z-20"
        style={{ transformStyle: "preserve-3d", transform: "rotateX(-5deg)" }}
      >
        {/* Horizontal Rings */}
        <div
          className="absolute w-[240px] h-[240px] border-[2px] border-[#FF0000]/20 border-dashed rounded-full"
          style={{ transform: "rotateX(90deg) translateZ(40px)" }}
        />
        <div
          className="absolute w-[240px] h-[240px] border border-[#FF0000]/10 rounded-full"
          style={{ transform: "rotateX(90deg) translateZ(-40px)" }}
        />

        {/* Central DNA / Core */}
        <motion.div
          animate={{ rotateX: 360, rotateZ: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-12 h-12 border border-[#FF0000]/80 bg-[#FF0000]/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.5)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="w-6 h-6 border border-[#FF0000] rotate-45" />
        </motion.div>

        {techNodes.map((node, i) => {
          const theta = i * (360 / techNodes.length);
          const radius = 120;
          const Icon = node.icon;
          return (
            <div
              key={i}
              className="absolute w-28 h-10 border border-[#FF0000]/60 bg-[#050000]/90 backdrop-blur-md flex items-center justify-start px-2 gap-2 shadow-[0_0_15px_rgba(255,0,0,0.4)] group overflow-hidden"
              style={{
                transform: `rotateY(${theta}deg) translateZ(${radius}px)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "visible",
              }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FF0000] transform translateZ(5px)" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FF0000] transform translateZ(5px)" />

              {/* Inner glitch scanline */}
              <motion.div
                animate={{ x: ["-100%", "300%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.2,
                }}
                className="absolute top-0 h-full w-4 bg-[#FF0000]/30 blur-md z-0"
              />

              {/* Node Content in 3D */}
              <div className="relative z-10 flex items-center gap-2 transform translateZ(10px)">
                <Icon className="w-[14px] h-[14px] text-[#FF0000] drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]" />
                <span className="text-[#FF0000] text-[10px] font-mono font-bold tracking-widest drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]">
                  {node.name}
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Top scanning HUD element */}
      <motion.div
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FF0000]/10 to-transparent pointer-events-none z-30"
      />
    </div>
  );
}

// ─── Animated Stat Bar ────────────────────────────────────────────────────────
function StatBar({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-mono">
        <span className="text-[#FF0000]/60 tracking-widest uppercase">
          {label}
        </span>
        <motion.span
          className="text-[#FF0000] font-bold"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: delay + 0.6 }}
          viewport={{ once: true }}
        >
          {value}%
        </motion.span>
      </div>
      <div className="h-[3px] bg-[#FF0000]/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#FF0000] rounded-full shadow-[0_0_8px_#FF0000]"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </div>
    </div>
  );
}

// ─── Rotating Hex Grid ────────────────────────────────────────────────────────
function HexIcon({ size = 32 }: { size?: number }) {
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${size / 2 + (size / 2 - 2) * Math.cos(angle)},${size / 2 + (size / 2 - 2) * Math.sin(angle)}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon
        points={points}
        fill="none"
        stroke="#FF0000"
        strokeWidth="1.5"
        opacity="0.6"
      />
    </svg>
  );
}

// ─── Live Counter ─────────────────────────────────────────────────────────────
function LiveCounter({ value, label }: { value: string; label: string }) {
  const [display, setDisplay] = useState("00");

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const step = Math.ceil(end / 30);
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setDisplay(String(start).padStart(2, "0"));
      if (start >= end) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="text-2xl md:text-3xl font-black text-[#FF0000] font-mono drop-shadow-[0_0_8px_rgba(255,0,0,0.4)]"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {display}+
      </span>
      <span className="text-[9px] text-[#FF0000]/70 tracking-[0.2em] uppercase font-mono">
        {label}
      </span>
    </div>
  );
}

// ─── Cyberpunk Right Panel ─────────────────────────────────────────────────────
function CyberpunkPanel() {
  const [tick, setTick] = useState(0);

  // Slow heartbeat tick for live data simulation
  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 1800);
    return () => clearInterval(t);
  }, []);

  const logs = [
    "// Booting AI runtime core...",
    "// Neural net: ONLINE",
    "// MVP engine: ACTIVE",
    "// Deploy pipeline: READY",
    "// Web3 node: SYNCED",
  ];

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col gap-4">
      {/* Tech Icon Nodes Area */}
      <div className="relative flex-1 min-h-[300px] bg-black/60 border border-[#FF0000]/20 rounded-sm overflow-hidden perspective-1000">
        <Hacker3DVisualizer />

        {/* Overlay HUD readout */}
        <div className="absolute top-3 left-3 z-10 space-y-1">
          <div
            className="text-[#FF0000] text-[9px] font-mono tracking-widest uppercase"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            ● TECH // ONLINE
          </div>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-[#FF0000]/60 text-[8px] font-mono"
          >
            ● CALIBRATING_TECHNOLOGIES
          </motion.div>
        </div>

        {/* Corner accent dots */}
        {["top-2 right-2", "bottom-2 left-2"].map((pos, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.7 }}
            className={`absolute ${pos} w-1.5 h-1.5 rounded-full bg-[#FF0000]`}
          />
        ))}

        {/* Scan line */}
        <motion.div
          animate={{ y: ["0%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF0000]/60 to-transparent z-10 pointer-events-none"
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: "11", label: "Projects Done" },
          { value: "50", label: "TOOLS & Tech" },
          // { value: "15", label: "AI Models" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-black/50 border border-[#FF0000]/20 rounded-sm py-3 flex items-center justify-center"
          >
            <LiveCounter value={item.value} label={item.label} />
          </div>
        ))}
      </div>

      {/* Languages Section */}
      <div className="bg-black/50 border border-[#FF0000]/20 rounded-sm p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-[1px] w-4 bg-[#FF0000]/50" />
          <span className="text-[9px] animate-pulse text-[#FF0000]/70 font-mono tracking-[0.3em] uppercase">
            Languages Stack
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {["● JAVASCRIPT", "● TYPESCRIPT", "● PYTHON", "● HTML/CSS"].map(
            (lang, i) => (
              <div
                key={lang}
                className="flex items-center justify-between border-b border-[#FF0000]/10 pb-1 group/lang"
              >
                <span className="text-[#FF0000]/80 text-[10px] font-bold tracking-[0.2em] group-hover/lang:translate-x-1 transition-transform group-hover/lang:text-[#FF0000]">
                  {lang}
                </span>
                <span className="text-[#FF0000] text-[10px] font-mono opacity-60">
                  S_{String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Terminal Log */}
      <div className="bg-black/70 border border-[#FF0000]/15 rounded-sm p-3 font-mono text-[9px] space-y-1 overflow-hidden">
        {logs.slice(0, Math.min(tick + 1, logs.length)).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[#FF0000]/70 flex gap-2"
          >
            <span className="text-[#FF0000] opacity-50">&gt;</span>
            {line}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
          className="text-[#FF0000]"
        >
          █
        </motion.span>
      </div>
    </div>
  );
}

// ─── Main About Section ───────────────────────────────────────────────────────
export function AboutSection() {
  const dragonRef = useRef<HTMLImageElement>(null);

  // Removed GSAP animation for dragon icon

  return (
    <section
      id="about"
      className="relative w-full min-h-screen bg-transparent py-10 md:py-16 px-4 md:px-12 lg:px-24 flex items-center z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#000000]/60 pointer-events-none z-0" />

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left content */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
            <SciFiHUDCard>
              <div className="flex flex-col md:flex-row items-center md:justify-between mb-4 md:mb-6 gap-2 md:gap-0">
                <h2
                  className="text-[#FF0000] text-[28px] sm:text-4xl md:text-5xl font-black leading-tight drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] tracking-tighter uppercase text-center md:text-left"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  BALA <span className="md:hidden"> </span>
                  <br className="hidden md:block" />
                  <span>MURUGAN</span>
                </h2>
                <img
                  src="/dragon.svg"
                  alt="Cyber Dragon Icon"
                  className="w-16 h-16 md:w-24 md:h-24 opacity-100 hidden sm:block"
                />
              </div>

              <div
                className="space-y-4 md:space-y-6 text-[#9CA3AF] font-sans text-[14px] md:text-[17px] leading-relaxed text-center md:text-left"
                style={{
                  fontFamily: "var(--font-rajdhani)",
                  letterSpacing: "0.05em",
                }}
              >
                <p
                  className="text-[16px] sm:text-lg md:text-2xl font-bold border-b-2 border-t-2 md:border-t-0 md:border-b-0 md:border-l-4 border-[#FF0000] px-2 md:pl-4 py-2 bg-[#FF0000]/5 text-white"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  I am an{" "}
                  <span className="text-[#FF0000]"> AI Product Developer</span>{" "}
                  and Digital Architect.
                </p>
                <p className="opacity-95 text-[#FF0000] font-medium px-2 md:px-0">
                  I’m an AI Product Developer who builds end-to-end AI-powered
                  web products from idea to deployment, combining design,
                  frontend, and full-stack development into seamless
                  applications.
                </p>
                <p className="opacity-95 font-medium px-2 md:px-0">
                  I apply AI models, prompt engineering, fine-tuning, and RAG
                  systems to create intelligent, scalable products that are
                  fast, user-focused, and ready for real-world use.
                </p>
              </div>
            </SciFiHUDCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SciFiHUDCard title="CONTACT  //">
                <p className="text-[#FF0000]  font-light  animate-pulse tracking-widest  text-[1px] md:text-sm mt-2 leading-relaxed drop-shadow-[0_0_8px_rgba(255,0,0,0.5)] text-center md:text-left">
                  TO BUILD THE FOUNDATION OF THE POST-MODERN WEB WITH APPLIED
                  A.I. AND UNCOMPROMISING DESIGN.
                </p>

                <div className="mt-6 md:mt-8 flex justify-center md:justify-start">
                  <button
                    className="w-full relative px-4 py-3 bg-[#FF0000]/10 border border-[#FF0000] text-[#FF0000] font-bold tracking-widest uppercase text-xs group overflow-hidden hover:bg-[#FF0000] hover:text-[#000] transition-colors duration-300 flex justify-center items-center gap-2"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    <img
                      src="/dragon.svg"
                      alt="dragon"
                      className="w-4 h-4 opacity-100"
                    />
                    <span className="relative z-10">INITIALIZE CONTACT</span>
                  </button>
                </div>
              </SciFiHUDCard>

              <SciFiHUDCard title="SYSTEM_SPECS">
                <ul className="space-y-3 text-[14px] font-mono text-[#FF0000]/80">
                  {[
                    ["USER INTERFACE ", "ACTIVE"],
                    ["FULL STACK MVP ", "ACTIVE"],
                    ["AI MODEL INTEGRATION", "ACTIVE"],
                    ["RAG", "ACTIVE"],
                    ["FINE TUNING", "ACTIVE"],
                    // ["GENERATIVE DESIGN", "ACTIVE"],
                  ].map(([label, val]) => (
                    <li
                      key={label}
                      className="flex justify-between border-b border-[#FF0000]/5 pb-1 group cursor-default"
                    >
                      <span className="group-hover:translate-x-1 transition-transform group-hover:text-[#FF0000]">
                        {label}
                      </span>
                      <span className="text-[#FF0000] font-black opacity-80">
                        {val}
                      </span>
                    </li>
                  ))}
                </ul>
              </SciFiHUDCard>
            </div>
          </div>

          {/* Right panel: Cyberpunk Viz */}
          <div className="lg:col-span-5 flex flex-col">
            <SciFiHUDCard
              // title="SYSTEM ANALYSIS // LIVE"
              className="flex-1 flex flex-col h-full"
            >
              <CyberpunkPanel />
            </SciFiHUDCard>
          </div>
        </div>
      </div>
    </section>
  );
}
