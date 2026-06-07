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
                    {/* Dragon Image Animation */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-10 overflow-visible">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="relative w-full h-full drop-shadow-[0_0_20px_#FF0000]"
                        >
                            {/* Glitch mask for the image */}
                            <motion.div
                                animate={{ opacity: [1, 0.5, 1, 0.8, 1], filter: ["hue-rotate(0deg)", "hue-rotate(20deg)", "hue-rotate(0deg)"] }}
                                transition={{ duration: 0.3, repeat: Infinity, repeatType: "mirror" }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src="/assets/dragon_logo.png"
                                    alt="Dragon Insignia"
                                    fill
                                    sizes="(max-width: 768px) 192px, 256px"
                                    className="object-contain"
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
