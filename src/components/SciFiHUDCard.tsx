"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SciFiHUDCardProps {
    children: ReactNode;
    title?: string;
    className?: string;
}

export function SciFiHUDCard({ children, title, className = "" }: SciFiHUDCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`relative w-full p-1 ${className}`}
        >
            {/* The outer glowing border */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/40 to-transparent opacity-50 z-0" style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))' }} />

            {/* The main solid background */}
            <div className="relative bg-[#050000]/90 backdrop-blur-md border border-[#FF0000]/30 h-full w-full p-6 md:p-8 z-10 drop-shadow-[0_0_15px_rgba(255,0,0,0.15)] flex flex-col" style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))' }}>

                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF0000]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF0000]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF0000]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF0000]" />

                {title && (
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-6 pb-4 border-b border-[#FF0000]/20">
                        <div className="w-2 h-2 bg-[#FF0000] rounded-sm animate-pulse hidden md:block" />
                        <h3 className="text-[#FF0000] tracking-[0.2em] text-sm md:text-base font-bold uppercase text-center md:text-left" style={{ fontFamily: 'var(--font-orbitron)' }}>
                            {title}
                        </h3>
                    </div>
                )}

                <div className="relative z-20 flex-1">
                    {children}
                </div>

                {/* Cyber tech barcode decorative element */}
                <div className="absolute bottom-4 right-8 flex gap-1 z-0 opacity-20">
                    <div className="w-1 h-6 bg-[#FF0000]" />
                    <div className="w-2 h-6 bg-[#FF0000]" />
                    <div className="w-1 h-6 bg-[#FF0000]" />
                    <div className="w-3 h-6 bg-[#FF0000]" />
                    <div className="w-1 h-6 bg-[#FF0000]" />
                </div>
            </div>

        </motion.div>
    );
}
