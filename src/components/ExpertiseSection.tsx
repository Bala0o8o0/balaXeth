"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX, Activity, Cpu, Thermometer, Radio } from "lucide-react";

// ─── High-Precision Command Terminal (Sci-Fi HUD Style) ─────────────────────────────
function CommandTerminal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  
  // Real-time fluctuating telemetry state
  const [telemetry, setTelemetry] = useState({
    cpu: 84.6,
    ping: 13.37,
    temp: 42.3
  });
  
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState(false);

  const activeItem = EXPERTISE_ITEMS[activeIndex];

  // Telemetry fluctuation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        cpu: +(72 + Math.random() * 18).toFixed(1),
        ping: +(12.9 + Math.random() * 0.9).toFixed(2),
        temp: +(40.8 + Math.random() * 2.8).toFixed(1)
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // ─── Web Audio Synthesizer (Pure JS, No Assets Needed) ───
  const audioSynthRef = useRef<{
    ctx: AudioContext | null;
    muted: boolean;
    init: () => void;
    playClick: () => void;
    playSuccess: () => void;
    playError: () => void;
    playBoot: () => void;
    playBeep: (freq?: number, duration?: number, type?: OscillatorType) => void;
  }>({
    ctx: null,
    muted: true,
    init() {
      try {
        if (!this.ctx && typeof window !== "undefined") {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            this.ctx = new AudioCtx();
          }
        }
        if (this.ctx && this.ctx.state === "suspended") {
          const res = this.ctx.resume();
          if (res && typeof res.catch === "function") {
            res.catch(() => {});
          }
        }
      } catch (e) {
        console.warn("Web Audio API blocked or not supported:", e);
      }
    },
    playClick() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    },
    playSuccess() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(650, t);
        osc.frequency.setValueAtTime(950, t + 0.07);
        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + 0.2);
      } catch (e) {}
    },
    playError() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.linearRampToValueAtTime(80, t + 0.25);
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + 0.25);
      } catch (e) {}
    },
    playBoot() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(60, t);
        osc.frequency.linearRampToValueAtTime(120, t + 0.4);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(120, t);
        filter.frequency.exponentialRampToValueAtTime(1400, t + 0.35);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + 0.5);
      } catch (e) {}
    },
    playBeep(freq = 800, duration = 0.1, type = "sine") {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }
  });

  // Sync mute state with synthesizer
  useEffect(() => {
    audioSynthRef.current.muted = isMuted;
  }, [isMuted]);

  // Automated simulated log loader when switching categories
  const triggerModuleChange = (idx: number) => {
    if (isBooting) return; // Prevent concurrent loops during transition
    if (idx === activeIndex) return;

    audioSynthRef.current.playClick();
    const targetModule = EXPERTISE_ITEMS[idx];
    const hex = (idx + 1).toString().padStart(2, "0");
    const logs = [
      `BalaOS:~$ load --module=0x${hex}`,
      `[ RUNNING ] INTEGRITY SYSTEM SCAN...`,
      `[ COMPLETED ] METADATA INTEGRITY VERIFIED (chksum: 0x${Math.random().toString(16).slice(2, 8).toUpperCase()})`,
      `[ ACTIVE ] LOADING DATASTREAM "SYS_${targetModule.title.replace(/[^A-Z]/gi, '_').toUpperCase()}"`,
      `[ SUCCESS ] DIRECT DATA ACCESS CONNECTED AT PORT_80${hex}`,
    ];

    setIsBooting(true);
    setBootLogs([]);
    audioSynthRef.current.playBoot();

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < logs.length) {
        const lineText = logs[currentLine];
        setBootLogs((prev) => [...prev, lineText]);
        audioSynthRef.current.playClick();
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setActiveIndex(idx);
          setIsBooting(false);
        }, 100);
      }
    }, 50);
  };

  // Statically map levels and statuses for a high-tech custom HUD list
  const getSkillCompetency = (idx: number) => {
    // Competency levels out of 5 based on tech skill details
    const levels = [5, 5, 4, 4, 3, 5, 4, 5];
    return levels[idx % levels.length];
  };

  const getSkillStatusTag = (idx: number) => {
    const tags = ["SECURE", "UPLINK", "MASTER", "COMPILED", "ONLINE", "ACTIVE"];
    return tags[idx % tags.length];
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto mt-16 md:mt-24 relative p-[1px] bg-gradient-to-b from-[#FF0000] via-[#FF0000]/15 to-[#FF0000] shadow-[0_0_40px_rgba(255,0,0,0.35)]"
      style={{
        clipPath:
          "polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
      }}
    >
      {/* ── Inner HUD Container ── */}
      <div
        className="bg-[#020000]/95 relative flex flex-col md:flex-row overflow-hidden backdrop-blur-lg"
        style={{
          clipPath:
            "polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
        }}
      >
        {/* ── Global Scanline & Grid ── */}
        <div
          className="absolute inset-0 opacity-[0.05] z-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#FF0000 1px, transparent 1px), linear-gradient(90deg, #FF0000 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, #FF0000 2px, #FF0000 4px)",
          }}
        />

        {/* ── Left Column: Nav ── */}
        <div className="w-full md:w-[35%] relative z-10 border-b md:border-b-0 md:border-r border-[#FF0000]/40 flex flex-col h-[280px] sm:h-[340px] md:h-[580px] bg-[#020000]/70">
          {/* Top Header */}
          <div className="h-12 border-b border-[#FF0000]/40 flex items-center px-4 justify-between bg-[#FF0000]/20">
            <span className="text-[#FF0000] text-[10px] tracking-[0.4em] font-black uppercase font-mono drop-shadow-[0_0_4px_#FF0000]">
              SYS.MODULES
            </span>
            
            {/* Sound Controls */}
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                audioSynthRef.current.muted = !isMuted;
                audioSynthRef.current.playSuccess();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 border border-[#FF0000] bg-[#FF0000]/20 hover:bg-[#FF0000]/35 rounded text-[#FF0000] text-[9px] tracking-widest font-mono uppercase font-black transition-all cursor-pointer shadow-[0_0_12px_rgba(255,0,0,0.3)]"
              title="Toggle Audio Feedback"
            >
              {isMuted ? <VolumeX size={10} /> : <Volume2 size={10} className="animate-pulse" />}
              <span className="hidden min-[400px]:inline">{isMuted ? "SOUND: OFF" : "SOUND: ON"}</span>
            </button>
          </div>

          {/* Nav Items */}
          <div className="flex-1 overflow-y-auto scrollbar-hide py-2 bg-[#020000]/60">
            {EXPERTISE_ITEMS.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => triggerModuleChange(idx)}
                  className="w-full text-left px-5 py-3.5 flex items-center justify-between transition-all duration-300 relative group cursor-pointer"
                >
                  {/* Hover/Active Background */}
                  {isActive && !isBooting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/25 to-transparent border-l-[3px] border-[#FF0000]" />
                  )}
                  <div
                    className={`absolute inset-0 bg-[#FF0000]/10 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "hidden" : ""}`}
                  />

                  <div className="relative z-10 flex items-center gap-3">
                    <span
                      className={`text-[9px] font-mono font-bold ${isActive ? "text-[#FF0000] drop-shadow-[0_0_4px_#FF0000]" : "text-[#FF0000]/50"}`}
                    >
                      0x{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-xs tracking-[0.2em] uppercase font-bold transition-all ${isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,0,0,0.9)]" : "text-[#FF0000]/75 group-hover:text-[#FF3333]"}`}
                      style={{ fontFamily: "var(--font-orbitron)" }}
                    >
                      {item.title}
                    </span>
                  </div>

                  {/* Decorative right element */}
                  <div
                    className={`relative z-10 text-[8px] font-mono transition-colors tracking-widest ${isActive ? "text-[#FF0000] font-black drop-shadow-[0_0_4px_#FF0000]" : "text-[#FF0000]/30"}`}
                  >
                    {isActive ? "[ ACTIVE ]" : "------"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom decorative bar */}
          <div className="h-10 border-t border-[#FF0000]/40 flex items-center px-5 gap-3 bg-[#050000]">
            <div className="w-2.5 h-2.5 bg-[#FF0000] animate-pulse rounded-sm shadow-[0_0_12px_#FF0000]" />
            <span className="text-[#FF0000] text-[9px] tracking-[0.3em] font-black font-mono drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]">
              SYS.INTEGRITY_SAFE
            </span>
          </div>
        </div>

        {/* ── Right Column: Output ── */}
        <div className="w-full md:w-[65%] relative z-10 bg-[#050000]/95 flex flex-col h-[420px] sm:h-[450px] md:h-[580px]">


          {/* Top Bar Right: Telemetry Dashboard */}
          <div className="h-12 border-b border-[#FF0000]/40 flex items-center px-4 sm:px-6 md:px-8 justify-between bg-[#FF0000]/[0.05] relative z-10">
            <span className="text-[#FF0000] text-[10px] tracking-[0.3em] font-bold font-mono drop-shadow-[0_0_4px_rgba(255,0,0,0.4)]">
              DATABANK // {String(activeIndex + 1).padStart(2, "0")}
            </span>
            
            {/* Live Fluctuating Telemetry Widgets */}
            <div className="flex gap-4 sm:gap-6 text-[9px] font-mono text-[#FF0000] select-none font-bold">
              <div className="flex items-center gap-1.5">
                <Cpu size={10} className="text-[#FF0000] animate-pulse filter drop-shadow-[0_0_3px_#FF0000]" />
                <span>CPU: <span className="text-[#D1D5DB] font-bold drop-shadow-[0_0_3px_#FF0000]">{telemetry.cpu}%</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity size={10} className="text-[#FF0000] animate-pulse filter drop-shadow-[0_0_3px_#FF0000]" />
                <span>PING: <span className="text-[#D1D5DB] font-bold drop-shadow-[0_0_3px_#FF0000]">{telemetry.ping}ms</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Thermometer size={10} className="text-[#FF0000] animate-pulse filter drop-shadow-[0_0_3px_#FF0000]" />
                <span>TEMP: <span className="text-[#D1D5DB] font-bold drop-shadow-[0_0_3px_#FF0000]">{telemetry.temp}°C</span></span>
              </div>
            </div>
          </div>

          {/* Main Area: Loader or GUI Cards */}
          <div className="flex-1 relative flex flex-col overflow-hidden">
            {isBooting ? (
              // ── GUI Simulated Boot Loader ──
              <div className="flex-1 p-6 md:p-10 relative flex flex-col items-center justify-center font-mono text-[10px] sm:text-xs text-[#FF0000]/80 bg-[#020000]/80">
                {/* Corner Bracket Decorators */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#FF0000]/40" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#FF0000]/40" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#FF0000]/40" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#FF0000]/40" />

                <div className="w-full max-w-sm space-y-2 border border-[#FF0000] p-5 bg-[#FF0000]/10 shadow-[0_0_25px_rgba(255,0,0,0.25)] rounded">
                  <div className="flex items-center justify-between border-b border-[#FF0000]/40 pb-2 mb-4">
                    <span className="text-[#FF0000] font-black uppercase tracking-[0.2em] font-mono flex items-center gap-2 drop-shadow-[0_0_5px_#FF0000]">
                      <Cpu size={12} className="animate-spin text-[#FF0000]" />
                      SYS.SYNCING_CORES
                    </span>
                    <span className="text-[#FF0000] text-[9px] animate-pulse font-bold drop-shadow-[0_0_4px_#FF0000]">UPLINK_ON</span>
                  </div>

                  {bootLogs.map((log, lIdx) => {
                    if (!log) return null;
                    return (
                      <div
                        key={lIdx}
                        className={`font-mono text-left tracking-wide text-[10px] ${
                          log.startsWith("[ SUCCESS ]")
                            ? "text-[#D1D5DB] font-bold"
                            : log.startsWith("BalaOS:")
                            ? "text-white/60"
                            : "text-[#FF0000]/60"
                        }`}
                      >
                        {log}
                      </div>
                    );
                  })}

                  <div className="flex gap-1.5 pt-4">
                    <div className="h-[2px] bg-[#FF0000] w-full animate-pulse shadow-[0_0_8px_#FF0000]" />
                  </div>
                </div>
              </div>
            ) : (
              // ── Stunning Eye-Catching GUI HUD Card ──
              <div className="flex-1 p-5 sm:p-8 md:p-10 relative flex flex-col justify-between z-10">
                {/* Corner Bracket Decorators */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#FF0000] animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.3)]" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#FF0000] animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.3)]" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#FF0000] animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.3)]" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#FF0000] animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.3)]" />

                <div key={activeIndex} className="h-full flex flex-col justify-between">
                  <div>
                    {/* Header Info */}
                    <div className="flex flex-row items-start gap-4 sm:gap-6 mb-6">
                      <div
                        className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 bg-[#FF0000]/20 border border-[#FF0000] flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_25px_rgba(255,0,0,0.4)] relative"
                        style={{
                          clipPath:
                            "polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                        }}
                      >
                        {activeItem.icon}
                        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-[#FF0000] shadow-[0_0_6px_#FF0000]" />
                        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-[#FF0000]" />
                      </div>
                      <div className="pt-1 select-none">
                        <h3
                          className="text-[#FF0000] text-xl sm:text-3xl font-black uppercase tracking-widest leading-none mb-2.5"
                          style={{ fontFamily: "var(--font-orbitron)" }}
                        >
                          {activeItem.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-[#FF0000]/30 text-[#FF0000] text-[8px] font-mono tracking-[0.2em] font-bold border border-[#FF0000] shadow-[0_0_6px_rgba(255,0,0,0.3)]">
                            CORE.SYS
                          </span>
                          <p className="text-[#FF3333] text-[9px] sm:text-[11px] tracking-[0.2em] uppercase font-black font-mono drop-shadow-[0_0_5px_rgba(255,0,0,0.4)]">
                            {activeItem.sub}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Highly eye-catching tech skill layout */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-[1.5px] w-8 bg-[#FF0000]" />
                        <span className="text-[9px] text-[#FF0000] tracking-[0.3em] font-black uppercase font-mono flex items-center gap-1.5 drop-shadow-[0_0_4px_#FF0000]">
                          <Radio size={10} className="animate-pulse" />
                          SYS.TELEMETRY_DATA
                        </span>
                        <div className="h-[1.5px] flex-1 bg-gradient-to-r from-[#FF0000] to-transparent" />
                      </div>

                      {/* Staggered entrance panel cards */}
                      <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        variants={{
                          show: { transition: { staggerChildren: 0.05 } }
                        }}
                        initial="hidden"
                        animate="show"
                      >
                        {activeItem.skills.map((skill, idx) => {
                          const statusTag = getSkillStatusTag(idx);
                          return (
                            <motion.div
                              key={idx}
                              variants={{
                                hidden: { opacity: 0, x: 12, scale: 0.98 },
                                show: { opacity: 1, x: 0, scale: 1 }
                              }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="flex items-center justify-between p-3 border border-[#FF0000]/40 bg-[#FF0000]/5 hover:bg-[#FF0000]/15 hover:border-[#FF0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all duration-300 relative group cursor-default"
                              style={{
                                clipPath:
                                  "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
                              }}
                            >
                              <div className="absolute top-0 bottom-0 w-[2.5px] bg-[#FF0000] left-0 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300 shadow-[0_0_8px_#FF0000]" />
                              
                              <div className="flex items-center gap-2.5">
                                <span className="text-[#FF0000] text-[9px] font-mono font-bold">
                                  0x{String(idx + 1).padStart(2, "0")}
                                </span>
                                <span className="font-bold tracking-widest uppercase text-xs text-[#CCCCCC] group-hover:text-[#FF3333] transition-colors drop-shadow-[0_0_5px_rgba(255,0,0,0.3)]">
                                  {skill}
                                </span>
                              </div>

                              {/* Cyber competency tag */}
                              <div className="text-right flex flex-col items-end">
                                <span className="text-[9px] font-mono text-[#FF0000] font-black tracking-widest uppercase drop-shadow-[0_0_6px_rgba(255,0,0,0.4)]">
                                  [{statusTag}]
                                </span>
                                <span className="text-[7px] font-mono text-white/50 tracking-wider">
                                  SYS_OK
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </div>
                  </div>

                  {/* Decorative Footer */}
                  <div className="mt-4 flex flex-col gap-3 border-t border-[#FF0000]/40 pt-4 relative z-10 select-none">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[#FF0000] text-[8px] uppercase tracking-[0.3em] font-black font-mono drop-shadow-[0_0_4px_#FF0000]">
                          INTEGRITY_METRIC_SCAN
                        </span>
                        <div className="flex gap-0.5">
                          {[...Array(18)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-2 sm:h-2.5 transition-all ${
                                i % 4 === 0 
                                  ? "bg-[#FF0000] shadow-[0_0_6px_#FF0000] animate-pulse" 
                                  : "bg-[#FF0000]/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-[8px] font-mono text-[#FF0000]/60 tracking-[0.2em] hidden sm:inline">
                          SECURE_LINK // BALA_OS_16.1.6
                        </span>
                        <span
                          className="text-[#FF0000] text-[28px] sm:text-[36px] leading-none font-black opacity-20 select-none drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]"
                          style={{ fontFamily: "var(--font-orbitron)" }}
                        >
                          {String(activeIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const EXPERTISE_ITEMS = [
  {
    title: "AI Agents / MCPs",
    sub: "Autonomous Systems Architecture",
    skills: [
      "Gemini CLI",
      "Qwen CLI",
      "Cursor",
      "Google AI Studio",
      "Antigravity",
      "MCP Servers",
    ],
    className: "",
    icon: "🤖",
  },
  {
    title: "Web Development",
    sub: "Next.js & React Ecosystem",
    skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS"],
    className: "",
    icon: "💻",
  },
  {
    title: "AI Model Integration",
    sub: "LLMs & Vision Systems",
    skills: ["Gemini", "OpenAI", "Replicate", "Qwen", "LangChain"],
    className: "",
    icon: "🧠",
  },
  {
    title: "Web Design",
    sub: "UI/UX & Interactive Design",
    skills: ["Figma", "Creative Coding", "Motion", "Shader Lab"],
    className: "",
    icon: "🎨",
  },
  {
    title: "Serverless Backends",
    sub: "Scalable Cloud Infrastructure",
    skills: ["Supabase", "Convex", "Prisma", "PostgreSQL"],
    className: "",
    icon: "⚡",
  },
  {
    title: "Web3 & Blockchain",
    sub: "DApp Smart Contracts",
    skills: ["Solidity", "Thirdweb", "Ethers.js", "Web3Auth"],
    className: "",
    icon: "⛓️",
  },
  {
    title: "3D Rendering",
    sub: "Three.js & WebGL Visuals",
    skills: ["Spline", "Three.js", "GLSL", "Blender"],
    className: "",
    icon: "🧱",
  },
  {
    title: "Deployment",
    sub: "Vercel & AWS Edge Services",
    skills: ["Vercel", "Netlify", "CI/CD Pipelines", "Docker"],
    className: "",
    icon: "🚀",
  },
  {
    title: "Generative Design",
    sub: "Creative AI Tooling Systems",
    skills: ["Stable Diffusion", "Midjourney", "ComfyUI", "LoRA"],
    className: "",
    icon: "🪄",
  },
];

// ─── Dragon Network Visualizer (unchanged) ───────────────────────────────────
function DragonNetworkVisualizer() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "-100px" });

  const nodes = [
    "UI DESIGN",
    "WEB-APPS",
    "SERVERLESS DB's",
    "AI MODELS",
    "FINE TUNING",
    "Generative UI",
    "WEB3",
    "GEN DESIGN",
  ];

  const [radius, setRadius] = useState(310);

  useEffect(() => {
    const handleResize = () => setRadius(window.innerWidth < 768 ? 285 : 310);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[500px] md:h-[660px] flex items-center justify-center z-10 my-4 overflow-hidden"
    >
      <div className="relative w-[660px] h-[660px] flex items-center justify-center transform scale-[0.4] min-[375px]:scale-[0.45] min-[430px]:scale-[0.5] sm:scale-[0.75] md:scale-100 origin-center">
        {/* Simplified Outer Frame (Static) */}
        <div className="absolute w-[450px] h-[450px] md:w-[500px] md:h-[500px] rounded-[100px] border border-[#FF0000]/10 border-dashed rotate-45 z-0" />

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
                    "linear-gradient(to right, transparent, rgba(255,0,0,0.12) 20%, rgba(255,0,0,0.4) 100%)",
                  zIndex: 5,
                }}
              >
                {/* Flowing light pulse animation to give the network life */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#FF3333] to-transparent"
                  style={{
                    width: "80px",
                    filter: "drop-shadow(0 0 5px #FF0000)",
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
                    backgroundColor: "#FF0000",
                    boxShadow: "0 0 8px #FF0000",
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
                  <div className="absolute inset-0 bg-[#070000]/90" />
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "linear-gradient(#FF0000 1px, transparent 1px), linear-gradient(90deg, #FF0000 1px, transparent 1px)",
                      backgroundSize: "8px 8px",
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF0000]/50 to-transparent" />

                  <div
                    className="absolute inset-0 border border-[#FF0000]/20"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                    }}
                  />

                  <div className="absolute top-0 right-[12px] w-[17px] h-[1px] bg-[#FF0000]/40 origin-right rotate-[-45deg] translate-y-[6px] translate-x-[6px]" />
                  <span className="absolute top-[4px] left-[6px] text-[7px] font-mono text-[#FF0000]/30 tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="absolute bottom-[6px] right-[8px] w-[3px] h-[3px] rounded-full bg-[#FF0000]/50" />

                  <span
                    className="absolute inset-0 flex items-center justify-center text-[10px] md:text-[11px] font-black tracking-widest text-[#FF3333]/90 uppercase text-center leading-tight px-1"
                    style={{
                      fontFamily: "var(--font-orbitron)",
                      textShadow: "0 0 8px rgba(255,0,0,0.5)",
                    }}
                  >
                    {node}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[160px] h-[160px] md:w-[200px] md:h-[200px] flex items-center justify-center group">
          <div className="absolute inset-[15px] rounded-full border border-[#FF0000]/10 border-dashed" />
          <div className="relative w-[130px] h-[112px] md:w-[150px] md:h-[130px] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-[#FF0000]/80"
              style={{
                clipPath:
                  "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
              }}
            >
              <div
                className="absolute inset-[2px] bg-[#050000] overflow-hidden"
                style={{
                  clipPath:
                    "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(#FF0000 1px, transparent 1px), linear-gradient(90deg, #FF0000 1px, transparent 1px)",
                    backgroundSize: "10px 10px",
                  }}
                />
              </div>
            </div>
            <img
              src="/dragon.svg"
              className="w-16 h-16 md:w-20 md:h-20 z-10 opacity-80 object-contain filter drop-shadow(0 0 5px #FF0000)"
              alt="Dragon Core"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function ExpertiseSection() {
  return (
    <section className="relative w-full py-32 px-6 sm:px-8 md:px-12 lg:px-24 bg-[#020000] z-10 overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient red glow blobs removed for performance */}

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="mb-12 md:mb-20 flex flex-col items-center px-4">
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 w-full">
            <div className="w-8 md:w-16 h-[1px] bg-[#FF0000] shrink-0" />
            <span className="text-[#FF0000] font-mono text-[10px] md:text-sm tracking-[0.15em] md:tracking-[0.4em] font-bold uppercase drop-shadow-[0_0_8px_rgba(255,0,0,0.6)] text-center">
              SYSTEM CAPABILITIES
            </span>
            <div className="w-8 md:w-16 h-[1px] bg-[#FF0000] shrink-0" />
          </div>
          <h2
            className="text-white text-3xl sm:text-4xl md:text-7xl font-black uppercase tracking-tighter text-center"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            MY <span className="text-[#FF0000]">EXPERTISE</span>
          </h2>
        </div>

        {/* Dragon Network */}
        <DragonNetworkVisualizer />

        {/* ── Command Terminal View ── */}
        <CommandTerminal />
      </div>
    </section>
  );
}
