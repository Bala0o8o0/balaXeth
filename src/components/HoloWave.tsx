"use client";

import { motion } from "framer-motion";

export function HoloWave({ className = "" }: { className?: string }) {
    // Generate 20 random bars
    const bars = Array.from({ length: 24 });

    return (
        <div className={`w-full h-4 flex items-center justify-between gap-[2px] ${className}`}>
            {bars.map((_, i) => {
                // Create a wave-like height distribution
                const maxH = Math.sin((i / 24) * Math.PI) * 100;
                const randomScale = 0.3 + Math.random() * 0.7;

                return (
                    <motion.div
                        key={i}
                        className="flex-1 bg-[#FF0000] rounded-sm"
                        animate={{ height: [`${20 * randomScale}%`, `${maxH}%`, `${20 * randomScale}%`] }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.05,
                        }}
                    />
                );
            })}
        </div>
    );
}
