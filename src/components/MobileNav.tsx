"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Github, Twitter, Linkedin, Instagram } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",       href: "#",           index: "01" },
  { label: "Experience", href: "#experience", index: "02" },
  { label: "Portfolio",  href: "#portfolio",  index: "03" },
];

const SOCIAL_LINKS = [
  { icon: Github,    href: "https://github.com/Bala0o8o0", label: "Github" },
  { icon: Twitter,   href: "https://x.com/balaXeth", label: "Twitter" },
  { icon: Linkedin,  href: "https://www.linkedin.com/in/bala-murugan-a3ba20240/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/balaxeth", label: "Instagram" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] pointer-events-none flex justify-end">
          {/* ── Backdrop ──────── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          />

          {/* ── Slide-in Drawer ────────────────────── */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative h-full w-[78vw] max-w-[320px] pointer-events-auto
                       flex flex-col overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,0,0,0.85) 0%, rgba(5,0,0,0.95) 60%, rgba(15,0,0,0.9) 100%)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              borderLeft: "1px solid rgba(255, 212, 0,0.3)",
              boxShadow: "-8px 0 60px rgba(255, 212, 0,0.15)",
            }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 pt-8 pb-6 border-b border-[#ffd400]/20">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/dragon_logo.png" 
                  alt="Dragon Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span
                  className="text-[#ffd400] text-lg font-bold tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-orbitron, monospace)" }}
                >
                  MENU
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation"
                className="p-2 border border-[#ffd400]/50 text-[#ffd400]
                           hover:bg-[#ffd400]/20 hover:shadow-[0_0_12px_rgba(255, 212, 0,0.5)]
                           transition-all duration-200 rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Nav Links ── */}
            <nav className="flex-1 flex flex-col gap-2 px-6 py-8 overflow-y-auto">
              {NAV_LINKS.map(({ label, href, index }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, duration: 0.3, ease: "easeOut" }}
                  className="group flex items-center gap-4 px-4 py-4
                             border border-transparent
                             hover:border-[#ffd400]/30
                             hover:bg-[#ffd400]/10
                             rounded-sm transition-all duration-200"
                >
                  <span className="text-[#ffd400]/50 font-mono text-xs tracking-widest min-w-[24px]">
                    {index}
                  </span>
                  <span
                    className="flex-1 text-[#ffd400] text-sm font-bold tracking-[0.15em] uppercase
                               group-hover:text-[#ffd400] drop-shadow-[0_0_2px_rgba(255, 212, 0,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(255, 212, 0,0.8)] transition-all duration-200"
                  >
                    {label}
                  </span>
                  <ChevronRight
                    className="w-4 h-4 text-[#ffd400]/40 group-hover:text-[#ffd400]
                               group-hover:translate-x-1 transition-all duration-200"
                  />
                </motion.a>
              ))}
            </nav>

            {/* ── Socials ── */}
            <div className="px-6 py-8 border-t border-[#ffd400]/20">
              <div className="flex justify-between items-center">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.25, duration: 0.3 }}
                    className="p-2.5 rounded-lg border border-[#ffd400]/20 text-[#ffd400]
                               hover:bg-[#ffd400]/10 hover:border-[#ffd400]/50 hover:shadow-[0_0_10px_rgba(255, 212, 0,0.3)]
                               hover:-translate-y-1 transition-all duration-300"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation"
        className="p-2.5 border border-[#ffd400]/60 text-[#ffd400]
                   hover:bg-[#ffd400]/15 hover:shadow-[0_0_16px_rgba(255, 212, 0,0.5)]
                   transition-all duration-300 rounded-sm"
      >
        <Menu className="w-6 h-6" />
      </button>

      {mounted && typeof document !== "undefined"
        ? createPortal(drawerContent, document.body)
        : null}
    </div>
  );
}
