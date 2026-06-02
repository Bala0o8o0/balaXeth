"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import gsap from "gsap";

// ── Cyberpunk / Hacker Glitch Audio Engine ────────────────────────────────
// ── Hacker HUD Audio Engine (Industrial Glitch) ───────────────────────────
function useAlienAudio() {
    const ctxRef = useRef<AudioContext | null>(null);

    const getCtx = async () => {
        if (!ctxRef.current)
            ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (ctxRef.current.state === 'suspended') await ctxRef.current.resume();
        return ctxRef.current;
    };

    // Helper: Glitchy noise burst with filter sweep
    const glitch = async (ctx: AudioContext, t: number, dur: number, freq: number, q: number, vol: number) => {
        const sr = ctx.sampleRate;
        const buf = ctx.createBuffer(1, sr * dur, sr);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        
        const src = ctx.createBufferSource();
        src.buffer = buf;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq, t);
        filter.frequency.exponentialRampToValueAtTime(freq * 0.1, t + dur);
        filter.Q.setValueAtTime(q, t);
        
        const g = ctx.createGain();
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        
        src.connect(filter);
        filter.connect(g);
        g.connect(ctx.destination);
        
        src.start(t);
        src.stop(t + dur);
    };

    // BOOT: System hardware initialize — heavy mechanical clunk + data crunch
    const playBoot = async () => {
        try {
            const ctx = await getCtx();
            const t = ctx.currentTime;
            
            // 1. Heavy mechanical clunk (low freq)
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.connect(g); g.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.exponentialRampToValueAtTime(40, t + 0.3);
            g.gain.setValueAtTime(0.8, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
            osc.start(t); osc.stop(t + 0.3);
            
            // 2. Data static crunch
            await glitch(ctx, t + 0.1, 0.4, 3000, 5, 0.3);
            await glitch(ctx, t + 0.2, 0.2, 5000, 10, 0.2);
        } catch {}
    };

    // HOVER: Minimalist digital tick — like a mechanical keyboard trigger
    const playHover = async () => {
        try {
            const ctx = await getCtx();
            const t = ctx.currentTime;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.connect(g); g.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(2500, t);
            g.gain.setValueAtTime(0.05, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
            osc.start(t); osc.stop(t + 0.015);
        } catch {}
    };

    // SELECT: Sci-Fi HUD command confirm — 2-chirp lock + static burst
    const playSelect = async () => {
        try {
            const ctx = await getCtx();
            const t = ctx.currentTime;
            
            // Chirp 1: high → mid pitch (HUD tone 1)
            const c1 = ctx.createOscillator();
            const g1 = ctx.createGain();
            c1.connect(g1); g1.connect(ctx.destination);
            c1.type = 'sine';
            c1.frequency.setValueAtTime(1800, t);
            c1.frequency.linearRampToValueAtTime(900, t + 0.06);
            g1.gain.setValueAtTime(0.25, t);
            g1.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
            c1.start(t); c1.stop(t + 0.07);

            // Chirp 2: mid → high pitch (HUD tone 2, confirms lock)
            const c2 = ctx.createOscillator();
            const g2 = ctx.createGain();
            c2.connect(g2); g2.connect(ctx.destination);
            c2.type = 'sine';
            c2.frequency.setValueAtTime(1200, t + 0.08);
            c2.frequency.linearRampToValueAtTime(2400, t + 0.16);
            g2.gain.setValueAtTime(0.2, t + 0.08);
            g2.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
            c2.start(t + 0.08); c2.stop(t + 0.17);

            // Brief static burst on top
            await glitch(ctx, t + 0.05, 0.08, 6000, 4, 0.12);
        } catch {}
    };

    // IMAGE HOVER: HUD sensor lock-on — white noise scan sweep
    const playImageHover = async () => {
        try {
            const ctx = await getCtx();
            const t = ctx.currentTime;
            await glitch(ctx, t, 0.3, 4000, 30, 0.15);
        } catch {}
    };

    // SCROLL: Micro-service heartbeat tick
    const playScroll = async () => {
        try {
            const ctx = await getCtx();
            const t = ctx.currentTime;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.connect(g); g.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(3000, t);
            g.gain.setValueAtTime(0.03, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.01);
            osc.start(t); osc.stop(t + 0.01);
        } catch {}
    };

    return { playBoot, playHover, playSelect, playImageHover, playScroll };
}
// ─────────────────────────────────────────────────────────────────────────────


// Project Data
const PORTFOLIO_PROJECTS = [
  { 
      title: "ContractGuardian AI SmartContract Auditor", 
      shortName: "GUARDIAN",
      id: "PRJ-77A",
      imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/6.gif", 
      link: "https://contract-guardian-ai.vercel.app/",
      type: "AI / SECURITY",
      year: "2023",
      role: "Lead AI Engineer",
      status: "DEPLOYED_LIVE",
      description: "A high-precision AI specialized in detecting vulnerabilities and ensuring robust smart contract security. Equipped with deep-learning threat analysis.",
      tech: ["REACT.JS", "SOLIDITY", "AI_MODELS"]
  },
  { 
      title: "Drawing to Image AI Generator",
      shortName: "SCRIBBLER",
      id: "PRJ-12B", 
      imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/8.gif", 
      link: "https://meta-goblinz-scribbler-ai.vercel.app/",
      type: "AI / SYNTHESIS",
      year: "2023",
      role: "Fullstack / AI",
      status: "DEPLOYED_LIVE",
      description: "Creative generation tool. Transforms rudimentary sketches into hyper-realistic assets in real-time using advanced neural upscaling.",
      tech: ["NEXT.JS", "PYTHON", "GAN_VISION"]
  },
  { 
      title: "AlienHood NFT Dapp", 
      shortName: "ALIENHOOD",
      id: "PRJ-09X",
      imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/12.gif", 
      link: "https://alienhood-nft.vercel.app/",
      type: "WEB3 / DAPP",
      year: "2022",
      role: "Smart Contract Dev",
      status: "DEPLOYED_LIVE",
      description: "Extraterrestrial asset management protocol. Facilitates secure minting and trading of classified interplanetary non-fungible tokens.",
      tech: ["WEB3.JS", "REACT", "IPFS_STORAGE"]
  },
  { 
      title: "Oblinz Token Dapp with Inbuilt Dex", 
      shortName: "OBLINZ",
      id: "PRJ-99C",
      imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/2.gif", 
      link: "#",
      type: "DEFI / PROTOCOL",
      year: "2022",
      role: "Web3 Engineer",
      status: "ARCHIVED",
      description: "Autonomous decentralized exchange. Handles high-frequency token swaps with minimal slippage and maximum liquidity.",
      tech: ["SOLIDITY", "TAILWIND", "WEB3_CORE"]
  },
  { 
      title: "DankDealerz NFT Dapp", 
      shortName: "DEALERZ",
      id: "PRJ-44Y",
      imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/3.gif", 
      link: "#",
      type: "WEB3 / MARKETPLACE",
      year: "2021",
      role: "Frontend Dev",
      status: "ARCHIVED",
      description: "Digital asset broker platform. Optimizes transaction hashes for stealth trading and secure peer-to-peer asset transfers.",
      tech: ["REACT.JS", "ETH_NETWORK", "NODE.JS"]
  },
  { 
      title: "NeoNet Tech Forum", 
      shortName: "NEONET",
      id: "PRJ-32N",
      imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/4.gif", 
      link: "#",
      type: "SOCIAL / COMMUNITY",
      year: "2024",
      role: "Fullstack Dev",
      status: "LIVE_BETA",
      description: "Centralized communications hub. Maintains global chat relays and encrypted developer forums resistant to surveillance.",
      tech: ["NEXT.JS", "FIREBASE", "UX_DESIGN"]
  },
  { 
      title: "RickFarm NFT Staking Game", 
      shortName: "RICKFARM",
      id: "PRJ-01F",
      imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/5.gif", 
      link: "#",
      type: "WEB3 / GAMIFI",
      year: "2022",
      role: "Web3 Developer",
      status: "ARCHIVED",
      description: "Yield-generation simulation. Users lock their assets into secure smart-vaults to farm high-yield sub-tokens over time.",
      tech: ["VUE.JS", "SOLIDITY", "WEB3_CORE"]
  },
  { 
      title: "Cannabrew Cannabis Website", 
      shortName: "CANNABREW",
      id: "PRJ-55M",
      imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/9.png", 
      link: "https://balaxeth-ai.vercel.app/assets/imgs/display/cannabrew.png",
      type: "E-COMMERCE / WEB",
      year: "2023",
      role: "Frontend Engineer",
      status: "PROTOTYPE",
      description: "Botanical distribution network interface. Streamlines inventory management and provides a sleek frontend for consumer purchases.",
      tech: ["REACT.JS", "TAILWIND", "REST_API"]
  },
  { 
      title: "DigiRaptors NFT Portfolio Dapp", 
      shortName: "RAPTORS",
      id: "PRJ-88D",
      imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/10.png", 
      link: "https://balaxeth-ai.vercel.app/assets/imgs/display/DIGI.mp4",
      type: "WEB3 / TRACKER",
      year: "2022",
      role: "Fullstack App Dev",
      status: "PROTOTYPE",
      description: "Asset tracking system. Scours the blockchain to aggregate and visualize holding balances and historical value.",
      tech: ["NEXT.JS", "RPC_API", "DATA_CHARTS"]
  },
  { 
      title: "Lumina-try AI Image Try On", 
      shortName: "LUMINA",
      id: "PRJ-LRX",
      imgSrc: "https://balaxeth-ai.vercel.app/assets/imgs/works/1.jpg", 
      link: "#",
      type: "AI / AR_VISION",
      year: "2024",
      role: "AI Integration Lead",
      status: "LIVE_ALPHA",
      description: "Virtual fitting protocol. Overlays targeted apparel modifications onto biological subjects using real-time AI projection.",
      tech: ["AI_MODELS", "CV_VISION", "REACT.JS"]
  }
];

// Tech Box 
function TechBox({ label }: { label: string }) {
    return (
        <div className="relative flex-1 px-2 py-3 border border-[#FF0000]/40 bg-black hover:bg-[#FF0000]/10 transition-colors flex justify-center items-center cursor-pointer group shadow-[0_0_10px_rgba(255,0,0,0)] hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]">
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-[#FF0000]" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-[#FF0000]" />
            <span className="text-[10px] tracking-[0.2em] font-bold font-mono uppercase truncate text-[#FF0000] group-hover:text-[#FF0000]">{label}</span>
        </div>
    );
}

// Data Row
function DataRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-[#FF0000]/20 text-[10px] sm:text-xs">
            <span className="text-[#FF0000]/70 font-black tracking-widest uppercase font-mono">&gt; {label}</span>
            <span className="text-[#FF0000] font-bold tracking-widest uppercase">{value}</span>
        </div>
    );
}

// Unified Sci-Fi Card: Image top, CyberWave bottom — one single card
function CyberpunkImageCard({ imgSrc, onImageHover }: { imgSrc: string, onImageHover: () => void }) {



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="w-full relative mt-3 mb-4"
        >

            {/* THE ONE UNIFIED CARD */}
            <div className="relative bg-black border border-[#FF0000]/60 group">

                {/* Outer corner brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF0000] z-20" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF0000] z-20" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF0000] z-20" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF0000] z-20" />

                {/* ── TOP: Big project image ── */}
                <div
                    className="relative overflow-hidden cursor-pointer"
                    style={{ aspectRatio: '16/9' }}
                    onMouseEnter={onImageHover}
                >
                    {/* Ruler ticks */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 pl-1 z-10">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-[1px] bg-[#FF0000]/40" style={{ width: i === 2 ? '14px' : '7px' }} />
                        ))}
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 pr-1 z-10">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-[1px] bg-[#FF0000]/40" style={{ width: i === 2 ? '14px' : '7px' }} />
                        ))}
                    </div>

                    {/* Center reticle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <div className="relative w-14 h-14">
                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#FF0000]/15" />
                            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#FF0000]/15" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-[#FF0000]/30 flex justify-center items-center">
                                <div className="w-1.5 h-1.5 bg-[#FF0000]/50 rounded-full animate-ping" />
                            </div>
                        </div>
                    </div>

                    {/* Image — dimmed + red tinted by default, clean on hover */}
                    <img
                        src={imgSrc}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
                    />

                    {/* Red dim tint overlay — visible by default, disappears on hover */}
                    <div className="absolute inset-0 bg-[#FF0000]/30 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-700 pointer-events-none z-10" />

                    {/* Red vignette border glow — fades out on hover */}
                    <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(255,0,0,0.5)] group-hover:shadow-[inset_0_0_0px_rgba(255,0,0,0)] transition-all duration-700 pointer-events-none z-10" />

                    {/* Scan line — visible by default, hides on hover (inverted) */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,0,0,0.15),transparent)] opacity-100 group-hover:opacity-0 animate-[scan_3s_linear_infinite] pointer-events-none z-10 transition-opacity duration-500" />


                    {/* Bottom HUD overlay on the image */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 flex justify-between items-end z-10">
                        <span className="text-[#FF0000] text-[9px] font-mono tracking-[0.2em] uppercase">TACTICAL_VIEW</span>
                        <span className="text-[#FF0000]/50 text-[9px] font-mono tracking-widest">SIG: 100%</span>
                    </div>
                </div>

                {/* ── INNER DIVIDER: image / HUD strip ── */}
                <div className="w-full flex items-center border-t border-[#FF0000]/50">
                    <div className="flex-1 h-[1px]" />
                    <div className="px-3 py-[2px] border-x border-[#FF0000]/30 bg-[#FF0000]/5">
                        <span className="text-[#FF0000]/40 text-[8px] font-mono tracking-[0.3em] uppercase">SYS_DATA</span>
                    </div>
                    <div className="flex-1 h-[1px]" />
                </div>

                {/* ── BOTTOM: HUD strip with stats + embedded RADAR ── */}
                <div className="flex items-stretch divide-x divide-[#FF0000]/30">

                    {/* Telemetry info columns */}
                    <div className="flex-1 flex divide-x divide-[#FF0000]/20">
                        <div className="flex flex-col justify-center gap-0.5 px-3 py-3">
                            <span className="text-[#FF0000]/40 text-[8px] tracking-[0.25em] font-mono uppercase">STATUS</span>
                            <span className="text-[#FF0000] text-[10px] font-bold font-mono tracking-wider">LIVE_FEED</span>
                        </div>
                        <div className="hidden sm:flex flex-col justify-center gap-0.5 px-3 py-3">
                            <span className="text-[#FF0000]/40 text-[8px] tracking-[0.25em] font-mono uppercase">RES</span>
                            <span className="text-[#FF0000] text-[10px] font-bold font-mono tracking-wider">4K·60FPS</span>
                        </div>
                        <div className="hidden md:flex flex-col justify-center gap-0.5 px-3 py-3">
                            <span className="text-[#FF0000]/40 text-[8px] tracking-[0.25em] font-mono uppercase">MODE</span>
                            <span className="text-[#FF0000] text-[10px] font-bold font-mono tracking-wider">TACTICAL</span>
                        </div>
                    </div>

                    {/* ALIEN TECH ORRERY — multi-axis gyroscope orbital */}
                    <div className="relative flex-1 flex items-center justify-center overflow-hidden py-2">
                        <style dangerouslySetInnerHTML={{ __html: `
                            @keyframes orbitX { 0% { transform: rotateX(0deg); } 100% { transform: rotateX(360deg); } }
                            @keyframes orbitY { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
                            @keyframes orbitZ { 0% { transform: rotateZ(0deg); } 100% { transform: rotateZ(360deg); } }
                            @keyframes alienPulse { 0%,100% { opacity:0.3; r:3; } 50% { opacity:1; r:5; } }
                            @keyframes corePulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
                            @keyframes dataStream {
                                0%   { stroke-dashoffset: 120; opacity: 0; }
                                30%  { opacity: 0.9; }
                                100% { stroke-dashoffset: 0; opacity: 0; }
                            }
                            .ring-x { animation: orbitX 4s linear infinite; transform-origin: center; transform-box: fill-box; }
                            .ring-y { animation: orbitY 6s linear infinite; transform-origin: center; transform-box: fill-box; }
                            .ring-z { animation: orbitZ 9s linear infinite reverse; transform-origin: center; transform-box: fill-box; }
                            .node-pulse { animation: alienPulse 2s ease-in-out infinite; }
                            .core-glow  { animation: corePulse 1.5s ease-in-out infinite; }
                            .data-line  { stroke-dasharray: 40 80; animation: dataStream 2.5s linear infinite; }
                        ` }} />
                        <svg viewBox="0 0 140 80" className="w-full max-w-[280px] h-[80px]" xmlns="http://www.w3.org/2000/svg">
                            {/* Data stream lines radiating from center */}
                            {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
                                <line
                                    key={i}
                                    x1="70" y1="40"
                                    x2={70 + 32 * Math.cos(a * Math.PI / 180)}
                                    y2={40 + 20 * Math.sin(a * Math.PI / 180)}
                                    stroke="#FF0000" strokeWidth="0.4" opacity="0.2"
                                    strokeDasharray="3 4"
                                    className="data-line"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            ))}

                            {/* Outer orbit ellipse — tilted Z */}
                            <ellipse cx="70" cy="40" rx="38" ry="10"
                                fill="none" stroke="#FF0000" strokeWidth="0.7" opacity="0.25"
                                className="ring-z"
                            />
                            {/* Middle orbit ellipse — tilted X */}
                            <ellipse cx="70" cy="40" rx="10" ry="28"
                                fill="none" stroke="#FF0000" strokeWidth="0.7" opacity="0.3"
                                className="ring-x"
                            />
                            {/* Inner orbit ellipse — tilted Y */}
                            <ellipse cx="70" cy="40" rx="22" ry="18"
                                fill="none" stroke="#FF0000" strokeWidth="0.5" opacity="0.2"
                                strokeDasharray="3 3"
                                className="ring-y"
                            />

                            {/* Orbiting node 1 — outer ring */}
                            <circle cx="108" cy="40" r="3" fill="#FF0000" className="node-pulse" style={{ animationDelay: '0s' }} />
                            {/* Orbiting node 2 — inner ring */}
                            <circle cx="70" cy="12" r="2.5" fill="#FF0000" className="node-pulse" style={{ animationDelay: '0.7s' }} />
                            {/* Orbiting node 3 — mid ring */}
                            <circle cx="48" cy="58" r="2" fill="#FF0000" className="node-pulse" style={{ animationDelay: '1.3s' }} />

                            {/* Core glow rings */}
                            <circle cx="70" cy="40" r="9" fill="none" stroke="#FF0000" strokeWidth="0.5" opacity="0.4" className="core-glow" />
                            <circle cx="70" cy="40" r="5" fill="none" stroke="#FF0000" strokeWidth="1" opacity="0.6" className="core-glow" style={{ animationDelay: '0.5s' }} />
                            {/* Core dot */}
                            <circle cx="70" cy="40" r="2.5" fill="#FF0000" opacity="0.9" />

                            {/* Corner alien script marks */}
                            <text x="4" y="10" fill="#FF0000" fontSize="4" opacity="0.4" fontFamily="monospace">ΔX.09</text>
                            <text x="4" y="76" fill="#FF0000" fontSize="4" opacity="0.4" fontFamily="monospace">ΩZ.77</text>
                            <text x="110" y="10" fill="#FF0000" fontSize="4" opacity="0.4" fontFamily="monospace">ΓY.33</text>
                            <text x="108" y="76" fill="#FF0000" fontSize="4" opacity="0.4" fontFamily="monospace">ΦR.01</text>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Bottom closing bar */}
            <div className="flex items-center">
                <div className="h-[1px] flex-1 bg-[#FF0000]/20" />
                <div className="border border-[#FF0000]/30 border-t-0 px-4 py-1 bg-black">
                    <span className="text-[#FF0000]/30 text-[9px] font-mono tracking-widest">// END_STREAM</span>
                </div>
                <div className="h-[1px] flex-1 bg-[#FF0000]/20" />
            </div>
        </motion.div>
    );
}

export default function HUDPortfolioPage() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedProject = PORTFOLIO_PROJECTS[selectedIndex];
    const { playBoot, playHover, playSelect, playImageHover, playScroll } = useAlienAudio();
    const scrollThrottle = useRef(false);

    useEffect(() => {
        // Boot sound on load (after tiny delay so AudioContext unlocks)
        const t = setTimeout(() => { try { playBoot(); } catch {} }, 300);
        // Scroll sound
        const onScroll = () => {
            if (scrollThrottle.current) return;
            scrollThrottle.current = true;
            playScroll();
            setTimeout(() => { scrollThrottle.current = false; }, 200);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="min-h-screen bg-[#000000] text-[#FF0000] font-sans selection:bg-[#FF0000] selection:text-black pb-20 relative overflow-x-hidden">
            
            {/* Extremely Thin Space-Age Scrollbar */}
            <style dangerouslySetInnerHTML={{__html: `
                ::-webkit-scrollbar {
                    width: 2px;
                }
                ::-webkit-scrollbar-track {
                    background: #000000;
                }
                ::-webkit-scrollbar-thumb {
                    background: #440000;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #FF0000;
                    box-shadow: 0 0 10px #FF0000;
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                @keyframes glitch {
                    0% { transform: translate(0); clip-path: inset(0 0 0 0); }
                    10% { transform: translate(-1px, 1px); clip-path: inset(10% 0 30% 0); }
                    20% { transform: translate(1px, -1px); clip-path: inset(40% 0 10% 0); }
                    30% { transform: translate(1px, 1px); clip-path: inset(20% 0 50% 0); }
                    40% { transform: translate(-1px, -1px); clip-path: inset(60% 0 5% 0); }
                    50% { transform: translate(0); clip-path: inset(0 0 0 0); }
                }
                .glitch-hover:hover {
                    animation: glitch 0.3s infinite;
                }
                .scanline {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: rgba(255, 0, 0, 0.1);
                    z-index: 100;
                    pointer-events: none;
                    animation: scanline 8s linear infinite;
                }
                @keyframes glitch-main {
                    0%, 88%, 100% { clip-path: none; transform: translate(0); }
                    90% { clip-path: inset(30% 0 50% 0); transform: translate(-3px, 0); }
                    92% { clip-path: inset(60% 0 10% 0); transform: translate(3px, 0); }
                    94% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, 0); }
                    96% { clip-path: none; transform: translate(0); }
                }
                @keyframes glitch-top {
                    0%, 88%, 100% { clip-path: inset(0 0 95% 0); transform: translate(0); opacity: 0; }
                    89% { clip-path: inset(0 0 70% 0); transform: translate(-4px, -2px); opacity: 0.7; }
                    91% { clip-path: inset(5% 0 60% 0); transform: translate(4px, 0); opacity: 0.5; }
                    93% { clip-path: inset(10% 0 50% 0); transform: translate(-3px, 1px); opacity: 0.8; }
                    95% { clip-path: inset(0 0 95% 0); opacity: 0; }
                }
                @keyframes glitch-bot {
                    0%, 88%, 100% { clip-path: inset(85% 0 0 0); transform: translate(0); opacity: 0; }
                    89% { clip-path: inset(60% 0 0 0); transform: translate(5px, 2px); opacity: 0.6; }
                    91% { clip-path: inset(70% 0 5% 0); transform: translate(-4px, 0); opacity: 0.4; }
                    93% { clip-path: inset(50% 0 10% 0); transform: translate(3px, -1px); opacity: 0.7; }
                    95% { clip-path: inset(85% 0 0 0); opacity: 0; }
                }
                .glitch-title { position: relative; display: inline-block; width: 100%; }
                .glitch-title .gt-main { display: block; animation: glitch-main 5s infinite; }
                .glitch-title .gt-top {
                    position: absolute; inset: 0;
                    color: #FF5555;
                    animation: glitch-top 5s infinite;
                    pointer-events: none;
                }
                .glitch-title .gt-bot {
                    position: absolute; inset: 0;
                    color: #880000;
                    animation: glitch-bot 5s infinite 0.15s;
                    pointer-events: none;
                }
            `}} />

            {/* Pure Black Background with subtle stars and scanline */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
                <div className="scanline" />
            </div>

            {/* Top Navigation */}
            <header className="relative w-full px-4 md:px-8 py-4 flex justify-between items-center z-50 border-b border-[#FF0000]/40 bg-black/80 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2 text-[#FF0000] tracking-[0.3em] font-black text-xs sm:text-sm hover:text-red-400 transition-colors group">
                     <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                     SYSTEM.EXIT()
                </Link>
                
                <div className="hidden md:flex flex-1 justify-center relative group cursor-default">
                    <div className="border border-[#FF0000]/50 px-8 py-2 bg-[#FF0000]/5 flex items-center justify-center relative shadow-[0_0_15px_rgba(255,0,0,0.2)]">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FF0000]" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#FF0000]" />
                        <span className="text-[#FF0000] text-xs font-black tracking-[0.4em] font-mono">
                            SYS.PORTFOLIO_DB
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 border border-[#FF0000]/40 bg-black px-4 py-1.5 relative">
                         <div className="w-2 h-2 bg-[#FF0000] animate-pulse shadow-[0_0_10px_#FF0000]" />
                         <span className="text-[10px] font-bold tracking-[0.2em] font-mono text-[#FF0000]">LINK_ACTIVE</span>
                     </div>
                </div>
            </header>

            {/* Layout Grid - Pure Boxy Terminal Look */}
            <div className="relative z-10 w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 px-4 md:px-8 pt-8">
                
                {/* ── MOBILE ONLY: Horizontal chip project selector ── */}
                <div className="lg:hidden col-span-1 order-1 px-0 pt-2 pb-1">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[#FF0000] font-black tracking-[0.3em] text-sm font-mono">TARGET_LIST</span>
                        <span className="text-[#FF0000]/60 text-[9px] tracking-widest font-mono">[{PORTFOLIO_PROJECTS.length}_ENTRIES]</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {PORTFOLIO_PROJECTS.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => { setSelectedIndex(i); playSelect(); }}
                                className={`shrink-0 px-3 py-2 border font-mono text-[10px] tracking-[0.2em] uppercase font-bold transition-all ${
                                    selectedIndex === i
                                    ? 'border-[#FF0000] bg-[#FF0000]/15 text-[#FF3333] shadow-[0_0_10px_rgba(255,0,0,0.3)]'
                                    : 'border-[#FF0000]/30 bg-black text-[#FF0000]/60'
                                }`}
                            >
                                <span className="text-[#FF0000]/40 mr-1">{String(i + 1).padStart(2, '0')}</span>
                                {p.shortName}
                            </button>
                        ))}
                    </div>
                    {/* Active indicator bar */}
                    <div className="h-[1px] bg-gradient-to-r from-[#FF0000]/60 via-[#FF0000]/20 to-transparent" />
                </div>

                {/* ---------------- LEFT COL: ROSTER LIST (desktop only) ---------------- */}
                <div className="hidden lg:flex lg:col-span-3 flex-col order-2 lg:order-1 lg:h-screen lg:sticky lg:top-0 lg:pt-4">
                    <div className="border-b border-[#FF0000]/50 pb-2 mb-4 flex justify-between items-end shrink-0">
                        <h2 className="text-[#FF0000] font-black tracking-[0.3em] text-sm sm:text-base">TARGET_LIST</h2>
                        <span className="text-[#FF0000]/60 text-[10px] tracking-widest font-mono">[{PORTFOLIO_PROJECTS.length}_ENTRIES]</span>
                    </div>
                    <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#440000 #000' }}
                    >
                        {PORTFOLIO_PROJECTS.map((p, i) => (
                            <button 
                                key={i}
                                onClick={() => { setSelectedIndex(i); playSelect(); }}
                                onMouseEnter={playHover}
                                className={`w-full text-left p-3 sm:p-4 transition-all relative font-mono flex items-center border ${
                                    selectedIndex === i 
                                    ? 'bg-[#FF0000]/10 border-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.4)]' 
                                    : 'bg-black border-transparent hover:border-[#FF0000]/50'
                                }`}
                            >
                                {selectedIndex === i && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF0000]" />}
                                <span className={`text-[10px] sm:text-xs tracking-widest w-12 shrink-0 pl-2 ${selectedIndex === i ? 'text-[#FF3333] font-bold' : 'text-[#FF0000]/40'}`}>
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className={`text-xs sm:text-sm tracking-[0.2em] font-black truncate w-full ${selectedIndex === i ? 'text-[#FF3333] drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]' : 'text-[#FF0000]/80'}`}>
                                    {p.shortName}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ---------------- CENTER COL: MAIN PROJECT SHOWCASE ---------------- */}
                <div className="lg:col-span-6 flex flex-col items-center order-2 lg:order-2">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={selectedProject.title}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="w-full flex flex-col items-center"
                        >
                            {/* Project Title */}
                            <div className="glitch-title text-lg sm:text-xl lg:text-xl font-black tracking-[0.2em] text-[#FF0000] text-center uppercase leading-tight" style={{ fontFamily: "var(--font-orbitron)" }}>
                                <span className="gt-main">{selectedProject.title}</span>
                                <span className="gt-top" aria-hidden>{selectedProject.title}</span>
                                <span className="gt-bot" aria-hidden>{selectedProject.title}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 mb-0">
                                <span className="h-[1px] w-12 bg-[#FF0000]/50" />
                                <p className="text-[#FF0000]/80 tracking-[0.4em] font-bold text-[10px] sm:text-xs uppercase font-mono bg-black border border-[#FF0000]/30 px-4 py-1">
                                    [ ID: {selectedProject.id} ]
                                </p>
                                <span className="h-[1px] w-12 bg-[#FF0000]/50" />
                            </div>
                            {/* Unified Image + Docked Radar */}
                            <CyberpunkImageCard imgSrc={selectedProject.imgSrc} onImageHover={playImageHover} />

                            {/* Description Box below */}
                            <div className="w-full max-w-4xl mb-8 bg-black border border-[#FF0000]/40 p-5 sm:p-6 relative">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FF0000]" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#FF0000]" />
                                <h3 className="text-[#FF3333] font-bold text-xs tracking-[0.3em] font-mono border-b border-[#FF0000]/30 pb-2 mb-4 uppercase flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#FF0000] animate-pulse shadow-[0_0_8px_#FF0000]" /> OVERVIEW_LOG
                                </h3>
                                <p className="text-[#FF3333]/80 text-xs sm:text-sm leading-loose font-mono tracking-widest">
                                    {selectedProject.description}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ---------------- RIGHT COL: DATA & LOADOUT ---------------- */}
                <div className="lg:col-span-3 flex flex-col gap-4 lg:gap-8 order-3 pt-0">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={selectedProject.title + "-stats"}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col gap-4 lg:gap-6"
                        >
                            {/* MOBILE: stacked 1-col | DESKTOP: also 1-col */}
                            <div className="flex flex-col gap-4 lg:gap-6">
                            {/* ── MODULE_LOADOUT HUD PANEL (TOP) ── */}
                            <div className="relative bg-black overflow-hidden">
                                {/* Top edge HUD bar */}
                                <div className="h-[2px] bg-gradient-to-r from-[#FF0000] via-[#FF0000]/50 to-transparent" />
                                
                                {/* Corner bracket decorations */}
                                <div className="absolute top-[2px] left-0 w-4 h-4 border-l-2 border-t-2 border-[#FF0000]" />
                                <div className="absolute top-[2px] right-0 w-4 h-4 border-r-2 border-t-2 border-[#FF0000]" />

                                {/* Header */}
                                <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col gap-[3px]">
                                            <div className="w-3 h-[1px] bg-[#FF0000]" />
                                            <div className="w-5 h-[1px] bg-[#FF0000]" />
                                            <div className="w-2 h-[1px] bg-[#FF0000]" />
                                        </div>
                                        <span className="text-[#FF0000] text-[10px] font-mono tracking-[0.45em] uppercase font-black">MODULE_LOADOUT</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-ping opacity-75" />
                                        <span className="text-[#FF0000]/50 text-[8px] font-mono">{selectedProject.tech.length}x_ACTIVE</span>
                                    </div>
                                </div>

                                {/* Divider with signal blip */}
                                <div className="mx-4 h-[1px] bg-[#FF0000]/20 relative overflow-hidden">
                                    <div className="absolute h-full w-4 bg-[#FF0000]/60" 
                                         style={{animation: 'slideRight 2s linear infinite'}} />
                                </div>

                                {/* Tech rows */}
                                <div className="p-3 flex flex-col gap-1.5">
                                    {selectedProject.tech.map((tech, index) => (
                                        <div
                                            key={index}
                                            className="group/module relative flex flex-col gap-0.5 px-3 py-2 border-l-2 border-[#FF0000]/20 hover:border-[#FF0000] bg-transparent hover:bg-[#FF0000]/5 transition-all duration-150 cursor-default overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[#FF0000]/30 text-[8px] font-mono">[{String(index).padStart(2,'0')}]</span>
                                                    <span className="text-[#FF3333] text-[11px] font-mono font-bold tracking-[0.25em] uppercase">{tech}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[1,2,3,4].map(b => (
                                                        <div key={b} 
                                                            className={`w-[3px] bg-[#FF0000] transition-opacity ${b <= 3 ? 'opacity-70' : 'opacity-20'}`} 
                                                            style={{height: `${b * 3}px`, alignSelf: 'flex-end'}} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="h-[1px] w-full bg-[#FF0000]/10 relative overflow-hidden">
                                                <div 
                                                    className="absolute h-full bg-[#FF0000]/40 group-hover/module:bg-[#FF0000]/70 transition-all duration-500"
                                                    style={{width: `${65 + (index * 11) % 35}%`}}
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF0000]/8 to-transparent -translate-x-full group-hover/module:translate-x-full transition-transform duration-700 pointer-events-none" />
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom edge */}
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#FF0000]" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#FF0000]" />
                                <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FF0000]/50 to-[#FF0000]" />
                            </div>

                            {/* ── SYSTEM_PROFILE HUD PANEL (BOTTOM) ── */}
                            <div className="relative group/sys border-l-4 border-[#FF0000] bg-black overflow-hidden">
                                {/* Scanline Texture Overlay */}
                                <div className="absolute inset-0 pointer-events-none opacity-10" 
                                     style={{ backgroundImage: 'repeating-linear-gradient(0deg, #FF0000, #FF0000 1px, transparent 1px, transparent 2px)', backgroundSize: '100% 2px' }} 
                                />
                                
                                {/* HUD Header with Decals */}
                                <div className="flex items-center justify-between px-4 py-2 bg-[#FF0000]/5 border-b border-[#FF0000]/20 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="w-4 h-[1px] bg-[#FF0000]" />
                                            <div className="w-2 h-[1px] bg-[#FF0000]" />
                                        </div>
                                        <span className="text-[#FF0000] text-[10px] font-mono tracking-[0.4em] uppercase font-black">
                                            SYSTEM_PROFILE
                                        </span>
                                    </div>
                                    <div className="text-[#FF0000]/40 text-[8px] font-mono flex flex-col items-end">
                                        <span>LOC // CORE_01</span>
                                        <span className="animate-pulse">RUNNING...</span>
                                    </div>
                                </div>

                                {/* HUD Data Rows */}
                                <div className="p-4 space-y-3 relative">
                                    {[
                                        { k: 'PR_YEAR', v: selectedProject.year, status: 'STABLE' },
                                        { k: 'AUTH_RANK', v: selectedProject.role, status: 'VERIFIED' },
                                        { k: 'UNIT_CLASS', v: selectedProject.type, status: 'ACTIVE' },
                                        { k: 'SYS_STATE', v: selectedProject.status, status: 'NOMINAL' },
                                    ].map(({ k, v, status }) => (
                                        <div key={k} className="flex flex-col gap-0.5 relative group/row">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[#FF0000]/60 text-[8px] font-mono tracking-widest uppercase">{k}</span>
                                                <span className="text-[#FF0000]/40 text-[7px] font-mono">[{status}]</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-1 bg-[#FF0000]/60" />
                                                <span className="text-[#FF3333] text-xs font-mono font-bold tracking-[0.1em] uppercase">
                                                    {v}
                                                </span>
                                            </div>
                                            {/* Accent line that grows on panel hover */}
                                            <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#FF0000]/20 group-hover/sys:w-full transition-all duration-700" />
                                        </div>
                                    ))}
                                </div>

                                {/* Faceted Corner Decals */}
                                <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                                    <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#FF0000]" />
                                </div>
                            </div>
                            </div>{/* end 2-col HUD grid */}

                            {/* Execution Button */}
                            <div className="pb-8 lg:pb-12">
                                <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="w-full block group outline-none" onMouseEnter={playHover}>
                                    <button className="relative w-full py-3 bg-black border border-[#FF0000]/70 text-[#FF0000] hover:bg-[#FF0000] hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group">
                                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current" />
                                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current" />
                                        <ExternalLink size={12} className="group-hover:scale-110 transition-transform shrink-0" />
                                        <span className="text-[10px] sm:text-[11px] tracking-[0.35em] uppercase font-mono font-bold">INITIATE_PROTOCOL</span>
                                    </button>
                                </a>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
