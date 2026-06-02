"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function CyberScanner({ className = "" }: { className?: string }) {
    const [blocks, setBlocks] = useState<number[]>([]);

    useEffect(() => {
        // Generate an array of 40 random delays strictly on the client
        // so it doesn't cause hydration errors with server-rendered React
        setBlocks(Array.from({ length: 30 }).map(() => Math.random() * 1.5));
    }, []);

    if (blocks.length === 0) return <div className={`w-full flex items-center gap-[1px] h-1.5 ${className}`} />;

    return (
        <div className={`w-full flex items-center gap-[1px] h-1.5 relative overflow-hidden ${className}`}>
            {/* Randomly flashing barcode segments */}
            {blocks.map((delay, i) => (
                <motion.div
                    key={i}
                    className="h-full flex-1 bg-[#FF0000] shadow-[0_0_5px_#FF0000]"
                    animate={{ opacity: [0.1, 0.9, 0.1], height: ["40%", "100%", "40%"] }}
                    transition={{
                        duration: 0.8 + Math.random() * 0.4,
                        repeat: Infinity,
                        delay: delay,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Sweeping laser over the barcode */}
            <motion.div
                className="absolute top-0 bottom-0 w-[10%] bg-[#FF0000] shadow-[0_0_10px_#FF0000,0_0_20px_#FF0000] z-10 mix-blend-screen"
                animate={{ left: ["-10%", "110%"] }}
                transition={{ duration: 6.0, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
}
