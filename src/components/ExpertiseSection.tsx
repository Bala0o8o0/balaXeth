"use client";

import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import TiltedCard from "./TiltedCard";
import {
  Terminal,
  Bot,
  Brain,
  Palette,
  Database,
  Box,
  Rocket,
  Sparkles,
  Link,
  Sliders,
  Workflow,
} from "lucide-react";

// â”€â”€â”€ Watch Crown Audio Synthesizer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function useWatchCrownSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const muted = useRef(false);

  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) ctxRef.current = new AC();
    }
    if (ctxRef.current?.state === "suspended") ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  }, []);

  // Mechanical watch crown tick â€” tiny metallic click
  const playTick = useCallback(() => {
    if (muted.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    try {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 18);
      }
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();
      const bpf = ctx.createBiquadFilter();
      bpf.type = "bandpass";
      bpf.frequency.value = 3800;
      bpf.Q.value = 0.6;
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      src.buffer = buf;
      src.connect(bpf);
      bpf.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch (e) {}
  }, [getCtx]);

  // Deep detent click â€” when a card is "selected"
  const playDetent = useCallback(() => {
    if (muted.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1200, t);
      osc1.frequency.exponentialRampToValueAtTime(320, t + 0.06);
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(2400, t);
      osc2.frequency.exponentialRampToValueAtTime(600, t + 0.04);
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(t); osc1.stop(t + 0.08);
      osc2.start(t); osc2.stop(t + 0.05);
    } catch (e) {}
  }, [getCtx]);

  return { playTick, playDetent, muted };
}

// ─── Single Skill Card ────────────────────────────────────────────────────────
interface SkillItem {
  title: string;
  sub: string;
  skills: string[];
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  index: number;
  totalCards: number;
  scrollYProgress: import("framer-motion").MotionValue<number>;
  onHover: () => void;
  onClick: () => void;
}

function SkillCard({ title, sub, skills, icon: Icon, index, totalCards, scrollYProgress, onHover, onClick }: SkillItem) {
  const cardNumber = String(index + 1).padStart(2, "0");

  // Calculate animation ranges for this specific card
  const a = index === 0 ? 0 : (index - 0.3) / totalCards;
  const b = index === 0 ? 0 : index / totalCards;
  const c = (index + 0.7) / totalCards;
  const d = (index + 1) / totalCards;

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  
  const x = useTransform(smoothProgress, [a, b, c, d], [1200, 0, 0, -1200]);
  const opacity = useTransform(smoothProgress, [a, b, c, d], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [a, b, c, d], [0.7, 1, 1, 0.7]);
  const rotateY = useTransform(smoothProgress, [a, b, c, d], [45, 0, 0, -45]);

  return (
    <motion.div
      style={{ 
        x, 
        opacity, 
        scale,
        rotateY,
        perspective: "1200px",
        zIndex: totalCards - index
      }}
      className="absolute flex-shrink-0 w-[340px] sm:w-[400px] md:w-[460px] lg:w-[500px] h-[460px] md:h-[500px] cursor-pointer group pointer-events-auto"
      onMouseEnter={onHover}
      onClick={onClick}
    >
      <TiltedCard
        containerHeight="100%"
        containerWidth="100%"
        imageHeight="100%"
        imageWidth="100%"
        rotateAmplitude={12}
        scaleOnHover={1.05}
        showMobileWarning={false}
        showTooltip={false}
        displayOverlayContent={true}
        overlayContent={
          <div className="relative z-10 flex flex-col h-full px-6 pb-6 pt-10 md:px-8 md:pb-8 md:pt-12 pointer-events-none [transform-style:preserve-3d]">
            {/* Top Header Row - Minimal Nothing HUD */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ffd400] shadow-[0_0_8px_#ffd400]" />
                <span className="text-[10px] md:text-xs font-mono font-bold text-white/80 tracking-[0.2em] uppercase">
                  CAPABILITY <span className="text-[#ffd400]">[{cardNumber}]</span>
                </span>
              </div>
              <span className="text-[10px] md:text-xs font-mono text-white/40 tracking-[0.2em]">
                {cardNumber} / {String(totalCards).padStart(2, "0")}
              </span>
            </div>

            {/* Large icon block */}
            <div
              className="relative w-full mb-6 flex items-center justify-center shrink-0 rounded-lg [transform-style:preserve-3d]"
              style={{ height: "140px" }}
            >
              {/* Target reticle rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none [transform-style:preserve-3d]">
                <div className="absolute rounded-full border w-24 h-24 md:w-28 md:h-28 border-[#ffd400]/40 [transform:translateZ(20px)]" />
                <div className="absolute rounded-full border w-16 h-16 md:w-20 md:h-20 border-[#ffd400]/60 [transform:translateZ(40px)]" />
              </div>

              {/* Central icon */}
              <Icon
                className="relative z-10 text-[#ffd400] drop-shadow-[0_0_20px_rgba(255,212,0,0.9)] scale-110 [transform:translateZ(60px)]"
                style={{ width: 52, height: 52 }}
              />
            </div>

            {/* Category title */}
            <div className="flex flex-col items-center text-center">
              <h3
                className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none mb-2 text-[#ffd400]"
                style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "-0.02em" }}
              >
                {title}
              </h3>
              <p className="text-[10px] md:text-xs font-mono text-white/60 tracking-[0.2em] uppercase mb-5">{sub}</p>
            </div>

            {/* Skill badges */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 flex-1 content-start">
              {skills.slice(0, 8).map((skill, si) => (
                <span
                  key={si}
                  className="px-3 py-1 text-[9px] md:text-[10px] font-mono font-bold tracking-widest uppercase border rounded border-[#ffd400]/60 text-[#ffd400] bg-[#ffd400]/10 shadow-[0_0_10px_rgba(255,212,0,0.15)]"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 8 && (
                <span className="px-3 py-1 text-[9px] md:text-[10px] font-mono text-white/50 border border-white/20 rounded">
                  +{skills.length - 8}
                </span>
              )}
            </div>


          </div>
        }
      >
        <div className="relative w-full overflow-hidden h-full rounded-[24px]">
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Nothing OS style Dot Matrix Corner Accents */}
          <div className="absolute top-[16px] left-[16px] flex gap-1 z-20 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ffd400]" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </div>
          <div className="absolute top-[16px] right-[16px] flex gap-1 z-20 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#ffd400]" />
          </div>
          <div className="absolute bottom-[16px] left-[16px] flex gap-1 z-20 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </div>
          <div className="absolute bottom-[16px] right-[16px] flex gap-1 z-20 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ffd400]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#ffd400]" />
          </div>
        </div>
      </TiltedCard>
    </motion.div>
  );
}

// ─── Skills Horizontal Card Gallery ───────────────────────────────────────────
function SkillsCardGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const { playTick, playDetent } = useWatchCrownSound();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const totalCards = EXPERTISE_ITEMS.length;

  // Fire watch crown tick at each card boundary while scrolling
  useEffect(() => {
    let lastCard = -1;
    let lastTick = 0;
    const unsub = scrollYProgress.on("change", (v) => {
      // Tick frequently on scroll (tactile feel)
      if (Math.abs(v - lastTick) > 0.015) {
        playTick();
        lastTick = v;
      }

      const cardIdx = Math.round(v * (totalCards - 1));
      if (cardIdx !== lastCard && cardIdx >= 0 && cardIdx < totalCards) {
        lastCard = cardIdx;
        setActiveCard(cardIdx);
      }
    });
    return unsub;
  }, [scrollYProgress, totalCards, playTick]);

  return (
    <div ref={sectionRef} className="relative w-full" style={{ height: `${totalCards * 100}vh` }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Center Stacking Cards */}
        <div className="relative w-full flex-1 flex items-center justify-center pointer-events-none">
          {EXPERTISE_ITEMS.map((item, idx) => (
            <SkillCard
              key={idx}
              index={idx}
              totalCards={totalCards}
              scrollYProgress={scrollYProgress}
              title={item.title}
              sub={item.sub}
              skills={item.skills}
              icon={item.icon}
              onHover={playTick}
              onClick={() => { setActiveCard(idx); playDetent(); }}
            />
          ))}
        </div>

        {/* Desktop Vertical Progress Tracker - Left side */}
        <div className="hidden md:flex absolute left-8 lg:left-12 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-6 pointer-events-none">
          <span className="text-[10px] font-mono text-white/50 tracking-widest">01</span>
          <div className="w-[2px] h-[200px] lg:h-[300px] bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-[#ffd400]"
              style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
            />
          </div>
          <span className="text-[10px] font-mono text-[#ffd400] tracking-widest">
            {String(totalCards).padStart(2, "0")}
          </span>
          <div className="flex flex-col items-center justify-center gap-2.5 mt-2">
            {EXPERTISE_ITEMS.map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-300 ${
                  i === activeCard
                    ? "h-6 w-1.5 bg-[#ffd400] shadow-[0_0_8px_#ffd400]"
                    : "h-1.5 w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Horizontal Progress Tracker - Bottom */}
        <div className="absolute bottom-8 left-6 right-6 md:hidden z-40 pointer-events-none">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <span className="text-[10px] font-mono text-white/50 tracking-widest w-8 text-right">01</span>
            <div className="flex-1 h-[2px] bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-white to-[#ffd400]"
                style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
              />
            </div>
            <span className="text-[10px] font-mono text-[#ffd400] tracking-widest w-8">
              {String(totalCards).padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2.5 mt-4">
            {EXPERTISE_ITEMS.map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-300 ${
                  i === activeCard
                    ? "w-6 h-1.5 bg-[#ffd400] shadow-[0_0_8px_#ffd400]"
                    : "w-1.5 h-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const EXPERTISE_ITEMS = [
  {
    title: "Web Development",
    sub: "Next.js & React Ecosystem",
    skills: [
      "React.js",
      "Next.js",
      "JS/TS",
      "Tailwind CSS",
      "FRAMER MOTION",
      "GSAP",
      "THREE.JS",
      "WEBGL",
    ],
    className: "",
    icon: Terminal,
  },
  {
    title: "AI Agents / MCPs / IDEs",
    sub: "Autonomous Systems Architecture",
    skills: [
      "Antigravity",
      "claude code",
      "Cursor",
      "Google AI Studio",
      "Open Code/DESIGN",
      "QWEN CODE",
      "HERMES AGENT",
      "MCP Servers",
    ],
    className: "",
    icon: Bot,
  },

  {
    title: "AI Model Integration",
    sub: "LLMs & Vision Systems",
    skills: [
      "GOOGLE models",
      "OpenAI",
      "Replicate",
      "Qwen",
      "open-router",
      "ollama",
      "groq",
      "HUGGINGFACE",
    ],
    className: "",
    icon: Brain,
  },
  {
    title: "AI Agent Development",
    sub: "Agentic UI & SDK Ecosystems",
    skills: [
      "Mastra AI",
      "CopilotKit",
      "Vercel AI SDK",
      "LangChain",
      "CrewAI",
      "ChromaDB",
      "Supabase vector",
    ],
    className: "",
    icon: Workflow,
  },
  {
    title: "Fine Tuning `qlora`",
    sub: "Model Optimization & Alignment",
    skills: ["Unsloth", "Unsloth Studio"],
    className: "",
    icon: Sliders,
  },

  {
    title: "Backends",
    sub: "Scalable Cloud Infrastructure",
    skills: ["Supabase", "Convex", "Prisma", "inforge", "PostgreSQL"],
    className: "",
    icon: Database,
  },

  {
    title: "3D Rendering",
    sub: "Three.js & WebGL Visuals",
    skills: ["Spline", "Three.js", "GLSL", "Blender", "tripo ai", "meshy ai"],
    className: "",
    icon: Box,
  },
  {
    title: "Deployment",
    sub: "Vercel & AWS Edge Services",
    skills: ["Vercel", "Netlify", "Railway"],
    className: "",
    icon: Rocket,
  },
  {
    title: "Web Design",
    sub: "UI/UX & Interactive Design",
    skills: ["Figma", "GOOGLE STITCH", "WIX", "WORDPRESS"],
    className: "",
    icon: Palette,
  },
  {
    title: "Generative Design",
    sub: "Creative AI Tooling Systems",
    skills: ["Stable Diffusion", "civit ai", "Photoshop", "tensor art", "flux"],
    className: "",
    icon: Sparkles,
  },
  {
    title: "Web3 & Blockchain",
    sub: "DApp Smart Contracts",
    skills: ["Solidity", "next.js", "Thirdweb", "Ethers.js", "Web3Auth"],
    className: "",
    icon: Link,
  },
];

// â”€â”€â”€ Dragon Network Visualizer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DragonNetworkVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking for the sticky section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Dramatic zoom effect: scale the center up massively as user scrolls
  // We use scroll ranges to determine when to scale up, scale down, and fade
  const centerScale = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [1, 1.5, 15, 20]);
  const centerOpacity = useTransform(scrollYProgress, [0, 0.7, 0.9, 1], [1, 1, 0, 0]);
  
  // Background hexagon blur and fade
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 0.3, 0]);
  const bgBlur = useTransform(scrollYProgress, [0, 0.3, 0.5], ["blur(0px)", "blur(10px)", "blur(20px)"]);
  
  // Fade out the surrounding network nodes early so they don't block the zoom
  const networkOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const networkScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.5]);

  const nodes = [
    "UI DESIGN",
    "WEB-APPS",
    "BACKEND & DB's",
    "AI MODELS",
    "FINE TUNING",
    "Generative UI",
    "WEB3",
    "AI AGENTS",
  ];

  const [radius, setRadius] = useState(310);

  useEffect(() => {
    const handleResize = () => setRadius(window.innerWidth < 768 ? 285 : 310);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[250vh] z-10 my-10">
      {/* Sticky container that stays fixed while scrolling the h-[250vh] parent */}
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* The visualizer wrapper */}
        <div className="relative w-[660px] h-[660px] flex items-center justify-center transform scale-[0.4] min-[375px]:scale-[0.45] min-[430px]:scale-[0.5] sm:scale-[0.75] md:scale-100 origin-center">
          
          {/* Outer Nodes - fade and scale out early */}
          <motion.div 
            className="absolute inset-0"
            style={{ opacity: networkOpacity, scale: networkScale }}
          >
            {/* Simplified Outer Frame (Static) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] md:w-[500px] md:h-[500px] rounded-[100px] border border-[#ffd400]/10 border-dashed rotate-45 z-0" />

            {nodes.map((node, i) => {
              const angle = (i * 360) / nodes.length;
              const angleRad = (angle - 90) * (Math.PI / 180);
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;
              const cardHW = 76,
                cardHH = 27;
              const absCos = Math.abs(Math.cos(angleRad));
              const absSin = Math.abs(Math.sin(angleRad));
              const tW = absCos < 0.0001 ? Infinity : cardHW / absCos;
              const tH = absSin < 0.0001 ? Infinity : cardHH / absSin;
              const edgeOffset = Math.min(tW, tH);
              const dotDist = radius - edgeOffset;

              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 w-0 h-0"
                  style={{ zIndex: 10 }}
                >
                  <div
                    className="absolute left-0 top-0 origin-left"
                    style={{
                      width: `${dotDist}px`,
                      height: `1px`,
                      transform: `translateY(-50%) rotate(${angle - 90}deg)`,
                      background:
                        "linear-gradient(to right, transparent, rgba(255, 212, 0,0.12) 20%, rgba(255, 212, 0,0.4) 100%)",
                      zIndex: 5,
                    }}
                  >
                    {/* Flowing light pulse animation to give the network life */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#ffdf33] to-transparent"
                      style={{
                        width: "80px",
                        filter: "drop-shadow(0 0 5px #ffd400)",
                      }}
                      animate={{
                        left: ["-80px", `${dotDist}px`],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      left: `${Math.cos(angleRad) * dotDist}px`,
                      top: `${Math.sin(angleRad) * dotDist}px`,
                      transform: "translate(-50%, -50%)",
                      zIndex: 35,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#ffd400",
                        boxShadow: "0 0 8px #ffd400",
                      }}
                    />
                  </div>

                  <div
                    className="absolute z-20 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}px`, top: `${y}px` }}
                  >
                    <div
                      className="relative w-[152px] h-[54px] cursor-default"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                      }}
                    >
                      <div className="absolute inset-0 bg-[#000000]/90" />
                      <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                          backgroundImage:
                            "linear-gradient(#ffd400 1px, transparent 1px), linear-gradient(90deg, #ffd400 1px, transparent 1px)",
                          backgroundSize: "8px 8px",
                        }}
                      />
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffd400]/50 to-transparent" />

                      <div
                        className="absolute inset-0 border border-[#ffd400]/20"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                        }}
                      />

                      <div className="absolute top-0 right-[12px] w-[17px] h-[1px] bg-[#ffd400]/40 origin-right rotate-[-45deg] translate-y-[6px] translate-x-[6px]" />
                      <span className="absolute top-[4px] left-[6px] text-[7px] font-mono text-[#ffd400]/30 tracking-widest">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <div className="absolute bottom-[6px] right-[8px] w-[3px] h-[3px] rounded-full bg-[#ffd400]/50" />

                      <span
                        className="absolute inset-0 flex items-center justify-center text-[10px] md:text-[11px] font-black tracking-widest text-[#ffdf33]/90 uppercase text-center leading-tight px-1"
                        style={{
                          fontFamily: "var(--font-orbitron)",
                          textShadow: "0 0 8px rgba(255, 212, 0,0.5)",
                        }}
                      >
                        {node}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Central Zooming Dragon */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[160px] h-[160px] md:w-[200px] md:h-[200px] flex items-center justify-center group"
          >
            <motion.div 
              className="absolute inset-[15px] rounded-full border border-[#ffd400]/10 border-dashed"
              style={{ opacity: bgOpacity, filter: bgBlur }}
            />
            <div className="relative w-[130px] h-[112px] md:w-[150px] md:h-[130px] flex items-center justify-center">
              <motion.div
                className="absolute inset-0 bg-[#ffd400]/80"
                style={{
                  clipPath:
                    "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  opacity: bgOpacity,
                  filter: bgBlur
                }}
              >
                <div
                  className="absolute inset-[2px] bg-[#000000] overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(#ffd400 1px, transparent 1px), linear-gradient(90deg, #ffd400 1px, transparent 1px)",
                      backgroundSize: "10px 10px",
                    }}
                  />
                </div>
              </motion.div>
              <motion.img
                src="/assets/dragon_logo.png"
                className="w-16 h-16 md:w-20 md:h-20 z-10 opacity-80 object-contain filter drop-shadow(0 0 5px #ffd400)"
                alt="Dragon Core"
                style={{ scale: centerScale, opacity: centerOpacity }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Expertise Heading Visualizer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ExpertiseHeadingVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scale zooms up dramatically as user scrolls down
  const scale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 3.5, 8]);
  // Opacity stays solid then fades out completely as scale zooms in
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.85, 1], [1, 0.85, 0, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-[180vh] z-20">
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div
          style={{ scale, opacity }}
          className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto pointer-events-none"
        >
          {/* Subtitle / Capabilities Line */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 w-full">
            <div className="w-8 md:w-16 h-[1px] bg-[#ffd400] shrink-0" />
            <span className="text-[#ffd400] font-mono text-[10px] md:text-sm tracking-[0.15em] md:tracking-[0.4em] font-bold uppercase drop-shadow-[0_0_8px_rgba(255, 212, 0,0.6)] text-center">
              CAPABILITIES
            </span>
            <div className="w-8 md:w-16 h-[1px] bg-[#ffd400] shrink-0" />
          </div>

          {/* Main Section Title */}
          <h2
            className="text-white text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-center leading-none"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            MY <span className="text-[#ffd400]">EXPERTISE</span>
          </h2>
        </motion.div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Main Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function ExpertiseSection() {
  return (
    <section className="relative w-full bg-[#000000] z-10">
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 212, 0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 212, 0,1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Sticky Full-Screen Animated Heading */}
      <ExpertiseHeadingVisualizer />

      <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-24">
        {/* Dragon Network with sticky scroll zoom */}
        <DragonNetworkVisualizer />

        {/* â”€â”€ Skills Card Gallery â”€â”€ */}
      </div>
      <SkillsCardGallery />
    </section>
  );
}

