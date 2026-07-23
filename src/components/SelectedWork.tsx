"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  PanInfo,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { ExternalLink, ChevronLeft, ChevronRight, Hand } from "lucide-react";

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
    timer = setTimeout(resizeCanvas, 150);

    const fontSize = 11;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns)
      .fill(0)
      .map(() => Math.floor(Math.random() * (canvas.height / fontSize) - 15));

    const chars =
      "0101010101010101ABCDEF<>[]/\\_-+=#!@$%^&*ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺ";

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
          const text =
            chars[
              Math.floor((Math.random() * chars.length + yIndex) % chars.length)
            ];
          const opacity = (trailLength - j) / trailLength;

          ctx.fillStyle = `rgba(255, 212, 0, ${opacity * 0.95})`;
          ctx.shadowColor = "#ffd400";
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
        lastTime = timestamp - (delta % interval);
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
    id: "01",
    title: "LUMINA TRY",
    type: "AI / SAAS",
    link: "https://lumina-tryon.vercel.app/",
    description:
      "VIRTUAL FITTING PROTOCOL. AI PROJECTION OF APPAREL ONTO SUBJECTS IN REAL-TIME.",
    status: "LIVE_ALPHA",
    tech: ["AI", "SUPABASE", "NEXT.JS"],
    image: "/LUMINA_SAMPLE.png",
  },
  {
    id: "02",
    title: "NEUI PRD",
    type: "PRODUCT DESIGN",
    link: "https://neui-prd.vercel.app/",
    description:
      "NEURAL USER INTERFACE PRODUCT DESIGN. ADVANCED PROTOTYPING FOR NEXT-GEN EXPERIENCES.",
    status: "PROTOTYPE",
    tech: ["PHOTOSHOP", "FIGMA"],
    image: "/assets/neui.png",
  },
  {
    id: "03",
    title: "BORAQUETATU",
    type: "CREATIVE / DESIGN",
    link: "#",
    description:
      "BORAQUETATU DIGITAL EXPERIENCE. IMMERSIVE BRANDING AND VISUAL IDENTITY PLATFORM.",
    status: "DEPLOYED",
    tech: ["FIGMA", "REACT.JS"],
    image: "/assets/TATU.png",
  },
];

// ─── HUD Card Component ──────────────────────────────────────────────────────
const HUDCard = ({
  project,
  isActive,
  isPrev,
  isNext,
  onClick,
  isMobile,
}: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredState = isHovered && !isActive;
  const isVisible = isActive || isPrev || isNext;

  return (
    <motion.div
      initial={false}
      animate={{
        scale: isActive ? 1 : isHoveredState ? 0.68 : isMobile ? 0.75 : 0.62,
        rotateY: isActive
          ? 0
          : isNext
            ? isMobile
              ? -25
              : -45
            : isMobile
              ? 25
              : 45,
        rotateZ: isActive ? 0 : isPrev ? -4 : 4,
        skewY: isActive ? 0 : isPrev ? -2 : 2,
        z: isActive ? 150 : isHoveredState ? -100 : -350,
        x: isPrev
          ? isMobile
            ? "-55%"
            : "-75%"
          : isNext
            ? isMobile
              ? "55%"
              : "75%"
            : "0%",
        opacity: isActive
          ? 1
          : !isVisible
            ? 0
            : isHoveredState
              ? 0.8
              : isMobile
                ? 0.25
                : 0.35,
        filter: isActive
          ? "drop-shadow(0 0 15px rgba(255, 212, 0, 0.15))"
          : isHoveredState
            ? "drop-shadow(0 0 15px rgba(255, 212, 0, 0.1))"
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
      className={`absolute w-[85%] md:w-full max-w-[300px] md:max-w-[380px] h-[340px] md:h-[420px] transition-all duration-500 ${
        isActive
          ? "pointer-events-auto cursor-grab active:cursor-grabbing"
          : isVisible
            ? "pointer-events-auto cursor-pointer"
            : "pointer-events-none"
      }`}
      onClick={onClick}
    >
      <div className="relative w-full h-full group overflow-visible">
        {/* Base Frame with premium glassmorphism */}
        <div
          className={`absolute inset-2 md:inset-4 transition-all duration-700 rounded-sm border ${
            isActive
              ? "bg-black/90 border-[#ffd400]/35 shadow-[0_0_60px_rgba(0,0,0,0.95)]"
              : "bg-[#000000]/35 backdrop-blur-[8px] border-[#ffd400]/15 shadow-[inset_0_0_15px_rgba(255, 212, 0,0.05),_0_0_30px_rgba(255, 212, 0,0.5)] group-hover:bg-[#000000]/45 group-hover:border-[#ffd400]/30 group-hover:shadow-[inset_0_0_25px_rgba(255, 212, 0,0.1),_0_0_45px_rgba(255, 212, 0,0.15)]"
          }`}
        />

        {/* Inset Glass Border Layer */}
        <div
          className={`absolute inset-4 md:inset-6 border pointer-events-none rounded-sm transition-all duration-700 ${
            isActive
              ? "border-[#ffd400]/15"
              : "border-[#ffd400]/5 group-hover:border-[#ffd400]/20"
          }`}
        />

        {/* Matrix Rain digital code rain background on back cards */}
        {!isActive && !isMobile && <MatrixRain />}

        {/* High-tech HUD Alignment Calibration Crosshairs */}
        {!isActive && (
          <div className="absolute inset-6 md:inset-8 pointer-events-none opacity-30 group-hover:opacity-80 transition-opacity duration-500 z-20 hidden md:block">
            {/* Top-Right Calibration Tick */}
            <div className="absolute top-2 right-2 w-3 h-[1px] bg-[#ffd400]/40" />
            <div className="absolute top-2 right-2 w-[1px] h-3 bg-[#ffd400]/40" />
            {/* Bottom-Left Calibration Tick */}
            <div className="absolute bottom-2 left-2 w-3 h-[1px] bg-[#ffd400]/40" />
            <div className="absolute bottom-2 left-2 w-[1px] h-3 bg-[#ffd400]/40" />
          </div>
        )}

        {/* Decorative glass shine sheen sweep effect on hover */}
        <div className="absolute inset-2 md:inset-4 overflow-hidden rounded-sm pointer-events-none z-30">
          <div className="absolute top-0 -left-[150%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transition-all duration-1000 group-hover:animate-[shine_1.2s_ease-in-out]" />
        </div>

        {/* ── TOP-LEFT HUD PIECE ── */}
        <div
          className={`absolute top-0 left-0 w-20 h-20 md:w-36 md:h-36 bg-gradient-to-br from-[#ffd400]/10 to-transparent border-t-2 border-l-2 rounded-tl-2xl z-20 backdrop-blur-[2px] transition-all duration-500 ${
            isActive
              ? "border-[#ffd400]/50"
              : "border-[#ffd400]/20 group-hover:border-[#ffd400]/45"
          }`}
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 30%, 30% 30%, 30% 100%, 0 100%)",
          }}
        >
          {/* Decorative Rivets */}
          <div className="absolute top-3 left-3 md:top-4 md:left-4 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#ffd400]/50" />
          <div className="absolute top-3 left-8 md:top-4 md:left-10 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#ffd400]/50" />
          <div className="absolute top-8 left-3 md:top-10 md:left-4 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#ffd400]/50" />
        </div>

        {/* ── BOTTOM-RIGHT HUD PIECE ── */}
        <div
          className={`absolute bottom-0 right-0 w-16 h-16 md:w-28 md:h-28 bg-gradient-to-tl from-[#ffd400]/15 to-transparent border-b-2 border-r-2 rounded-br-2xl z-20 backdrop-blur-[2px] transition-all duration-500 ${
            isActive
              ? "border-[#ffd400]/50"
              : "border-[#ffd400]/20 group-hover:border-[#ffd400]/45"
          }`}
          style={{
            clipPath:
              "polygon(100% 100%, 0 100%, 0 70%, 70% 70%, 70% 0, 100% 0)",
          }}
        >
          {/* Technical Lines */}
          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-8 md:w-12 h-1 bg-[#ffd400]/40" />
          <div className="absolute bottom-8 right-4 md:bottom-10 md:right-6 w-6 md:w-8 h-[1px] bg-[#ffd400]/40" />
        </div>

        {/* Main Image with Technical Cutout */}
        <div
          className="absolute inset-6 md:inset-10 z-10 overflow-hidden"
          style={{
            clipPath:
              "polygon(15% 0, 100% 0, 100% 65%, 85% 100%, 0 100%, 0 25%)",
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-all duration-700 scale-110 group-hover:scale-100 pointer-events-none ${
              isActive
                ? "grayscale-[0.5] brightness-[0.6] group-hover:grayscale-0 group-hover:brightness-100 opacity-90 md:grayscale md:brightness-[0.3]"
                : "grayscale brightness-[0.08] opacity-10 group-hover:opacity-30 group-hover:brightness-[0.2]"
            }`}
          />
          {/* Internal Scanlines */}
          <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 1px, #ffd400 1px, #ffd400 2px)",
              backgroundSize: "100% 3px",
            }}
          />

          {/* Holographic vertical laser scanning line on non-active cards */}
          {!isActive && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ffd400]/20 to-transparent w-full h-1/4 pointer-events-none z-20 animate-[scanline_3.5s_linear_infinite]" />
          )}
        </div>

        {/* Big ID Number */}
        <div
          className={`absolute top-3 right-5 md:top-5 md:right-6 z-30 transition-all duration-500 ${
            isActive
              ? "opacity-100 translate-y-0 scale-100 delay-[300ms]"
              : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
          }`}
        >
          <span
            className="text-[#ffd400] drop-shadow-[0_0_8px_rgba(255, 212, 0,0.4)] text-[12px] md:text-[15px] font-black tracking-wider leading-none"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {project.id}
          </span>
          <div className="h-[1.5px] w-full bg-[#ffd400]/60 mt-1" />
        </div>

        {/* Title & Stats */}
        <div
          className={`absolute bottom-5 left-5 md:bottom-8 md:left-8 pr-4 z-30 flex flex-col gap-1.5 md:gap-2 transition-all duration-500 ${
            isActive
              ? "opacity-100 translate-y-0 delay-[300ms]"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <h3
            className="text-[#ffd400] text-base md:text-lg font-medium uppercase tracking-tight"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {project.title}
          </h3>
          <div className="w-12 md:w-16 h-[1px] bg-[#ffd400]/60 mt-1" />
        </div>

        {/* Corner Decor Dots */}
        <div
          className={`absolute top-3 left-3 md:top-4 md:left-4 w-2 h-2 md:w-3 md:h-3 border border-[#ffd400]/30 rounded-full z-40 transition-all duration-500 ${
            isActive
              ? "opacity-100 delay-[300ms]"
              : "opacity-0 pointer-events-none"
          }`}
        />
        <div
          className={`absolute bottom-3 right-3 md:bottom-4 md:right-4 w-2 h-2 md:w-3 md:h-3 border border-[#ffd400]/30 rounded-full z-40 transition-all duration-500 ${
            isActive
              ? "opacity-100 delay-[300ms]"
              : "opacity-0 pointer-events-none"
          }`}
        />
      </div>
    </motion.div>
  );
};

// ─── Selected Work Heading Visualizer ───────────────────────────────────────────
function SelectedWorkHeadingVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 3.5, 8]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.85, 1],
    [1, 0.85, 0, 0],
  );

  return (
    <div ref={containerRef} className="relative w-full h-[180vh] z-20">
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div
          style={{ scale, opacity }}
          className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto pointer-events-none"
        >
          {/* Subtitle / Selected Records Line */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 w-full">
            <div className="w-8 md:w-16 h-[1px] bg-white shrink-0" />
            <span className="text-white font-mono text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.6em] font-black uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] text-center">
              SELECTED_RECORDS
            </span>
            <div className="w-8 md:w-16 h-[1px] bg-white shrink-0" />
          </div>

          {/* Main Section Title */}
          <h2
            className="text-white text-3xl sm:text-4xl md:text-7xl font-black uppercase tracking-wide text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            FEATURED <span className="text-[#ffd400]">WORKS</span>
          </h2>
        </motion.div>
      </div>
    </div>
  );
}

const RollingText = () => {
  const [text, setText] = useState("0000000000");
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const interval = setInterval(() => {
      let result = "";
      for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setText(result);
    }, 80);
    return () => clearInterval(interval);
  }, []);
  return <span className="text-[#ffd400]">{text}</span>;
};

export function SelectedWork() {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: carouselRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const totalProjects = PROJECTS.length;
    let newIndex = Math.floor(latest * totalProjects);
    if (newIndex >= totalProjects) newIndex = totalProjects - 1;
    if (newIndex !== index) {
      setIndex(newIndex);
    }
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative w-full bg-[#000000] z-10 overflow-clip flex flex-col items-center">
      {/* Background Matrix Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <SelectedWorkHeadingVisualizer />

      {/* Scroll-driven Carousel Section */}
      <div ref={carouselRef} className="relative w-full h-[300vh]">
        <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-24 flex flex-col items-center justify-center">
            {/* 3D Stack Container */}
            <div
              className="relative w-full max-w-[1200px] h-[400px] md:h-[480px] flex items-center justify-center perspective-[1000px] md:perspective-[1500px] [transform-style:preserve-3d]"
              style={{ transformStyle: "preserve-3d", touchAction: "none" }}
            >
              {PROJECTS.map((project, i) => {
                const isActive = i === index;
                const isPrev =
                  i === (index - 1 + PROJECTS.length) % PROJECTS.length;
                const isNext = i === (index + 1) % PROJECTS.length;

                return (
                  <HUDCard
                    key={project.id}
                    project={project}
                    isActive={isActive}
                    isPrev={isPrev}
                    isNext={isNext}
                    isMobile={isMobile}
                  />
                );
              })}
            </div>
          </div>

          {/* Terminal Overlay */}
          <div className="absolute top-6 right-4 md:top-10 md:right-10 font-mono text-[5px] md:text-[7px] hidden md:flex flex-col items-end gap-1 uppercase select-none pointer-events-none">
            <span className="text-white/60">
              PROJECT NAME:{" "}
              <span className="text-[#ffd400]">{PROJECTS[index].title}</span>
            </span>
            <span className="text-white/60">
              STATUS: <span className="text-[#ffd400]">ACTIVE</span>
            </span>
            <RollingText />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SelectedWork;
