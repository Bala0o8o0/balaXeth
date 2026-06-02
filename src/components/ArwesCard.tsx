"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ArwesCardProps {
    children: ReactNode;
    className?: string;
    type?: "nero" | "corners" | "kranox";
}

export function ArwesCard({ children, className = "", type = "nero" }: ArwesCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`relative ${className}`}
        >
            {/* Custom Sci-Fi Borders */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {type === "corners" && (
                    <>
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF0000] opacity-70" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF0000] opacity-70" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF0000] opacity-70" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF0000] opacity-70" />
                    </>
                )}
                {(type === "kranox" || type === "nero") && (
                    <div className="absolute inset-x-0 inset-y-0 border border-[#FF0000]/30 shadow-[inset_0_0_20px_rgba(255,0,0,0.1)] rounded-tl-[1rem] rounded-br-[1rem]" />
                )}
            </div>

            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </motion.div>
    );
}
