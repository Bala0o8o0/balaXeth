"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Activity, ArrowUpRight, Mail } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export function Footer() {
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString("en-US", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            });
            setTime(`IST // ${timeString}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="relative w-full pt-20 pb-8 px-6 md:px-12 lg:px-20 bg-[#030303] border-t border-[#FF0000]/10 overflow-hidden font-mono selection:bg-[#FF0000]/30 selection:text-[#FF0000]">
            
            {/* Massive Background Typography Watermark */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none opacity-[0.02] select-none overflow-hidden">
                <span className="text-[20vw] font-black leading-none whitespace-nowrap" style={{ fontFamily: "var(--font-orbitron)" }}>
                    BALA
                </span>
            </div>

            {/* Glowing Accent Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF0000]/50 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-16">
                
                {/* Top Grid Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                    
                    {/* Brand & Bio (Col span 5) */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div className="flex items-center gap-5">
                            <div className="relative w-16 h-16 bg-black border border-[#FF0000]/30 rounded-lg flex items-center justify-center p-2 shadow-[0_0_15px_rgba(255,0,0,0.1)] group hover:border-[#FF0000]/60 transition-colors">
                                <div className="absolute inset-0 bg-[#FF0000]/5 rounded-lg" />
                                <Image
                                    src="/assets/dragon_logo.png"
                                    alt="Dragon Insignia"
                                    fill
                                    className="object-contain p-2 opacity-90 group-hover:opacity-100 group-hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition-all"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-4xl font-black text-white tracking-[0.2em] uppercase leading-none" style={{ fontFamily: "var(--font-orbitron)" }}>
                                    BALA
                                </h2>
                                <span className="text-[10px] text-[#FF0000] tracking-[0.3em] uppercase mt-2">SYS_ARCHITECT</span>
                            </div>
                        </div>

                        <p className="text-white/40 text-[11px] leading-relaxed tracking-widest max-w-sm uppercase">
                            Deploying high-performance digital architectures. Available for high-priority technical operations and freelance contracts.
                        </p>

                        {/* Interactive "Email / Newsletter" box typical of premium sites */}
                        <div className="flex flex-col gap-3 mt-2">
                            <span className="text-[9px] text-[#FF0000]/60 tracking-[0.3em] uppercase font-bold">Initiate Transmission</span>
                            <div className="flex items-center border border-[#FF0000]/20 bg-black max-w-sm focus-within:border-[#FF0000]/60 transition-colors group">
                                <div className="pl-4 pr-3 text-[#FF0000]/50 group-focus-within:text-[#FF0000]">
                                    <Mail size={14} />
                                </div>
                                <input 
                                    type="email" 
                                    placeholder="ENTER_EMAIL_ADDRESS..." 
                                    className="w-full bg-transparent text-[10px] tracking-widest text-white placeholder-white/20 focus:outline-none py-3.5"
                                />
                                <button className="px-5 py-3.5 bg-[#FF0000]/10 hover:bg-[#FF0000] text-[#FF0000] hover:text-black transition-all font-bold text-[10px] tracking-[0.2em] border-l border-[#FF0000]/20">
                                    SEND
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Spacer for large screens */}
                    <div className="hidden lg:block lg:col-span-1"></div>

                    {/* Navigation Columns (Col span 6) */}
                    <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {/* Sitemap */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-[10px] font-bold text-[#FF0000] tracking-[0.3em] uppercase border-b border-[#FF0000]/20 pb-2">Index</h3>
                            <ul className="flex flex-col gap-4">
                                {['Home', 'Experience', 'Portfolio', 'Contact'].map((item) => (
                                    <li key={item}>
                                        <a href={`#${item.toLowerCase()}`} className="group flex items-center gap-3 text-[11px] text-white/50 hover:text-white transition-colors tracking-widest uppercase">
                                            <span className="w-1.5 h-1.5 border border-[#FF0000]/30 group-hover:bg-[#FF0000] transition-colors" />
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Socials */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-[10px] font-bold text-[#FF0000] tracking-[0.3em] uppercase border-b border-[#FF0000]/20 pb-2">Network</h3>
                            <ul className="flex flex-col gap-4">
                                {[
                                    { name: 'GitHub', icon: Github, url: '#' },
                                    { name: 'LinkedIn', icon: Linkedin, url: '#' },
                                    { name: 'Twitter', icon: Twitter, url: '#' }
                                ].map((social) => (
                                    <li key={social.name}>
                                        <a href={social.url} className="group flex items-center gap-3 text-[11px] text-white/50 hover:text-white transition-colors tracking-widest uppercase">
                                            <social.icon size={12} className="text-[#FF0000]/50 group-hover:text-[#FF0000] transition-colors" />
                                            {social.name}
                                            <ArrowUpRight size={10} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-[#FF0000]" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal / Extra */}
                        <div className="flex flex-col gap-6 sm:col-span-1 col-span-2">
                            <h3 className="text-[10px] font-bold text-[#FF0000] tracking-[0.3em] uppercase border-b border-[#FF0000]/20 pb-2">System</h3>
                            <ul className="flex flex-row sm:flex-col gap-10 sm:gap-6">
                                <li className="flex flex-col gap-2">
                                    <span className="text-[9px] text-white/40 tracking-widest uppercase">Status</span>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FF0000]/10 border border-[#FF0000]/20 w-fit">
                                        <div className="w-1.5 h-1.5 bg-[#FF0000] rounded-full animate-pulse shadow-[0_0_8px_#FF0000]" />
                                        <span className="text-[9px] text-[#FF0000] font-bold tracking-[0.2em] leading-none">ONLINE</span>
                                    </div>
                                </li>
                                <li className="flex flex-col gap-2">
                                    <span className="text-[9px] text-white/40 tracking-widest uppercase">Local_Time</span>
                                    <div className="py-1">
                                        <span className="text-[10px] text-white/80 tracking-widest uppercase font-mono">
                                            {time || "SYNCING_TIME..."}
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Terminal Strip */}
                <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 text-[9px] text-white/30 tracking-[0.2em] uppercase">
                        <span>&copy; {new Date().getFullYear()} BALA MURUGAN.</span>
                        <span className="hidden sm:inline text-white/10">|</span>
                        <span className="hidden sm:inline">ALL_RIGHTS_RESERVED</span>
                    </div>

                    <div className="flex items-center gap-6 text-[9px] text-white/30 tracking-[0.2em] uppercase">
                        <div className="flex items-center gap-2">
                            <Activity size={10} className="text-[#FF0000]/50" />
                            <span>SYS_LATENCY: 14ms</span>
                        </div>
                        <a href="#top" className="hover:text-[#FF0000] transition-colors flex items-center gap-1">
                            BACK_TO_TOP <ArrowUpRight size={10} />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
