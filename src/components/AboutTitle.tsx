"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CHARS = "!<>-_\\\\/[]{}—=+*^?#________";

export function AboutTitle() {
    const defaultText = "ABOUT ME";
    const [text, setText] = useState(defaultText);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!isHovered) {
            setText(defaultText);
            return;
        }

        let iteration = 0;
        const interval = setInterval(() => {
            setText((prev) =>
                prev
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return defaultText[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= defaultText.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3; // slower decoding
        }, 30);

        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <div className="w-full flex items-center justify-center mt-16 md:mt-32 py-6 md:py-10 border-y border-[#ffd400]/10 bg-transparent">
            <motion.div
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="relative group cursor-crosshair flex flex-col items-center"
            >
                {/* Main Foreground Text - Removed shadows, glitch layers, and blurs */}
                <h2
                    className="relative text-[#ffd400] font-black tracking-[0.3em] md:tracking-[0.5em] text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase z-10 text-center"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                    {text}
                </h2>

                {/* Corner Accents */}
                <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2 border-[#ffd400] opacity-50 transition-all duration-300 group-hover:-top-6 group-hover:-left-6" />
                <div className="absolute -top-4 -right-4 w-4 h-4 border-t-2 border-r-2 border-[#ffd400] opacity-50 transition-all duration-300 group-hover:-top-6 group-hover:-right-6" />
                <div className="absolute -bottom-4 -left-4 w-4 h-4 border-b-2 border-l-2 border-[#ffd400] opacity-50 transition-all duration-300 group-hover:-bottom-6 group-hover:-left-6" />
                <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b-2 border-r-2 border-[#ffd400] opacity-50 transition-all duration-300 group-hover:-bottom-6 group-hover:-right-6" />
            </motion.div>
        </div>
    );
}
