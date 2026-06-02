"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ArwesCard } from "@/components/ArwesCard";
import { CyberScanner } from "@/components/CyberScanner";

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden flex items-center">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 border border-[#FF0000]/50 rounded text-[#FF0000] hover:bg-[#FF0000]/20 transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-sm"
                        >
                            <ArwesCard type="kranox" className="w-full">
                                <div className="p-6 bg-[#000000]/90 rounded-3xl border border-[#FF0000]/30 shadow-[0_0_30px_rgba(255,0,0,0.2)] flex flex-col gap-6 relative">

                                    {/* Header / Close button */}
                                    <div className="flex justify-between items-center border-b border-[#FF0000]/30 pb-4">
                                        <span className="text-[#FF0000] text-xs font-bold tracking-[0.3em] uppercase">
                                            SYSTEM.NAV
                                        </span>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 rounded-full border border-[#FF0000]/50 text-[#FF0000] hover:bg-[#FF0000]/20 hover:scale-110 transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Links */}
                                    <div className="flex flex-col gap-4 text-center">
                                        {["About", "Portfolio", "Services", "API", "Business", "Contact"].map((item, i) => (
                                            <a
                                                key={item}
                                                href={`#${item.toLowerCase()}`}
                                                onClick={() => setIsOpen(false)}
                                                className="py-3 px-4 rounded border border-transparent hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10 text-[#FF0000] uppercase text-sm font-bold tracking-widest transition-all"
                                            >
                                                {item}
                                            </a>
                                        ))}
                                    </div>

                                    {/* Visual Decorative Scanner */}
                                    <div className="w-full opacity-50 mt-4">
                                        <CyberScanner />
                                    </div>
                                </div>
                            </ArwesCard>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
