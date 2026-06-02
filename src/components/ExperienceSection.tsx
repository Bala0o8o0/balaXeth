"use client";

import { motion } from "framer-motion";

const EXPERIENCE_DATA = [
    { year: "2024", title: "Tattoo Studio Website Development", company: "Baroquetatu. Trissur, Kerala", desc: "Designed And Developed Tattoo Studio Website For Baroquetatu." },
    { year: "2024", title: "NFT Website Frontend", company: "Little Dank Alienz (AlienzStudio) Chicago, United States", desc: "Designed An Nft Website(Dapp) UI For Little Dank Alienz NFT" },
    { year: "2023", title: "NFT DAPP Development", company: "Alienhood NFT, Remote", desc: "Designed And Developed Nft (Dapp) For AlienHood NFT" },
    { year: "2023", title: "Coffee Shop Website", company: "Berry Coffee Shop, Amsterdam, Netherlands", desc: "Designed And Developed Coffee Shop Website For Berry_Amsterdam" },
    { year: "2022", title: "Crypto R.O.I Dapp", company: "AVAX Snow House, Chicago, United States", desc: "Designed Crypto R.O.I Website UI For AVAX Snow House" },
    { year: "2022", title: "Crypto R.O.I Dapp", company: "FTM Grow House, Chicago, United States", desc: "Designed Crypto R.O.I Website UI For FTM GROW House" },
    { year: "2022", title: "Tour & Travel Website", company: "Vayulivin. Grahan, Himanchal Pradesh", desc: "Development Of Vayulivin, A Tour Showcase Website" },
    { year: "July 2022", title: "Crypto DAO App UI", company: "[ Mayan DAO ]", desc: "Designed and prototyped a crypto decentralized Autonomous Organisation app UI using Figma." },
    { year: "March 2021 - May 2022", title: "Website Design & Development", company: "[ Thriveni Apparels & Textiles Pvt.Ltd ]", desc: "Data tracking WebApp for tracking apparel data using WordPress, JavaScript & Google Sheets." },
];

export function ExperienceSection() {
    return (
        <section className="relative w-full py-24 px-4 md:px-12 lg:px-24 bg-[#050000] z-10 overflow-hidden">
            <div className="container mx-auto max-w-5xl relative z-10">
                {/* Section Header */}
                <div className="mb-12 md:mb-20 flex flex-col items-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-2 md:gap-4 mb-4 w-full"
                    >
                        <div className="w-8 md:w-16 h-[1px] bg-[#FF0000] shrink-0" />
                        <span className="text-[#FF0000] font-mono text-[10px] md:text-sm tracking-[0.15em] md:tracking-[0.4em] font-bold uppercase drop-shadow-[0_0_8px_rgba(255,0,0,0.6)] text-center">
                            OPERATION HISTORY
                        </span>
                        <div className="w-8 md:w-16 h-[1px] bg-[#FF0000] shrink-0" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#FF0000] text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(255,0,0,0.4)] text-center"
                        style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                        EXPERIENCE_LOG
                    </motion.h2>
                </div>

                {/* Timeline Container */}
                <div className="relative pl-8 md:pl-0">
                    {/* Glowing Center Line (hidden on small, centered on md+) */}
                    <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#FF0000]/10 transform md:-translate-x-1/2 rounded-full hidden sm:block">
                        <div className="absolute top-0 bottom-0 w-full bg-gradient-to-b from-transparent via-[#FF0000] to-transparent animate-pulse opacity-50 shadow-[0_0_15px_rgba(255,0,0,0.8)]" />
                    </div>

                    <div className="flex flex-col gap-12">
                        {EXPERIENCE_DATA.map((item, i) => {
                            const isEven = i % 2 === 0;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className={`relative flex flex-col md:flex-row items-start md:items-center w-full group ${isEven ? "md:justify-start" : "md:justify-end"
                                        }`}
                                >
                                    {/* Timeline Node Point (centered on md+) */}
                                    <div className="absolute left-0 md:left-1/2 transform -translate-x-[5px] md:-translate-x-1/2 mt-1.5 md:mt-0 w-3 h-3 bg-[#050000] border-2 border-[#FF0000] rounded-full z-20 group-hover:scale-150 group-hover:bg-[#FF0000] group-hover:drop-shadow-[0_0_10px_rgba(255,0,0,1)] transition-all duration-300" />

                                    {/* Content Card */}
                                    <div className={`w-full md:w-[45%] pl-8 md:pl-0 ${isEven ? 'md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'}`}>
                                        <div 
                                            className="group relative w-full p-[1px] overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(255,0,0,0.25)]"
                                            style={{ 
                                                clipPath: isEven 
                                                    ? 'polygon(0 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%)' 
                                                    : 'polygon(0 0, 100% 0, 100% 100%, 32px 100%, 0 calc(100% - 32px))'
                                            }}
                                        >
                                            {/* Holographic Border Ring - Pulses violently on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/60 via-[#FF0000]/20 to-[#FF0000]/60 group-hover:from-[#FF0000] group-hover:via-[#FF0000]/80 group-hover:to-[#FF0000] z-0 transition-all duration-500" />
                                            
                                            {/* Inner Content Container */}
                                            <div 
                                                className={`relative z-10 w-full h-full bg-gradient-to-br from-[#0a0000] to-[#020000] p-6 md:p-8 flex flex-col ${isEven ? 'md:items-end' : 'md:items-start'}`}
                                                style={{ 
                                                    clipPath: isEven 
                                                        ? 'polygon(0 0, 100% 0, 100% calc(100% - 31px), calc(100% - 31px) 100%, 0 100%)' 
                                                        : 'polygon(0 0, 100% 0, 100% 100%, 31px 100%, 0 calc(100% - 31px))'
                                                }}
                                            >
                                                {/* HUD Background Grid (Brighter on hover) */}
                                                <div className="absolute inset-0 opacity-10 group-hover:opacity-30 pointer-events-none z-0 transition-opacity duration-500" style={{ backgroundImage: 'linear-gradient(#FF0000 1px, transparent 1px), linear-gradient(90deg, #FF0000 1px, transparent 1px)', backgroundSize: '24px 24px', backgroundPosition: 'center' }} />
                                                
                                                {/* Vertical Scanline Effect */}
                                                <div className="absolute top-0 bottom-0 left-0 right-0 overflow-hidden pointer-events-none z-0">
                                                    <motion.div 
                                                        animate={{ y: ['-100%', '200%'] }}
                                                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: i * 0.15 }}
                                                        className="w-full h-[150px] bg-gradient-to-b from-transparent via-[#FF0000]/10 to-transparent border-b border-[#FF0000]/50 shadow-[0_5px_15px_rgba(255,0,0,0.4)]"
                                                    />
                                                </div>

                                                {/* Thematic Data Strand beside text */}
                                                <div className={`absolute top-0 bottom-0 w-[1px] bg-[#FF0000]/10 z-0 ${isEven ? 'right-4' : 'left-4'}`}>
                                                    <motion.div 
                                                        animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: 'circInOut', delay: i * 0.3 }}
                                                        className="absolute w-[3px] -ml-[1px] bg-[#FF0000] shadow-[0_0_10px_rgba(255,0,0,1)]" 
                                                    />
                                                </div>

                                                {/* HUD Top Accents */}
                                                <div className={`flex w-full mb-6 relative z-10 border-b border-[#FF0000]/30 pb-3 ${isEven ? 'justify-end' : 'justify-start'}`}>
                                                    <div className="flex items-start gap-3">
                                                        {/* Digital signal bars */}
                                                        {!isEven && (
                                                            <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity mt-1">
                                                                <motion.div animate={{ height: ['40%', '100%', '40%'] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 bg-[#FF0000]" />
                                                                <motion.div animate={{ height: ['80%', '40%', '80%'] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-1.5 h-3 bg-[#FF0000]" />
                                                                <motion.div animate={{ height: ['100%', '60%', '100%'] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-2 bg-[#FF0000]" />
                                                            </div>
                                                        )}
                                                        <span className="relative text-[#FF0000] font-mono tracking-widest text-[10px] md:text-xs font-black px-3 py-1 bg-[#FF0000]/10 border border-[#FF0000]/50 shadow-[0_0_15px_rgba(255,0,0,0.4)] group-hover:bg-[#FF0000] group-hover:text-black transition-all">
                                                            [ {item.year} ]
                                                            {/* Crosshairs on year tag */}
                                                            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/50" />
                                                            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/50" />
                                                        </span>
                                                        {isEven && (
                                                            <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity mt-1">
                                                                <motion.div animate={{ height: ['100%', '60%', '100%'] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-2 bg-[#FF0000]" />
                                                                <motion.div animate={{ height: ['80%', '40%', '80%'] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-1.5 h-3 bg-[#FF0000]" />
                                                                <motion.div animate={{ height: ['40%', '100%', '40%'] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 bg-[#FF0000]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <h3 className="text-[#FF0000] text-base md:text-xl font-black uppercase mb-3 tracking-widest drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] group-hover:drop-shadow-[0_0_20px_rgba(255,0,0,1)] group-hover:text-white transition-all relative z-10" style={{ fontFamily: 'var(--font-orbitron)' }}>
                                                    {item.title}
                                                </h3>

                                                <div className="flex items-center gap-3 mb-5 relative z-10">
                                                    {!isEven && <div className="w-8 h-[2px] bg-[#FF0000]" />}
                                                    <span className="text-black bg-[#FF0000] font-bold text-xs md:text-sm uppercase tracking-[0.25em] font-mono px-3 py-1 shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                                                        {item.company}
                                                    </span>
                                                    {isEven && <div className="w-8 h-[2px] bg-[#FF0000]" />}
                                                </div>

                                                <p className={`text-[#9CA3AF] text-sm md:text-base leading-relaxed relative z-10 group-hover:text-white transition-colors border-l-2 border-[#FF0000]/20 pl-4 py-1 ${isEven ? 'text-right border-l-0 border-r-2 pr-4' : 'text-left'}`} style={{ fontFamily: 'var(--font-rajdhani)', letterSpacing: '0.05em' }}>
                                                    {item.desc}
                                                </p>
                                                
                                                {/* Data Hash Decoration */}
                                                <div className={`mt-6 text-[#FF0000]/30 font-mono text-[8px] uppercase tracking-[0.4em] ${isEven ? 'text-right' : 'text-left'}`}>
                                                    <span className="group-hover:text-[#FF0000]/80 transition-colors">HEX_ADDR: 0x{((i + 1) * 0x12345678).toString(16).slice(0, 8)}</span>
                                                </div>

                                                {/* Animated Background Glow */}
                                                <div className={`absolute -bottom-10 ${isEven ? '-left-10' : '-right-10'} w-64 h-64 bg-[#FF0000]/10 rounded-full blur-[70px] group-hover:bg-[#FF0000]/30 transition-all duration-700 z-0 pointer-events-none`} />
                                            </div>

                                            {/* Cut accent lines - Thicker and brighter */}
                                            {isEven ? (
                                                <div className="absolute bottom-0 right-[32px] w-[50px] h-[3px] bg-[#FF0000]/90 origin-right rotate-[-45deg] -translate-y-[16px] translate-x-[16px] group-hover:bg-[#FF0000] group-hover:shadow-[0_0_20px_#FF0000] duration-300 transition-all z-20 pointer-events-none" />
                                            ) : (
                                                <div className="absolute bottom-0 left-[32px] w-[50px] h-[3px] bg-[#FF0000]/90 origin-left rotate-[-45deg] -translate-y-[16px] -translate-x-[16px] group-hover:bg-[#FF0000] group-hover:shadow-[0_0_20px_#FF0000] duration-300 transition-all z-20 pointer-events-none" />
                                            )}
                                        </div>
                                    </div>

                                </motion.div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}
