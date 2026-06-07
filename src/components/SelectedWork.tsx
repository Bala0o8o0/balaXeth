"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Matrix Rain Component ──────────────────────────────────────────────────
const MatrixRain = ({ color = "#FF2222" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let timer: NodeJS.Timeout;
    
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        const width = canvas.parentElement.clientWidth;
        const height = canvas.parentElement.clientHeight;
        canvas.width = width > 0 ? width : 500;
        canvas.height = height > 0 ? height : 500;
      } else {
        canvas.width = 500;
        canvas.height = 500;
      }
    };
    
    resizeCanvas();
    // Delay slightly to wait for DOM layouts to stabilize
    timer = setTimeout(resizeCanvas, 150);
    
    const fontSize = 11;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * (canvas.height / fontSize) - 15));
    
    const chars = "0101010101010101ABCDEF<>[]/\\_-+=#!@$%^&*ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺ";

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const trailLength = 6;
        for (let j = 0; j < trailLength; j++) {
          const yIndex = drops[i] - j;
          if (yIndex < 0) continue;

          const y = yIndex * fontSize;
          const x = i * fontSize;
          const text = chars[Math.floor((Math.random() * chars.length + yIndex) % chars.length)];
          const opacity = (trailLength - j) / trailLength;

          ctx.fillStyle = `rgba(255, 0, 0, ${opacity * 0.95})`;
          ctx.shadowColor = "#FF0000";
          ctx.shadowBlur = 4;

          ctx.fillText(text, x, y);
        }

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    let lastTime = 0;
    const fps = 24;
    const interval = 1000 / fps;

    const animate = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = timestamp - lastTime;
      if (delta > interval) {
        draw();
        lastTime = timestamp - delta % interval;
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [color]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-4 rounded-sm opacity-85 pointer-events-none z-[12]" 
    />
  );
};


// ─── Data ────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "0x-01",
    title: "GUARDIAN_AI",
    type: "AI / SECURITY",
    link: "https://contract-guardian-ai.vercel.app/",
    description:
      "HIGH_PRECISION AUDIT PROTOCOL FOR SMART CONTRACT VULNERABILITY DETECTION.",
    status: "ACTIVE",
    tech: ["AI", "SOLIDITY", "REACT"],
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "0x-02",
    title: "SCRIBBLER_AI",
    type: "AI / SYNTHESIS",
    link: "https://meta-goblinz-scribbler-ai.vercel.app/",
    description:
      "REAL-TIME NEURAL UPSCALING FOR SKETCH-TO-ASSET TRANSFORMATION.",
    status: "DEPLOYED",
    tech: ["NEXT", "PYTHON", "GAN"],
    image:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "0x-03",
    title: "ALIENHOOD_DAPP",
    type: "WEB3 / DAPP",
    link: "https://alienhood-nft.vercel.app/",
    description:
      "EXTRATERRESTRIAL ASSET MANAGEMENT PROTOCOL FOR INTERPLANETARY TOKENS.",
    status: "OPERATIONAL",
    tech: ["WEB3", "REACT", "IPFS"],
    image:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop",
  },
];

// ─── HUD Card Component ──────────────────────────────────────────────────────
const HUDCard = ({ project, isActive, isPrev, isNext, onClick }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredState = isHovered && !isActive;
  const isVisible = isActive || isPrev || isNext;

  return (
    <motion.div
      initial={false}
      animate={{
        scale: isActive ? 1 : isHoveredState ? 0.68 : 0.62,
        rotateY: isActive ? 0 : isNext ? -45 : 45,
        rotateZ: isActive ? 0 : isPrev ? -4 : 4,
        skewY: isActive ? 0 : isPrev ? -2 : 2,
        z: isActive ? 150 : isHoveredState ? -100 : -350,
        x: isPrev ? "-75%" : isNext ? "75%" : "0%",
        opacity: isActive ? 1 : !isVisible ? 0 : isHoveredState ? 0.8 : 0.35,
        filter: isActive
          ? "drop-shadow(0 0 35px rgba(255, 0, 0, 0.25))"
          : isHoveredState
          ? "drop-shadow(0 0 15px rgba(255, 0, 0, 0.1))"
          : "none",
        zIndex: isActive ? 30 : isHoveredState ? 20 : 10,
      }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 20,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute w-full max-w-[500px] h-[500px] transition-all duration-500 ${
        isActive ? "pointer-events-auto" : isVisible ? "pointer-events-auto cursor-pointer" : "pointer-events-none"
      }`}
      onClick={onClick}
    >
      <div className="relative w-full h-full group overflow-visible">
        {/* 1. Base Frame with premium glassmorphism */}
        <div
          className={`absolute inset-4 transition-all duration-700 rounded-sm border ${
            isActive
              ? "bg-black/90 border-[#FF0000]/35 shadow-[0_0_60px_rgba(0,0,0,0.95)]"
              : "bg-[#050505]/35 backdrop-blur-[8px] border-[#FF0000]/15 shadow-[inset_0_0_15px_rgba(255,0,0,0.05),_0_0_30px_rgba(255,0,0,0.5)] group-hover:bg-[#050505]/45 group-hover:border-[#FF0000]/30 group-hover:shadow-[inset_0_0_25px_rgba(255,0,0,0.1),_0_0_45px_rgba(255,0,0,0.15)]"
          }`}
        />

        {/* 2. Inset Glass Border Layer (Dual-border premium sci-fi aesthetic) */}
        <div
          className={`absolute inset-6 border pointer-events-none rounded-sm transition-all duration-700 ${
            isActive ? "border-[#FF0000]/15" : "border-[#FF0000]/5 group-hover:border-[#FF0000]/20"
          }`}
        />

        {/* Matrix Rain digital code rain background on back cards */}
        {!isActive && <MatrixRain />}

        {/* 3. High-tech HUD Alignment Calibration Crosshairs (Toggles on hover / back cards) */}
        {!isActive && (
          <div className="absolute inset-8 pointer-events-none opacity-30 group-hover:opacity-80 transition-opacity duration-500 z-20">
            {/* Top-Right Calibration Tick */}
            <div className="absolute top-2 right-2 w-3 h-[1px] bg-[#FF0000]/40" />
            <div className="absolute top-2 right-2 w-[1px] h-3 bg-[#FF0000]/40" />
            {/* Bottom-Left Calibration Tick */}
            <div className="absolute bottom-2 left-2 w-3 h-[1px] bg-[#FF0000]/40" />
            <div className="absolute bottom-2 left-2 w-[1px] h-3 bg-[#FF0000]/40" />
          </div>
        )}

        {/* Decorative glass shine sheen sweep effect on hover */}
        <div className="absolute inset-4 overflow-hidden rounded-sm pointer-events-none z-30">
          <div className="absolute top-0 -left-[150%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transition-all duration-1000 group-hover:animate-[shine_1.2s_ease-in-out]" />
        </div>

        {/* ── TOP-LEFT HUD PIECE (Large L-Shape with glass blur) ── */}
        <div
          className={`absolute top-0 left-0 w-44 h-44 bg-gradient-to-br from-[#FF0000]/10 to-transparent border-t-2 border-l-2 rounded-tl-2xl z-20 backdrop-blur-[2px] transition-all duration-500 ${
            isActive ? "border-[#FF0000]/50" : "border-[#FF0000]/20 group-hover:border-[#FF0000]/45"
          }`}
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 30%, 30% 30%, 30% 100%, 0 100%)",
          }}
        >
          {/* Decorative Rivets */}
          <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-[#FF0000]/50" />
          <div className="absolute top-4 left-10 w-1.5 h-1.5 rounded-full bg-[#FF0000]/50" />
          <div className="absolute top-10 left-4 w-1.5 h-1.5 rounded-full bg-[#FF0000]/50" />
        </div>

        {/* ── BOTTOM-RIGHT HUD PIECE (Complex Angled Metal with glass blur) ── */}
        <div
          className={`absolute bottom-0 right-0 w-36 h-36 bg-gradient-to-tl from-[#FF0000]/15 to-transparent border-b-2 border-r-2 rounded-br-2xl z-20 backdrop-blur-[2px] transition-all duration-500 ${
            isActive ? "border-[#FF0000]/50" : "border-[#FF0000]/20 group-hover:border-[#FF0000]/45"
          }`}
          style={{
            clipPath:
              "polygon(100% 100%, 0 100%, 0 70%, 70% 70%, 70% 0, 100% 0)",
          }}
        >
          {/* Technical Lines */}
          <div className="absolute bottom-6 right-6 w-12 h-1 bg-[#FF0000]/40" />
          <div className="absolute bottom-10 right-6 w-8 h-[1px] bg-[#FF0000]/40" />
        </div>

        {/* Main Image with Technical Cutout (Asymmetrical, glass translucent on back cards) */}
        <div
          className="absolute inset-10 z-10 overflow-hidden"
          style={{
            clipPath:
              "polygon(15% 0, 100% 0, 100% 65%, 85% 100%, 0 100%, 0 25%)",
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-all duration-700 scale-110 group-hover:scale-100 ${
              isActive
                ? "grayscale brightness-[0.3] group-hover:grayscale-0 group-hover:brightness-100 opacity-90"
                : "grayscale brightness-[0.08] opacity-10 group-hover:opacity-30 group-hover:brightness-[0.2]"
            }`}
          />
          {/* Internal Scanlines */}
          <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 1px, #FF0000 1px, #FF0000 2px)",
              backgroundSize: "100% 3px",
            }}
          />

          {/* Holographic vertical laser scanning line on non-active cards */}
          {!isActive && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF0000]/20 to-transparent w-full h-1/4 pointer-events-none z-20 animate-[scanline_3.5s_linear_infinite]" />
          )}
        </div>

        {/* Big ID Number */}
        <div className={`absolute top-6 right-8 z-30 transition-all duration-500 ${
          isActive ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
        }`}>
          <span
            className="text-[#FF0000] drop-shadow-[0_0_8px_rgba(255,0,0,0.4)] text-[15px] font-black tracking-wider leading-none"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {project.id}
          </span>
          <div className="h-[1.5px] w-full bg-[#FF0000]/60 mt-1" />
        </div>

        {/* Title & Stats */}
        <div className={`absolute bottom-12 left-12 z-30 flex flex-col gap-2 transition-all duration-500 ${
          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}>
          <div className="flex items-center gap-3">
            <div className="h-4 w-[2px] bg-[#FF0000] animate-pulse" />
            <span className="text-[#FF0000] font-mono text-[10px] tracking-[0.4em] font-black uppercase">
              DATA_STREAM: {project.type}
            </span>
          </div>
          <h3
            className="text-white text-3xl font-black uppercase tracking-tighter"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {project.title}
          </h3>
          <div className="w-16 h-[1px] bg-[#FF0000]/60" />
        </div>

        {/* Corner Decor Dots */}
        <div className={`absolute top-4 left-4 w-3 h-3 border border-[#FF0000]/30 rounded-full z-40 transition-all duration-500 ${
          isActive ? "opacity-100" : "opacity-0 pointer-events-none"
        }`} />
        <div className={`absolute bottom-4 right-4 w-3 h-3 border border-[#FF0000]/30 rounded-full z-40 transition-all duration-500 ${
          isActive ? "opacity-100" : "opacity-0 pointer-events-none"
        }`} />

        {/* Right Edge Decorative Text */}
        <div className={`absolute right-4 bottom-32 [writing-mode:vertical-lr] font-black text-[14px] tracking-[1.5em] uppercase select-none pointer-events-none transition-all duration-500 ${
          isActive ? "text-[#FF0000]/10 opacity-100" : "opacity-0"
        }`}>
          SYSTEM_ACCESS_GRANTED
        </div>
      </div>
    </motion.div>
  );
};

export function SelectedWork() {
  const [index, setIndex] = useState(1);

  const nextProject = useCallback(() => {
    setIndex((prev) => (prev + 1) % PROJECTS.length);
  }, []);

  const prevProject = useCallback(() => {
    setIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  }, []);

  // ─── 12 Second Auto-Swap Logic ───
  useEffect(() => {
    const interval = setInterval(nextProject, 12000);
    return () => clearInterval(interval);
  }, [nextProject]);

  return (
    <section className="relative w-full py-24 md:py-40 bg-[#020000] z-10 overflow-hidden flex flex-col items-center">
      {/* Background Matrix Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#FF0000 1px, transparent 1px), linear-gradient(90deg, #FF0000 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Section Title Area */}
      <div className="relative z-20 mb-16 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="w-10 h-px bg-[#FF0000]" />
            <span className="text-[#FF0000] font-mono text-xs tracking-[0.6em] font-black uppercase">
              SELECTED_RECORDS
            </span>
            <div className="w-10 h-px bg-[#FF0000]" />
          </div>
          <h2
            className="text-white text-5xl md:text-6xl font-black uppercase tracking-tighter"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            FEATURED <span className="text-[#FF0000]">WORKS</span>
          </h2>
        </div>
      </div>

      {/* 3D Stack Container */}
      <div 
        className="relative w-full max-w-[1200px] h-[550px] flex items-center justify-center perspective-[1500px] [transform-style:preserve-3d]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {PROJECTS.map((project, i) => {
          const isActive = i === index;
          const isPrev = i === (index - 1 + PROJECTS.length) % PROJECTS.length;
          const isNext = i === (index + 1) % PROJECTS.length;

          return (
            <HUDCard
              key={project.id}
              project={project}
              isActive={isActive}
              isPrev={isPrev}
              isNext={isNext}
              onClick={() => {
                if (!isActive) {
                  setIndex(i);
                }
              }}
            />
          );
        })}
      </div>

      {/* Navigation & Progress */}
      <div className="relative z-30 mt-8 flex flex-col items-center gap-10">
        <div className="flex items-center gap-16">
          <button
            onClick={prevProject}
            className="w-16 h-16 rounded-full border border-[#FF0000]/20 flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000] hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(255,0,0,0.1)] group"
          >
            <ChevronLeft
              size={28}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </button>

          <div className="flex flex-col items-center gap-3">
            <div className="text-[#FF0000] font-mono text-[10px] tracking-[0.5em] font-black uppercase opacity-60">
              BUFFER_RELOAD // SEC:12
            </div>
            <div className="flex gap-3">
              {PROJECTS.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: i === index ? 1.2 : 1 }}
                  className={`h-1 w-10 transition-all duration-500 rounded-full ${i === index ? "bg-[#FF0000] shadow-[0_0_10px_#FF0000]" : "bg-[#FF0000]/10"}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={nextProject}
            className="w-16 h-16 rounded-full border border-[#FF0000]/20 flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000] hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(255,0,0,0.1)] group"
          >
            <ChevronRight
              size={28}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* Dynamic Action Button */}
        <AnimatePresence mode="wait">
          <motion.a
            key={PROJECTS[index].id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            href={PROJECTS[index].link}
            target="_blank"
            className="px-14 py-4 bg-[#FF0000]/5 border border-[#FF0000]/40 text-[#FF0000] font-black uppercase tracking-[0.5em] text-[11px] hover:bg-[#FF0000] hover:text-black transition-all group flex items-center gap-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#FF0000]/10 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500" />
            <span className="relative z-10">DECRYPT_DATA_SOURCE</span>
            <ExternalLink
              size={16}
              className="relative z-10 group-hover:scale-110 transition-transform"
            />
          </motion.a>
        </AnimatePresence>
      </div>

      {/* Terminal Overlay */}
      <div className="absolute top-10 right-10 font-mono text-[7px] text-[#FF0000]/30 flex flex-col items-end gap-1 uppercase select-none">
        <span>PROJECT_ID: {PROJECTS[index].id}</span>
        <span>STATUS: {PROJECTS[index].status}</span>
        <span>ENCRYPTION: AES_256_ACTIVE</span>
      </div>
    </section>
  );
}

export default SelectedWork;
