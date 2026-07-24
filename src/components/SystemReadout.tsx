"use client";

import { motion } from "framer-motion";

export function SystemReadout() {
  // Generate 16 random bars for wave visualization (fewer bars for smaller width)
  const bars = Array.from({ length: 16 });

  return (
    <div className="w-full flex flex-col gap-1 text-[#ffd400] font-mono relative select-none">
      {/* Spacer to maintain original height of the upper panel */}
      <div className="h-[20px] w-full" />

      {/* Signal Frequency Visualizer (Enhanced Hologram Wave) */}
      <div className="relative w-full h-2.5 border border-[#ffd400]/15 rounded bg-[#050505]/40 flex items-center justify-between px-1 overflow-hidden">
        {/* Wave Overlay Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255, 212, 0,0.1)_1px,transparent_1px)] bg-[size:100%_2px]" />
        
        {/* Equalizer Bars */}
        <div className="w-full h-1.5 flex items-end justify-between gap-[1px] z-10">
          {bars.map((_, i) => {
            const maxH = Math.sin((i / 16) * Math.PI) * 100;
            // Deterministic pseudo-random values
            const pseudoRandom = (seed: number) => {
              const x = Math.sin(seed + 1) * 10000;
              return x - Math.floor(x);
            };
            const randomScale = 0.2 + pseudoRandom(i) * 0.8;
            
            return (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-[#ffd400]/20 via-[#ffd400]/70 to-[#ffd400] rounded-[0.5px]"
                style={{ originY: 1 }}
                animate={{
                  height: [`${15 * randomScale}%`, `${maxH}%`, `${15 * randomScale}%`],
                }}
                transition={{
                  duration: 1.0 + pseudoRandom(i + 16) * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.04,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
