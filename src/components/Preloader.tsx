"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Unmount loader after exactly 4.5 seconds to reveal the site 
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 4500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed inset-0 z-[99999] bg-[#000000] flex flex-col items-center justify-center pointer-events-auto overflow-hidden"
                >
                    {/* Dragon Image & Hexagon Animation */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-10 overflow-visible">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="relative w-full h-full flex items-center justify-center"
                        >
                            {/* Animated Hacker Hexagon HUD (Preloader Size) */}
                            <svg
                                className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] overflow-visible"
                                viewBox="0 0 100 100"
                                style={{ overflow: "visible" }}
                            >
                                <defs>
                                    <clipPath id="preloaderHexClip">
                                        <polygon points="50,8 86.37,29 86.37,71 50,92 13.63,71 13.63,29" />
                                    </clipPath>
                                    <pattern id="hexGrid" width="4" height="4" patternUnits="userSpaceOnUse">
                                        <path d="M 4 0 L 0 0 0 4" fill="none" stroke="#FF0000" strokeWidth="0.2" opacity="0.4" />
                                    </pattern>
                                    <linearGradient id="preloaderLaserGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#FF0000" stopOpacity="0" />
                                        <stop offset="40%" stopColor="#FF0000" stopOpacity="0.8" />
                                        <stop offset="50%" stopColor="#FFaaaa" stopOpacity="1" />
                                        <stop offset="60%" stopColor="#FF0000" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#FF0000" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {/* Hexagon Scanning Radar (Outward Expanding Hexagons) */}
                                {[0, 1, 2].map((i) => (
                                    <motion.polygon
                                        key={`scan-${i}`}
                                        points="50,8 86.37,29 86.37,71 50,92 13.63,71 13.63,29"
                                        fill="none"
                                        stroke="#FF0000"
                                        strokeWidth="0.5"
                                        style={{ transformOrigin: "50% 50%" }}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1.6, opacity: [0, 0.5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 1 }}
                                    />
                                ))}

                                {/* Hexagon with Grid Background */}
                                <g clipPath="url(#preloaderHexClip)">
                                    {/* Darker background inside hexagon for contrast */}
                                    <rect x="0" y="0" width="100" height="100" fill="#110000" opacity="0.5" />
                                    {/* The Red Grid */}
                                    <rect x="0" y="0" width="100" height="100" fill="url(#hexGrid)" />
                                    
                                    {/* Vertical Scanning Laser */}
                                    <motion.rect
                                        x="0"
                                        width="100"
                                        height="30"
                                        fill="url(#preloaderLaserGrad)"
                                        animate={{ y: [-30, 120] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                    />
                                </g>

                                {/* Main Hexagon Outline */}
                                <polygon
                                    points="50,8 86.37,29 86.37,71 50,92 13.63,71 13.63,29"
                                    stroke="#FF0000"
                                    strokeWidth="1.2"
                                    fill="none"
                                />
                                
                                {/* Inner Pulsing Hexagon Outline */}
                                <motion.polygon
                                    points="50,11 83.77,30.5 83.77,69.5 50,89 16.23,69.5 16.23,30.5"
                                    stroke="#FF0000"
                                    strokeWidth="0.5"
                                    fill="none"
                                    animate={{ opacity: [0.2, 0.8, 0.2] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </svg>

                            {/* Glitch mask for the image */}
                            <motion.div
                                animate={{ opacity: [1, 0.8, 1, 0.9, 1], filter: ["hue-rotate(0deg)", "hue-rotate(10deg)", "hue-rotate(0deg)"] }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                                className="relative w-[50%] h-[50%] flex items-center justify-center z-10"
                            >
                                <Image
                                    src="/assets/dragon_logo.png"
                                    alt="Dragon Insignia"
                                    fill
                                    sizes="(max-width: 768px) 96px, 128px"
                                    className="object-contain filter drop-shadow-[0_0_12px_#FF0000]"
                                    priority
                                />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* User Name BALA below */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
                        className="text-[#FF0000] text-4xl md:text-6xl tracking-[0.5em] font-black uppercase drop-shadow-[0_0_30px_#FF0000] ml-6"
                        style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                        BALA
                    </motion.div>

                    {/* Glitching Hacker Status */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 2.2 }}
                        className="text-[#FF0000] text-xs md:text-sm tracking-widest mt-8 font-mono border border-[#FF0000]/30 px-6 py-2 rounded-full cursor-default"
                    >
                        SYSTEM_OVERRIDE_ACTIVE [████████]
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
