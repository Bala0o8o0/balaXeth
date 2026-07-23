"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Github, Twitter, Linkedin, Activity, ArrowUpRight, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export function Footer() {
    const [time, setTime] = useState<string>("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleTransmission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        
        setStatus("sending");
        try {
            await fetch("https://formsubmit.co/ajax/balaxeth@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    message: "New transmission initiated from portfolio footer."
                })
            });
            setStatus("success");
            setEmail("");
            setTimeout(() => setStatus("idle"), 5000);
        } catch (error) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

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
        <footer className="relative w-full pt-20 pb-8 px-6 md:px-12 lg:px-20 bg-[#000000] border-t border-[#ffd400]/10 overflow-hidden font-mono selection:bg-[#ffd400]/30 selection:text-[#ffd400]">
            
            {/* Massive Background Typography Watermark */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none opacity-[0.02] select-none overflow-hidden">
                <span className="text-[20vw] font-black leading-none whitespace-nowrap" style={{ fontFamily: "var(--font-orbitron)" }}>
                    BALA
                </span>
            </div>

            {/* Glowing Accent Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ffd400]/50 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-16">
                
                {/* Top Grid Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                    
                    {/* Brand & Bio (Col span 5) */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div className="flex items-center gap-5">
                            <div className="relative w-16 h-16 bg-black border border-[#ffd400]/30 rounded-lg flex items-center justify-center p-2 shadow-[0_0_15px_rgba(255, 212, 0,0.1)] group hover:border-[#ffd400]/60 transition-colors">
                                <div className="absolute inset-0 bg-[#ffd400]/5 rounded-lg" />
                                <img
                                    src="/assets/dragon_logo.png"
                                    alt="Dragon Insignia"
                                    className="absolute inset-0 w-full h-full object-contain p-2 opacity-90 group-hover:opacity-100 group-hover:drop-shadow-[0_0_10px_rgba(255, 212, 0,0.8)] transition-all"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-4xl font-black text-white tracking-[0.2em] uppercase leading-none" style={{ fontFamily: "var(--font-orbitron)" }}>
                                    BALA
                                </h2>
                                <span className="text-[10px] text-[#ffd400] tracking-[0.3em] uppercase mt-2">ARCHITECT</span>
                            </div>
                        </div>

                        <p className="text-white/40 text-[11px] leading-relaxed tracking-widest max-w-sm uppercase">
                            Deploying high-performance digital architectures. Available for high-priority technical operations and freelance contracts.
                        </p>

                        {/* Interactive "Email / Newsletter" box typical of premium sites */}
                        <form onSubmit={handleTransmission} className="flex flex-col gap-3 mt-2 relative">
                            <span className="text-[9px] text-[#ffd400]/60 tracking-[0.3em] uppercase font-bold">Initiate Transmission</span>
                            <div className="flex items-center border border-[#ffd400]/20 bg-black max-w-sm focus-within:border-[#ffd400]/60 transition-colors group">
                                <div className="pl-4 pr-3 text-[#ffd400]/50 group-focus-within:text-[#ffd400]">
                                    <Mail size={14} />
                                </div>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ENTER_EMAIL_ADDRESS..." 
                                    className="w-full bg-transparent text-[10px] tracking-widest text-white placeholder-white/20 focus:outline-none py-3.5"
                                    required
                                    disabled={status === "sending"}
                                />
                                <button 
                                    type="submit" 
                                    disabled={status === "sending"}
                                    className="px-5 py-3.5 bg-[#ffd400]/10 hover:bg-[#ffd400] text-[#ffd400] hover:text-black transition-all font-bold text-[10px] tracking-[0.2em] border-l border-[#ffd400]/20 disabled:opacity-50"
                                >
                                    {status === "sending" ? "WAIT" : "SEND"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Spacer for large screens */}
                    <div className="hidden lg:block lg:col-span-1"></div>

                    {/* Navigation Columns (Col span 6) */}
                    <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {/* Sitemap */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-[10px] font-bold text-[#ffd400] tracking-[0.3em] uppercase border-b border-[#ffd400]/20 pb-2">Index</h3>
                            <ul className="flex flex-col gap-4">
                                {['Home', 'Experience', 'Portfolio', 'Contact'].map((item) => (
                                    <li key={item}>
                                        <a href={`#${item.toLowerCase()}`} className="group flex items-center gap-3 text-[11px] text-white/50 hover:text-white transition-colors tracking-widest uppercase">
                                            <span className="w-1.5 h-1.5 border border-[#ffd400]/30 group-hover:bg-[#ffd400] transition-colors" />
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Socials */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-[10px] font-bold text-[#ffd400] tracking-[0.3em] uppercase border-b border-[#ffd400]/20 pb-2">Network</h3>
                            <ul className="flex flex-col gap-4">
                                {[
                                    { name: 'GitHub', icon: Github, url: '#' },
                                    { name: 'LinkedIn', icon: Linkedin, url: '#' },
                                    { name: 'Twitter', icon: Twitter, url: '#' }
                                ].map((social) => (
                                    <li key={social.name}>
                                        <a href={social.url} className="group flex items-center gap-3 text-[11px] text-white/50 hover:text-white transition-colors tracking-widest uppercase">
                                            <social.icon size={12} className="text-[#ffd400]/50 group-hover:text-[#ffd400] transition-colors" />
                                            {social.name}
                                            <ArrowUpRight size={10} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-[#ffd400]" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal / Extra */}
                        <div className="flex flex-col gap-6 sm:col-span-1 col-span-2">
                            <h3 className="text-[10px] font-bold text-[#ffd400] tracking-[0.3em] uppercase border-b border-[#ffd400]/20 pb-2">System</h3>
                            <ul className="flex flex-row sm:flex-col gap-10 sm:gap-6">
                                <li className="flex flex-col gap-2">
                                    <span className="text-[9px] text-white/40 tracking-widest uppercase">Status</span>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#ffd400]/10 border border-[#ffd400]/20 w-fit">
                                        <div className="w-1.5 h-1.5 bg-[#ffd400] rounded-full animate-pulse shadow-[0_0_8px_#ffd400]" />
                                        <span className="text-[9px] text-[#ffd400] font-bold tracking-[0.2em] leading-none">ONLINE</span>
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
                            <Activity size={10} className="text-[#ffd400]/50" />
                            <span>LATENCY: 14ms</span>
                        </div>
                        <a href="#top" className="hover:text-[#ffd400] transition-colors flex items-center gap-1">
                            BACK_TO_TOP <ArrowUpRight size={10} />
                        </a>
                    </div>
                </div>

            </div>

            {/* Transmission Status Popup */}
            <AnimatePresence>
                {status === "success" && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 50, x: "-50%" }}
                        className="fixed bottom-10 left-1/2 z-50 flex items-center gap-4 bg-black/90 backdrop-blur-md border border-[#ffd400] px-6 py-4 shadow-[0_0_30px_rgba(255, 212, 0,0.4)]"
                    >
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-[#ffd400]/20 rounded-full animate-ping" />
                            <CheckCircle2 size={24} className="text-[#ffd400] relative z-10" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-[#ffd400] tracking-[0.2em] uppercase">Transmission Sent</span>
                            <span className="text-[10px] text-white/60 tracking-widest uppercase mt-1">Comm-link established. Protocol engaged.</span>
                        </div>
                    </motion.div>
                )}
                {status === "error" && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 50, x: "-50%" }}
                        className="fixed bottom-10 left-1/2 z-50 flex items-center gap-4 bg-black/90 backdrop-blur-md border border-orange-500 px-6 py-4 shadow-[0_0_30px_rgba(249,115,22,0.4)]"
                    >
                        <AlertCircle size={24} className="text-orange-500" />
                        <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-orange-500 tracking-[0.2em] uppercase">Transmission Failed</span>
                            <span className="text-[10px] text-white/60 tracking-widest uppercase mt-1">Interference detected. Try again later.</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </footer>
    );
}
