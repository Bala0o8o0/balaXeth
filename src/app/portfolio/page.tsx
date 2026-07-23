"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  ArrowUpRight,
  Cpu,
  Activity,
} from "lucide-react";

import { ExperienceTeaser, PixelNoise } from "@/components/ExperienceTeaser";
import Image from "next/image";

// ─── Project Data ───────────────────────────────────────────────
const PORTFOLIO_PROJECTS = [
  {
    title: "Baroque Tatu",
    shortName: "BAROQUE",
    id: "PRJ-BT1",
    imgSrc: "/assets/TATU.png",
    link: "https://baroquetatu.com/",
    category: ["WEBSITE"],
    type: "DESIGN / WEBSITE",
    year: "2024",
    role: "WEB DESIGNER",
    status: "DEPLOYED_LIVE",
    description:
      "A sophisticated and immersive website design for a high-end tattoo studio.",
    tech: ["FIGMA", "WORDPRESS", "JAVASCRIPT"],
  },
  {
    title: "DankDealerz NFT Dapp",
    shortName: "DEALERZ",
    id: "PRJ-44Y",
    imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/3.gif",
    link: "#",
    category: ["WEBSITE"],
    type: "WEB3 / NFT",
    year: "2021",
    role: "Frontend Dev",
    status: "DEPLOYED",
    description:
      "Digital asset broker platform. Stealth trading and secure peer-to-peer asset transfers.",
    tech: ["FIGMA", "REACT.JS"],
  },
  {
    title: "Lumina AI Try-On",
    shortName: "LUMINA",
    id: "PRJ-LR",
    imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/1.jpg",
    link: "#",
    category: ["MVPS & SAAS"],
    type: "AI / SAAS",
    year: "2024",
    role: "PRODUCT DEVELOPER",
    status: "LIVE_ALPHA",
    description:
      "Virtual fitting protocol. AI projection of apparel onto subjects in real-time.",
    tech: ["AI", "SUPABASE", "NEXT.JS"],
  },
  {
    title: "neui prd",
    shortName: "NEUI",
    id: "PRJ-L",
    imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/1.jpg",
    link: "#",
    category: ["MVPS & SAAS"],
    type: "AI / SAAS",
    year: "2024",
    role: "PRODUCT DEVELOPER",
    status: "LIVE_ALPHA",
    description:
      "Virtual fitting protocol. AI projection of apparel onto subjects in real-time.",
    tech: ["AI", "REACT.JS"],
  },
  {
    title: "ContractGuardian AI",
    shortName: "GUARDIAN",
    id: "PRJ-77A",
    imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/6.gif",
    link: "https://contract-guardian-ai.vercel.app/",
    category: ["WEB APPS"],
    type: "AI",
    year: "2023",
    role: "PRODUCT DEVELOPER",
    status: "DEPLOYED_LIVE",
    description:
      "A high-precision AI specialized in detecting vulnerabilities and ensuring robust smart contract security.",
    tech: ["REACT", "SOLIDITY", "AI_MODELS"],
  },
  {
    title: "Drawing to Image AI",
    shortName: "SCRIBBLER",
    id: "PRJ-12B",
    imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/8.gif",
    link: "https://meta-goblinz-scribbler-ai.vercel.app/",
    category: ["WEB APPS"],
    type: "AI / SYNTHESIS",
    year: "2023",
    role: "Fullstack / AI",
    status: "DEPLOYED_LIVE",
    description:
      "Transforms rudimentary sketches into hyper-realistic assets in real-time using advanced neural upscaling.",
    tech: ["NEXT", "PYTHON", "GAN_VISION"],
  },
  {
    title: "CLAWX DEX",
    shortName: "claw",
    id: "PRJ-12",
    imgSrc: "/assets/clawx.png",
    link: "https://www.figma.com/proto/lpHTMs3OkzMwQH2emyBYGd/CLAWX-DEX?node-id=4194-813&p=f&viewport=301%2C257%2C0.05&t=Gw29hRjLFNMXZW1R-1&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=4194%3A835&page-id=215%3A3283",
    category: ["UI DESIGNS"],
    type: "web3/ dex",
    year: "2023",
    role: "UI DESIGNER",
    status: "PROTOTYPE",
    description:
      "Transforms rudimentary sketches into hyper-realistic assets in real-time using advanced neural upscaling.",
    tech: ["PHOTOSHOP", "FIGMA"],
  },
  {
    title: "AlienHood NFT Dapp",
    shortName: "ALIENHOOD",
    id: "PRJ-09X",
    imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/12.gif",
    link: "https://alienhood-nft.vercel.app/",
    category: ["WEBSITE"],
    type: "WEB3 / DAPP",
    year: "2022",
    role: "Smart Contract Dev",
    status: "DEPLOYED_LIVE",
    description:
      "Extraterrestrial asset management protocol. Secure minting and trading of interplanetary NFTs.",
    tech: ["WEB3", "NEXT.JS"],
  },
  {
    title: "DigiRaptors Portfolio",
    shortName: "RAPTORS",
    id: "PRJ-88D",
    imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/10.png",
    link: "https://balaxeth-ai.vercel.app/assets/imgs/display/DIGI.mp4",
    category: ["WEBSITE"],
    type: "WEB3 / NFT",
    year: "2022",
    role: "WEB3 DAPP DEVELOPER",
    status: "DEPLOYED_LIVE",
    description:
      "Asset tracking system. Scours the blockchain to aggregate and visualize holding balances.",
    tech: ["HTML", "CSS", "JAVASCRIPT"],
  },
  {
    title: "NeoNet Tech Forum",
    shortName: "NEONET",
    id: "PRJ-32N",
    imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/4.gif",
    link: "#",
    category: ["UI DESIGNS"],
    type: "FULLSTACK / COMMUNITY",
    year: "2024",
    role: "Fullstack Dev",
    status: "PROTOTYPE",
    description:
      "Centralized communications hub. Global chat relays and encrypted developer forums.",
    tech: ["NEXT", "FIREBASE", "UX"],
  },
  {
    title: "RickFarm NFT Staking Game",
    shortName: "RICKFARM",
    id: "PRJ-01F",
    imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/5.gif",
    link: "https://balaxeth-ai.vercel.app/assets/imgs/display/rickfarm%20video.mp4",
    category: ["WEBSITE"],
    type: "WEB3 / GAMIFI",
    year: "2022",
    role: "Web3 Developer",
    status: "ARCHIVED",
    description:
      "Yield-generation simulation. Lock assets into secure smart-vaults to farm high-yield tokens.",
    tech: ["FIGMA", "NEXT.JS", "TAILWINDCSS", "SOLIDITY", "THIRDWEBSDK"],
  },
  {
    title: "FTM Grow House",
    shortName: "FTMGROW",
    id: "PRJ-FTM",
    imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/13.png",
    link: "#",
    category: ["UI DESIGNS"],
    type: "WEB DESIGN",
    year: "2022",
    role: "UI DESIGNER",
    status: "DELIVERED",
    description:
      "A complete web design mapping for the FTM Grow House platform.",
    tech: ["FIGMA", "ADOBE SUITE"],
  },
  {
    title: "Berry Coffee Shop",
    shortName: "BERRY",
    id: "PRJ-BRY",
    imgSrc: "",
    link: "#",
    category: ["WEBSITE"],
    type: "WEBSITE",
    year: "2022",
    role: "Frontend Developer",
    status: "DELIVERED",
    description:
      "A modern and responsive landing page for a boutique coffee shop.",
    tech: ["FIGMA", "HTML", "CSS", "JAVASCRIPT"],
  },
  {
    title: "Cannabrew Website",
    shortName: "CANNABREW",
    id: "PRJ-55M",
    imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/9.png",
    link: "https://balaxeth-ai.vercel.app/assets/imgs/display/cannabrew.png",
    category: ["UI DESIGNS"],
    type: "WEBSITE DESIGN",
    year: "2023",
    role: "Frontend UI DESIGNER",
    status: "PROTOTYPE",
    description:
      "Botanical distribution network interface. Streamlined inventory and sleek consumer frontend.",
    tech: ["FIGMA"],
  },
  {
    title: "Oblinz Token Dapp",
    shortName: "OBLINZ",
    id: "PRJ-99C",
    imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/2.gif",
    link: "#",
    category: ["WEBSITE"],
    type: "DEFI / PROTOCOL",
    year: "2022",
    role: "Web3 Engineer",
    status: "ARCHIVED",
    description:
      "Autonomous decentralized exchange. High-frequency token swaps with minimal slippage.",
    tech: ["SOLIDITY", "TAILWIND", "WEB3", "NEXT.JS"],
  },
];

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; count: number }
> = {
  ALL: {
    label: "ALL",
    icon: (
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <motion.rect
          x="14"
          y="14"
          width="7"
          height="7"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.svg>
    ),
    count: PORTFOLIO_PROJECTS.length,
  },
  "UI DESIGNS": {
    label: "UI DESIGNS",
    icon: (
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="13.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="10.5" r="2.5" />
        <circle cx="8.5" cy="7.5" r="2.5" />
        <circle cx="6.5" cy="12.5" r="2.5" />
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 2 1 3 2 4s3 6 8 6z" />
      </motion.svg>
    ),
    count: PORTFOLIO_PROJECTS.filter((p) => p.category.includes("UI DESIGNS"))
      .length,
  },
  "WEB APPS": {
    label: "WEB APPS",
    icon: (
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        animate={{ x: [0, 2, 0, -2, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </motion.svg>
    ),
    count: PORTFOLIO_PROJECTS.filter(
      (p) => p.category.includes("WEB APPS")
    ).length,
  },
  WEBSITE: {
    label: "WEBSITE",
    icon: (
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </motion.svg>
    ),
    count: PORTFOLIO_PROJECTS.filter((p) => p.category.includes("WEBSITE")).length,
  },
  "MVPS & SAAS": {
    label: "MVPS & SAAS",
    icon: (
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </motion.svg>
    ),
    count: PORTFOLIO_PROJECTS.filter((p) => p.category.includes("MVPS & SAAS")).length,
  },
};

// ─── Scramble Text ──────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function useScrambleText(text: string, speed = 40) {
  const [displayText, setDisplayText] = useState("".padStart(text.length, "#"));

  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(frame / 18, 1);
      const revealCount = Math.floor(progress * text.length);
      setDisplayText(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < revealCount) return text[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );
      if (progress >= 1) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayText;
}

// ─── Hero Cyberpunk Background ──────────────────────────────────
const HeroWaves = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
      {/* Animated Cyber Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 212, 0, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 212, 0, 0.2) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Vignette to blend edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-[#000000] opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-transparent to-[#000000] opacity-90" />
    </div>
  );
};

// ─── Project Card ───────────────────────────────────────────────
function ProjectCard({
  project,
  index,
}: {
  project: (typeof PORTFOLIO_PROJECTS)[0];
  index: number;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isLive =
    project.status.includes("LIVE") || project.status.includes("DEPLOYED");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={project.link}
        target={project.link !== "#" ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="block cursor-target h-full"
      >
        {/* ── Outer Chassis ── */}
        <div
          className="relative flex flex-col bg-[#0a0a0a] border border-[#ffd400]/20 transition-all duration-500 overflow-hidden h-full"
          style={{
            boxShadow: isHovered ? "0 0 30px rgba(255, 212, 0, 0.15)" : "none",
            borderColor: isHovered
              ? "rgba(255, 212, 0, 0.5)"
              : "rgba(255, 212, 0, 0.2)",
          }}
        >
          {/* HUD Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#ffd400]/10 bg-black/40">
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255, 212, 0,0.4)] ${
                  isLive
                    ? "bg-[#ffd400] animate-pulse scale-110"
                    : "bg-[#ffd400]/40 animate-[pulse_3s_infinite]"
                }`}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono tracking-widest text-[#ffd400]/50 uppercase">
                STATION_0{index + 1}
              </span>
              <Activity size={8} className="text-[#ffd400]/30" />
            </div>
          </div>

          {/* Visual Core */}
          <div className="relative aspect-[16/9] overflow-hidden bg-black">
            {/* Main Image */}
            <motion.img
              src={project.imgSrc}
              alt={project.title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? "scale-110 saturate-100" : "scale-100 saturate-[0.7]"}`}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />

            {/* Image Overlay */}
            <AnimatePresence>
              {isHovered && (
                <>
                  {/* Corner Target Markers */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 pointer-events-none"
                  >
                    <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#ffd400]" />
                    <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[#ffd400]" />
                  </motion.div>

                  {/* Grain Overlay */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay z-10" />
                </>
              )}
            </AnimatePresence>

            {/* Type Label */}
            <div className="absolute bottom-0 left-0 bg-black/80 backdrop-blur-md px-3 py-1.5 border-t border-r border-[#ffd400]/30 z-40">
              <span className="text-[10px] font-mono text-[#ffd400] tracking-tighter uppercase">
                {project.type}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3
                className="text-lg font-bold text-[#ffd400] tracking-widest uppercase transition-colors group-hover:text-white"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {project.title}
              </h3>
              <span className="text-[11px] font-mono text-white/40 mt-1">
                {project.year}
              </span>
            </div>

            <div className="mt-auto flex flex-wrap gap-2 mb-6">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-[9px] font-mono text-white/50 border border-white/10 px-2 py-0.5 group-hover:border-[#ffd400]/30 group-hover:text-[#ffd400]/80 transition-all"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Action Footer */}
            <div className="group/btn relative inline-flex items-center justify-between w-full px-4 py-2.5 bg-[#ffd400]/5 border border-[#ffd400]/20 overflow-hidden transition-all group-hover:bg-[#ffd400] group-hover:border-[#ffd400]">
              {/* Hover Background Sweep */}
              <motion.div
                className="absolute inset-0 bg-white/10 -translate-x-full"
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />

              <span className="relative text-[11px] font-mono font-bold tracking-widest text-[#ffd400] group-hover:text-black transition-colors">
                VIEW
              </span>
              <ArrowUpRight
                size={14}
                className="relative text-[#ffd400] group-hover:text-black transition-colors"
              />
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="px-4 py-1.5 bg-black/60 border-t border-[#ffd400]/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-1 ${isHovered ? "bg-[#ffd400]" : "bg-white/10"} transition-colors`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">
                LINK_STABILITY: 99.8%
              </span>
            </div>
            <Cpu
              size={10}
              className={`${isHovered ? "text-[#ffd400]" : "text-white/20"} transition-colors`}
            />
          </div>
        </div>
      </Link>

      {/* Background Glow */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl bg-yellow-400/10 pointer-events-none" />
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────
export default function Portfolio2Page() {
  const [filter, setFilter] = useState("ALL");
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const heroTitle = useScrambleText("PORTFOLIO", 40);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setMounted(true);
    const updateTime = () =>
      setCurrentTime(new Date().toISOString().replace("T", " ").split(".")[0]);
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const filters = ["ALL", "UI DESIGNS", "WEBSITE", "WEB APPS", "MVPS & SAAS"];
  const filteredProjects =
    filter === "ALL"
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => {
          if (filter === "UI DESIGNS") return p.category.includes("UI DESIGNS");
          if (filter === "WEB APPS") return p.category.includes("WEB APPS");
          if (filter === "WEBSITE") return p.category.includes("WEBSITE");
          if (filter === "MVPS & SAAS") return p.category.includes("MVPS & SAAS");
          return false;
        });
  const liveCount = PORTFOLIO_PROJECTS.filter(
    (p) => p.status.includes("LIVE") || p.status.includes("DEPLOYED"),
  ).length;

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#000000] text-white relative overflow-x-hidden selection:bg-[#ffd400] selection:text-black">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#ffd400] z-[100] origin-left"
        style={{ scaleX: scrollYProgress, opacity: 0.6 }}
      />

      {/* ─── Top Bar ─── */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#000000] border-b border-[#ffd400]/15"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-6">
            <span className="text-[#ffd400] space-x-5 tracking-wider">
              PORTFOLIO
            </span>
            <span className="text-white/20 hidden sm:inline">
              {currentTime}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#ffd400]"
            />
            <span className="text-white/40 tracking-wider">
              {filteredProjects.length} PROJECTS
            </span>
          </div>
        </div>
      </motion.div>

      {/* ─── Hero ─── */}
      <section className="relative z-10 pt-20 pb-0 overflow-hidden">
        <HeroWaves />
        {/* Spider Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden flex items-center justify-center">
          <PixelNoise />
          <div className="absolute w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Image
              src="/spder.png"
              alt="Spider Background"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-12 md:pt-24 md:pb-16 relative z-10 flex flex-col items-center text-center">
            {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center gap-3 mb-6"
          >
            <div className="w-8 h-[1px] bg-[#ffd400]" />
            <span className="text-[#ffd400] text-[11px] font-mono tracking-[0.3em] uppercase">
              Selected Works
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-orbitron)" }}
            data-scroll
            data-scroll-speed="0.2"
          >
            <span className="text-[#ffd400]">{heroTitle || "\u00A0"}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 pt-8 border-t border-[#ffd400]/10 w-full max-w-2xl"
          >
            <p className="text-white/80 text-sm leading-relaxed font-mono">
              A curated collection of projects spanning AI, Web3, and full-stack
              development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Filters ─── */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
          <div className="flex justify-center items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
            {filters.map((f) => {
              const isActive = filter === f;
              const config = CATEGORY_CONFIG[f];
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center gap-3 font-mono tracking-[0.25em] uppercase transition-all duration-300 whitespace-nowrap ${
                    f === "ALL"
                      ? "px-6 py-3.5 rounded-2xl text-[11px]"
                      : "px-4 py-3 text-[10px]"
                  } ${
                    isActive
                      ? "text-black bg-[#ffd400] border-2 border-[#ffd400]"
                      : "text-[#ffd400] border-2 border-[#ffd400]/30 hover:border-white hover:text-white"
                  }`}
                >
                  <div className="scale-125">{config.icon}</div>
                  <span className="mt-[2px]">{config.label}</span>
                  <span
                    className={`text-[11px] mt-[2px] ${isActive ? "text-black/60" : "text-[#ffd400]/50"}`}
                  >
                    {config.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Projects Grid ─── */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-24">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 border border-[#ffd400]/10 bg-black/40"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
              }}
            >
              <div className="inline-flex items-center gap-3 mb-4 text-[#ffd400]/40">
                <Activity size={16} />
                <span className="font-mono text-sm tracking-widest">
                  QUERY_RETURNED_NULL
                </span>
              </div>
              <p className="text-white/20 font-mono text-xs uppercase tracking-[0.2em]">
                No operational data sets found for selected category.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── CTA (MECHA / PROFESSIONAL CYBERPUNK) ─── */}
      <section className="relative z-10 py-32 md:py-48 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative bg-[#000000] p-1 border-t-2 border-[#ffd400]/60 shadow-[0_10px_30px_rgba(255, 212, 0,0.1)]"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)",
            }}
          >
            {/* Inner Container to give a thick mechanical border feel */}
            <div
              className="relative w-full h-full bg-[#0a0a0a] p-8 sm:p-16 md:p-24 overflow-hidden flex flex-col items-center border border-white/5"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 38px), calc(100% - 38px) 100%, 0 100%)",
              }}
            >
              {/* Subtle Grid Pattern */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, #ffd400 1px, transparent 1px), linear-gradient(to bottom, #ffd400 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Mecha Decorators */}
              <div className="absolute top-0 left-0 w-32 h-1 bg-[#ffd400]/80" />
              <div className="absolute top-1 left-0 w-12 h-1 bg-[#ffd400]/40" />
              <div className="absolute bottom-0 right-0 w-48 h-1 bg-[#ffd400]/80" />
              
              {/* Professional Status HUD */}
              <div className="hidden lg:flex absolute top-8 left-8 flex-col gap-2 font-mono text-[10px] text-white/50 tracking-[0.15em] uppercase z-10">
                <span className="flex items-center gap-2 text-white/80">
                  <span className="w-1.5 h-1.5 bg-[#ffd400] rounded-sm animate-pulse" />
                  System Status: Secure
                </span>
                <span>Active Nodes: 142</span>
                <span>Latency: 12ms</span>
              </div>

              {/* Data Hash Decorator */}
              <div className="hidden lg:block absolute bottom-8 left-8 font-mono text-[10px] text-white/30 tracking-widest z-10">
                HASH: 0x8F92...B4A1
              </div>

              {/* Main Content */}
              <div className="relative z-20 flex flex-col items-center text-center max-w-2xl">
                {/* Mechanical Accent Icon */}
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  whileInView={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: "backOut" }}
                  className="mb-8"
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffd400" strokeWidth="1.5">
                    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="12" y1="2" x2="12" y2="8" />
                    <line x1="12" y1="16" x2="12" y2="22" />
                  </svg>
                </motion.div>

                <h2
                  className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wider uppercase leading-tight text-white mb-6"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  HAVE A <br className="hidden sm:block" />
                  <span className="text-[#ffd400]">PROJECT</span> IN MIND?
                </h2>
                
                <p className="mb-12 text-white/60 font-mono text-sm tracking-wide leading-relaxed">
                  Let&apos;s build something exceptional together. Available for freelance opportunities and full-time roles.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
                  {/* Primary Button */}
                  <a
                    href="https://api.whatsapp.com/send/?phone=%2B919080880124&text=Hi%20Bala%2C%20I%27d%20like%20to%20discuss%20a%20new%20project%20with%20you.&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative px-10 py-4 bg-[#ffd400] text-black font-mono text-sm font-bold tracking-widest uppercase transition-all hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255, 212, 0,0.4)] group w-full sm:w-auto text-center"
                    style={{
                      clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Contact Me
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  </a>


                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ExperienceTeaser />

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-[#ffd400]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-white/20">
          <span>
            <span className="text-[#ffd400]/50">&copy;</span>{" "}
            {new Date().getFullYear()} BALA
          </span>
          <span className="text-white/15">NEXT.JS / REACT / TAILWIND</span>
        </div>
      </footer>
    </main>
  );
}
