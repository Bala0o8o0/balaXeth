"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { HoloWave } from "@/components/HoloWave";
import { CyberScanner } from "@/components/CyberScanner";
import { useEffect, useState, useRef } from "react";
import {
  Layout,
  Globe,
  Palette,
  Bot,
  Cloud,
  Terminal,
  Database,
} from "lucide-react";

// ─── 3D Matrix Visualizer ─────────────────────────────────────────────
function Matrix3DVisualizer() {
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
      className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-transparent"
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
              "linear-gradient(rgba(255, 212, 0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 212, 0,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Glowing Center Shaft */}
      <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#ffd400]/40 to-transparent shadow-[0_0_30px_#ffd400] pointer-events-none z-10" />

      {/* Rotating 3D Cylinder */}
      <motion.div
        animate={{ rotateY: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="relative w-full h-full flex items-center justify-center z-20"
        style={{ transformStyle: "preserve-3d", transform: "rotateX(-5deg)" }}
      >
        {/* Horizontal Rings */}
        <div
          className="absolute w-[240px] h-[240px] border-[2px] border-[#ffd400]/20 border-dashed rounded-full"
          style={{ transform: "rotateX(90deg) translateZ(40px)" }}
        />
        <div
          className="absolute w-[240px] h-[240px] border border-[#ffd400]/10 rounded-full"
          style={{ transform: "rotateX(90deg) translateZ(-40px)" }}
        />

        {/* Central DNA / Core */}
        <motion.div
          animate={{ rotateX: 360, rotateZ: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-12 h-12 border border-[#ffd400]/80 bg-[#ffd400]/10 flex items-center justify-center shadow-[0_0_20px_rgba(255, 212, 0,0.5)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="w-6 h-6 border border-[#ffd400] rotate-45" />
        </motion.div>

        {techNodes.map((node, i) => {
          const theta = i * (360 / techNodes.length);
          const radius = 120;
          const Icon = node.icon;
          return (
            <div
              key={i}
              className="absolute w-28 h-10 border border-[#ffd400]/60 bg-[#050000]/90 backdrop-blur-md flex items-center justify-start px-2 gap-2 shadow-[0_0_15px_rgba(255, 212, 0,0.4)] group overflow-hidden"
              style={{
                transform: `rotateY(${theta}deg) translateZ(${radius}px)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "visible",
              }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ffd400] transform translateZ(5px)" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ffd400] transform translateZ(5px)" />

              {/* Inner glitch scanline */}
              <motion.div
                animate={{ x: ["-100%", "300%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.2,
                }}
                className="absolute top-0 h-full w-4 bg-[#ffd400]/30 blur-md z-0"
              />

              {/* Node Content in 3D */}
              <div className="relative z-10 flex items-center gap-2 transform translateZ(10px)">
                <Icon className="w-[14px] h-[14px] text-[#ffd400] drop-shadow-[0_0_5px_rgba(255, 212, 0,0.8)]" />
                <span className="text-[#ffd400] text-[10px] font-mono font-bold tracking-widest drop-shadow-[0_0_5px_rgba(255, 212, 0,0.8)]">
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
        className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#ffd400]/10 to-transparent pointer-events-none z-30"
      />
    </div>
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
    <div className="flex flex-col items-center justify-center">
      <span
        className="text-xl md:text-2xl font-black text-[#ffd400] font-mono leading-none drop-shadow-[0_0_8px_rgba(255, 212, 0,0.5)]"
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {display}+
      </span>
      <span className="text-[8px] text-white/70 tracking-[0.27em] uppercase font-bold mt-1">
        {label}
      </span>
    </div>
  );
}

// ─── Pixel Grid Visualizer ──────────────────────────────────────────────────
function PixelGridVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverPos, setHoverPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const resize = () => {
      if (!canvas || !container || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    const cols = 18;
    const rows = 12;
    
    // Grid cell states (hue, opacity, noise)
    const grid: { phase: number; speed: number }[][] = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = {
          phase: Math.random() * Math.PI * 2,
          speed: 0.04 + Math.random() * 0.04,
        };
      }
    }

    let frame = 0;

    const draw = () => {
      frame++;
      
      // Clear with dark red tone instead of pure black to give depth
      ctx.fillStyle = "#030000";
      ctx.fillRect(0, 0, width, height);

      const cellW = width / cols;
      const cellH = height / rows;

      // Draw background grid lines (micro pixels)
      ctx.strokeStyle = "rgba(255, 212, 0, 0.04)";
      ctx.lineWidth = 0.5;
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cellW, 0);
        ctx.lineTo(c * cellW, height);
        ctx.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cellH);
        ctx.lineTo(width, r * cellH);
        ctx.stroke();
      }

      // Draw pixel matrix blocks
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const item = grid[r][c];
          
          // Animate base pulse
          item.phase += item.speed;
          const baseIntensity = 0.1 + Math.sin(item.phase) * 0.08;

          // Wave scanning effect
          const distToCenter = Math.sqrt(Math.pow(c - cols/2, 2) + Math.pow(r - rows/2, 2));
          const wave = Math.sin(distToCenter * 0.4 - frame * 0.06) * 0.5 + 0.5;
          
          // Hover distance check
          const pxX = c * cellW + cellW / 2;
          const pxY = r * cellH + cellH / 2;
          const distToHover = Math.sqrt(Math.pow(pxX - hoverPos.x, 2) + Math.pow(pxY - hoverPos.y, 2));
          
          let hoverFactor = 0;
          if (distToHover < 60) {
            hoverFactor = (1 - distToHover / 60) * 0.7;
          }

          // Combine intensity
          const intensity = Math.min(1.0, baseIntensity * 0.3 + wave * 0.35 + hoverFactor);

          // Draw filled block slightly smaller than cell to make pixel gaps
          const gap = 1.5;
          
          // Base red pixel
          ctx.fillStyle = `rgba(255, 212, 0, ${intensity})`;
          ctx.fillRect(
            c * cellW + gap,
            r * cellH + gap,
            cellW - gap * 2,
            cellH - gap * 2
          );

          // Render micro glowing core in hot spots
          if (intensity > 0.6) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            ctx.fillRect(
              c * cellW + cellW/2 - 1,
              r * cellH + cellH/2 - 1,
              2,
              2
            );
          }
        }
      }

      // Add a scan line
      const scanY = (Math.sin(frame * 0.015) * 0.5 + 0.5) * height;
      ctx.strokeStyle = "rgba(255, 212, 0, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      // CRT Scanline Overlay
      ctx.fillStyle = "rgba(255, 212, 0, 0.03)";
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setHoverPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseLeave = () => {
      setHoverPos({ x: -1000, y: -1000 });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [hoverPos]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center rounded">
      <canvas ref={canvasRef} className="absolute inset-0 block cursor-crosshair" />
    </div>
  );
}

// ─── Main About Section ───────────────────────────────────────────────────────
export function AboutSection() {
  const hexBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cpath fill='none' stroke='%23FF0000' stroke-width='0.5' stroke-opacity='0.08' d='M13.9 0L27.8 8v16L13.9 32L0 24V8zM0 49l13.9-8l13.9 8'/%3E%3C/svg%3E")`;

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const targetRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  
  // 0% to 75% scroll handles horizontal movement. 75% to 100% handles the zoom.
  const x = useTransform(scrollYProgress, [0, 0.75, 1], ["0%", "-66.6666%", "-66.6666%"]);
  
  // Zoom transforms for the HUD panel
  const hudScale = useTransform(scrollYProgress, [0.75, 1], [1, 20]);
  const hudOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);
  const hudFilter = useTransform(scrollYProgress, [0.85, 1], ["blur(0px)", "blur(20px)"]);
  
  // Translate the HUD to the center of the screen while zooming
  const hudX = useTransform(scrollYProgress, [0.75, 1], ["0px", isDesktop ? "-372px" : "0px"]);
  const hudY = useTransform(scrollYProgress, [0.75, 1], ["0px", isDesktop ? "0px" : "220px"]);
  
  // Fade out other elements quickly at the start of the zoom
  const otherOpacity = useTransform(scrollYProgress, [0.75, 0.8], [1, 0]);

  return (
    <section
      id="about"
      ref={targetRef}
      className="relative w-full h-[400vh] bg-transparent z-10"
    >
      <div className="absolute inset-0 bg-[#000000]/60 pointer-events-none z-0 h-full w-full" />

      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden z-10">
        <motion.div style={{ x }} className="flex w-[300vw] h-full items-center">
          
          {/* CARD 1 WRAPPER */}
          <div className="w-screen h-full flex-shrink-0 flex items-center justify-center px-4 md:px-12 lg:px-24">
            {/* CARD 1: IDENTITY SUMMARY CARD */}
            <motion.div 
              initial={{ opacity: 0, x: 250 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              viewport={{ margin: "-100px", once: true }}
              className="w-full max-w-6xl mx-auto p-[1px] z-10"
            >
            <div 
              className="relative bg-[#050000]/95 backdrop-blur-md border border-[#ffd400]/30 min-h-[480px] p-6 md:p-12 flex flex-col justify-between shadow-[0_20px_50px_rgba(255, 212, 0,0.15)] overflow-hidden"
              style={{ 
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))',
                backgroundImage: hexBg,
                backgroundRepeat: 'repeat'
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-[20px] right-[40px] h-[2px] bg-[#ffd400]/70" />
              {/* Bottom left warning slashes */}
              <div className="absolute bottom-[6px] left-4 flex gap-1 opacity-60">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1.5 h-2.5 bg-[#ffd400] skew-x-12" />
                ))}
              </div>
              {/* Bottom right double line accent */}
              <div className="absolute bottom-[6px] right-4 w-28 h-[2px] bg-[#ffd400]/60" />
              <div className="absolute bottom-[11px] right-4 w-20 h-[1px] bg-[#ffd400]/40" />

              {/* Content Stack */}
              <div className="flex flex-col gap-6 relative z-10 h-full justify-between my-auto pt-2">
                
                {/* 1. TOP: Name & Clean Professional Header */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-[#ffd400]/10 pb-4 relative z-10">
                    <span className="text-[#ffd400]/60 font-mono text-[10px] tracking-wider">
                      
                    </span>
                    <div className="text-[9px] font-mono text-[#ffd400]/65 uppercase tracking-widest">
                      Status: Active
                    </div>
                  </div>

                  <h2
                    className="text-[#ffd400] text-3xl sm:text-4xl md:text-5xl font-black leading-none drop-shadow-[0_0_15px_rgba(255, 212, 0,0.4)] tracking-tighter uppercase"
                    style={{ fontFamily: "var(--font-orbitron)" }}
                  >
                    BALA <span className="text-white">MURUGAN</span>
                  </h2>
                </div>

                {/* 2. MIDDLE: Bio Summary */}
                <div
                  className="space-y-6 text-[#9CA3AF] font-sans text-[16px] md:text-[19px] leading-relaxed text-left max-w-4xl"
                  style={{
                    fontFamily: "var(--font-rajdhani)",
                    letterSpacing: "0.05em",
                  }}
                >
                  <p
                    className="text-[20px] sm:text-2xl md:text-3xl font-bold border-l-4 border-[#ffd400] pl-4 py-2 bg-[#ffd400]/5 text-white"
                    style={{ fontFamily: "var(--font-rajdhani)" }}
                  >
                    I am an{" "}
                    <span className="text-[#ffd400]">
                      AI Product Developer
                    </span>{" "}
                    and Digital Architect.
                  </p>
                  <p className="opacity-95 text-[#ffd400]/90 font-medium">
                    Where i build end-to-end AI-powered web products from idea
                    to deployment, combining design, frontend, and full-stack
                    development into seamless applications.
                  </p>
                  <p className="opacity-90">
                    I apply AI models, prompt engineering, fine-tuning, and RAG
                    systems to create intelligent, scalable products that are
                    fast, user-focused, and ready for real-world use.
                  </p>
                </div>

                {/* 3. BOTTOM: Cyberpunk Circuit Styled Action Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-[#ffd400]/10">
                  <a href="#contact" className="w-auto relative z-10">
                    {/* Cyberpunk Circuit Style Button */}
                    <button className="relative px-8 py-3.5 bg-transparent text-[#ffd400] font-black tracking-[0.2em] uppercase text-xs hover:text-white transition-all duration-300 flex justify-center items-center group cursor-pointer">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-visible" viewBox="0 0 200 50" preserveAspectRatio="none">
                        <path 
                          d="M 15,1 L 185,1 L 199,15 L 199,35 L 185,49 L 15,49 L 1,35 L 1,15 Z" 
                          fill="rgba(255, 212, 0, 0.05)" 
                          stroke="#ffd400" 
                          strokeWidth="1.5"
                          className="group-hover:fill-[#ffd400]/25 transition-all duration-300"
                        />
                        <path d="M 15,1 L -5,1 L -12,8 L -12,16" fill="none" stroke="#ffd400" strokeWidth="1" strokeDasharray="3,3" className="opacity-60" />
                        <circle cx="-12" cy="16" r="2" fill="#ffd400" className="opacity-80" />
                        <path d="M 185,49 L 205,49 L 212,41 L 212,33" fill="none" stroke="#ffd400" strokeWidth="1" strokeDasharray="3,3" className="opacity-60" />
                        <circle cx="212" cy="33" r="2" fill="#ffd400" className="opacity-80" />
                      </svg>
                      <span className="relative z-10 flex items-center gap-2 group-hover:drop-shadow-[0_0_8px_#ffd400] transition-all" style={{ fontFamily: "var(--font-orbitron)" }}>
                        CONTACT ME
                      </span>
                    </button>
                  </a>
                  <div className="flex flex-col font-mono text-[9px] text-left sm:text-right">
                    <span className="text-[#ffd400] tracking-[0.2em] font-bold uppercase animate-pulse">
                      
                    </span>
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          </div>

          {/* CARD 2 WRAPPER */}
          <div className="w-screen h-full flex-shrink-0 flex items-center justify-center px-4 md:px-12 lg:px-24">
            {/* CARD 2: DEVELOPMENT STACK & VISUALIZER */}
            <motion.div 
              initial={{ opacity: 0, x: 250 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              viewport={{ margin: "-100px", once: true }}
              className="w-full max-w-5xl mx-auto p-[1px] z-20"
            >
              <div 
                className="w-full relative bg-[#050000]/95 backdrop-blur-md border border-[#ffd400]/30 min-h-[460px] p-6 md:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(255, 212, 0,0.15)] overflow-hidden"
                style={{ 
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))',
                  backgroundImage: hexBg,
                  backgroundRepeat: 'repeat'
                }}
              >
                <div className="absolute top-0 left-[20px] right-[40px] h-[2px] bg-[#ffd400]/70" />
                <div className="absolute bottom-[6px] left-4 flex gap-1 opacity-60">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-1.5 h-2.5 bg-[#ffd400] skew-x-12" />
                  ))}
                </div>
                <div className="absolute bottom-[6px] right-4 w-28 h-[2px] bg-[#ffd400]/60" />
                <div className="absolute bottom-[11px] right-4 w-20 h-[1px] bg-[#ffd400]/40" />

                <div className="flex flex-col gap-4 relative z-10 h-full justify-between my-auto pt-2">
                  <div className="flex items-center justify-between border-b border-[#ffd400]/10 pb-4 relative z-10">
                    <h3 className="text-white text-md font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-orbitron)" }}>
                      TECH STACK
                    </h3>
                    <div className="text-[9px] font-mono text-[#ffd400]/65 uppercase tracking-widest">
                      Status: Verified
                    </div>
                  </div>

                  {/* Dev stack layout */}
                  <div className="flex-1 relative flex flex-col md:flex-row gap-6 md:gap-8 items-stretch pt-2">
                    
                    {/* Just the 3D Model on the left */}
                    <div className="w-full md:w-[320px] lg:w-[400px] flex-shrink-0 relative flex items-center justify-center border border-[#ffd400]/15 bg-[#0c0303]/90 overflow-hidden rounded-sm min-h-[300px]">
                      <Matrix3DVisualizer />
                    </div>

                    {/* Tech list on the right */}
                    <div className="flex-1 relative border border-[#ffd400]/15 bg-[#0c0303]/90 p-6 flex flex-col gap-6 justify-center rounded-sm">
                      <div className="flex items-center gap-1.5 border-b border-[#ffd400]/20 pb-2">
                        <span className="text-[12px] text-[#ffd400] tracking-[0.2em] uppercase font-bold font-mono">
                          
                        </span>
                      </div>
                      <div className="flex flex-col gap-5 font-mono">
                        {["JAVASCRIPT", "TYPESCRIPT", "PYTHON", "HTML/CSS"].map((lang, i) => (
                          <div key={lang} className="flex justify-between items-center text-[13px] border-b border-[#ffd400]/5 pb-2">
                            <span className="text-white/60 tracking-wider font-semibold">{lang}</span>
                            <span className="text-[#ffd400]/85 text-[11px] font-bold">S_{String(i + 1).padStart(2, "0")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end font-mono text-[7px] text-[#ffd400]/40 pt-1 pointer-events-none">
                    
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CARD 3 WRAPPER */}
          <div className="w-screen h-full flex-shrink-0 flex items-center justify-center px-4 md:px-12 lg:px-24">
            {/* CARD 3: SYSTEM STATS & CAPABILITIES */}
            <motion.div 
              initial={{ opacity: 0, x: 250 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              viewport={{ margin: "-100px", once: true }}
              className="w-full max-w-5xl mx-auto z-30"
            >
            {/* flex-row-reverse moves the dial to the right side on desktop */}
            <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-8 items-center w-full min-h-[460px] relative">
              
              {/* Right Column: Cyberpunk Angular HUD Stats Panel */}
              <motion.div 
                style={{ scale: hudScale, x: hudX, y: hudY, opacity: hudOpacity, filter: hudFilter, transformOrigin: 'center center' }}
                className="relative w-[250px] h-[270px] md:w-[280px] md:h-[300px] flex-shrink-0 flex items-center justify-center z-10"
              >
                
                {/* Outer angular frame with clipped corners */}
                <div 
                  className="absolute inset-0 border border-[#ffd400]/35 bg-[#050000]/90"
                  style={{ clipPath: 'polygon(14px 0%, calc(100% - 14px) 0%, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0% calc(100% - 14px), 0% 14px)' }}
                />

                {/* Red top bar accent */}
                <div className="absolute top-0 left-[14px] right-[14px] h-[2px] bg-[#ffd400]" />
                {/* Bottom bar accent */}
                <div className="absolute bottom-0 left-[14px] right-[14px] h-[1px] bg-[#ffd400]/50" />

                {/* Corner dot markers (no L-shapes) */}
                <div className="absolute top-[6px] left-[6px] w-1.5 h-1.5 bg-[#ffd400] shadow-[0_0_6px_#ffd400]" />
                <div className="absolute top-[6px] right-[6px] w-1.5 h-1.5 bg-[#ffd400] shadow-[0_0_6px_#ffd400]" />
                <div className="absolute bottom-[6px] left-[6px] w-1.5 h-1.5 bg-[#ffd400]/60" />
                <div className="absolute bottom-[6px] right-[6px] w-1.5 h-1.5 bg-[#ffd400]/60" />

                {/* Left side vertical accent line */}
                <div className="absolute left-0 top-[14px] bottom-[14px] w-[1px] bg-gradient-to-b from-[#ffd400]/60 via-[#ffd400]/15 to-[#ffd400]/60" />
                {/* Right side vertical accent line */}
                <div className="absolute right-0 top-[14px] bottom-[14px] w-[1px] bg-gradient-to-b from-[#ffd400]/60 via-[#ffd400]/15 to-[#ffd400]/60" />

                {/* Scanning horizontal line animation */}
                <motion.div
                  animate={{ top: ["10%", "90%", "10%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd400]/50 to-transparent pointer-events-none z-10"
                />

                {/* Projects Stat (Top) */}
                <div className="absolute top-6 left-5 right-5 flex justify-between items-center z-20 border-b border-[#ffd400]/20 pb-1.5">
                  <span className="text-[9px] font-mono text-white/60 tracking-wider">PROJECTS</span>
                  <span className="text-xl font-bold font-mono text-[#ffd400] drop-shadow-[0_0_6px_#ffd400]" style={{ fontFamily: "var(--font-orbitron)" }}>11+</span>
                </div>

                {/* Pixel Matrix Visualizer (Center) */}
                <div className="absolute top-[58px] bottom-[58px] left-[14px] right-[14px] bg-[#020000] border border-[#ffd400]/15 overflow-hidden">
                  <PixelGridVisualizer />
                </div>

                {/* Tech Tools Stat (Bottom) */}
                <div className="absolute bottom-6 left-5 right-5 flex justify-between items-center z-20 border-t border-[#ffd400]/20 pt-1.5">
                  <span className="text-[9px] font-mono text-white/60 tracking-wider">TECH TOOLS</span>
                  <span className="text-xl font-bold font-mono text-[#ffd400] drop-shadow-[0_0_6px_#ffd400]" style={{ fontFamily: "var(--font-orbitron)" }}>50+</span>
                </div>

                {/* Bottom warning slashes */}
                <div className="absolute bottom-[5px] left-[18px] flex gap-0.5 opacity-50">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 h-2 bg-[#ffd400] skew-x-12" />
                  ))}
                </div>
              </motion.div>

              {/* Technical connector pipe (aligned to the right side connection points) */}
              <motion.div style={{ opacity: otherOpacity }} className="absolute right-[220px] md:right-[260px] lg:right-[270px] w-8 h-[2px] bg-[#ffd400]/40 z-0 hidden lg:block" />

              {/* Left Column: Connected Data Screen Box */}
              <motion.div 
                className="flex-1 w-full relative bg-[#050000]/95 backdrop-blur-md border border-[#ffd400]/30 min-h-[420px] p-6 md:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(255, 212, 0,0.15)] overflow-hidden"
                style={{ 
                  opacity: otherOpacity,
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))',
                  backgroundImage: hexBg,
                  backgroundRepeat: 'repeat'
                }}
              >
                <div className="absolute top-0 left-[20px] right-[40px] h-[2px] bg-[#ffd400]/70" />
                <div className="absolute bottom-[6px] left-4 flex gap-1 opacity-60">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-1.5 h-2.5 bg-[#ffd400] skew-x-12" />
                  ))}
                </div>
                <div className="absolute bottom-[6px] right-4 w-28 h-[2px] bg-[#ffd400]/60" />
                <div className="absolute bottom-[11px] right-4 w-20 h-[1px] bg-[#ffd400]/40" />

                <div className="flex flex-col gap-4 relative z-10 h-full justify-between my-auto pt-2">
                  <div className="flex items-center justify-between border-b border-[#ffd400]/10 pb-4 relative z-10">
                    <h3 className="text-white text-md font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-orbitron)" }}>
                      CAPABILITIES
                    </h3>
                    <div className="text-[9px] font-mono text-[#ffd400]/65 uppercase tracking-widest">
                      Status: Verified
                    </div>
                  </div>

                  {/* Capabilities specs */}
                  <div className="w-full relative border border-[#ffd400]/15 bg-[#0c0303]/90 p-5 flex flex-col gap-3 justify-center rounded-sm">
                    <div className="flex items-center gap-1.5 border-b border-[#ffd400]/20 pb-1.5">
                      <span className="text-[10px] text-[#ffd400] tracking-[0.2em] uppercase font-bold font-mono">
                        CAPABILITIES
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 font-mono">
                      {[
                        ["USER INTERFACE", "ACTIVE"],
                        ["FULL STACK MVP", "ACTIVE"],
                        ["AI INTEGRATION", "ACTIVE"],
                        ["RAG", "ACTIVE"],
                        ["FINE TUNING", "ACTIVE"],
                        ["PRODUCT DESIGN", "ACTIVE"],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between items-center text-[10px] border-b border-[#ffd400]/5 pb-1">
                          <span className="text-white/60 tracking-wider">{label}</span>
                          <span className="text-[#ffd400] font-black opacity-85 text-[9px]">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center font-mono text-[7px] text-[#ffd400]/40 pt-1 pointer-events-none">
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </motion.div>

            </div>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
