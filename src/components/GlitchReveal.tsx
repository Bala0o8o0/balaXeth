"use client";

import { motion } from "framer-motion";
import React from "react";

interface GlitchRevealProps {
  children: React.ReactNode;
}

export const GlitchReveal: React.FC<GlitchRevealProps> = ({ children }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }} // Triggers slightly before scrolling fully into view
      variants={{
        hidden: { 
          opacity: 0,
          y: 20,
          scale: 0.98,
        },
        visible: {
          // Stuttering values to simulate a digital glitch & snap
          opacity: [0, 1, 0.2, 1, 0.8, 1],
          y: [20, -10, 10, -5, 2, 0],
          x: [0, -15, 15, -8, 4, 0],
          scale: [0.98, 1.03, 0.97, 1.01, 1, 1],
          transition: {
            duration: 0.6,
            ease: "easeInOut",
            times: [0, 0.15, 0.3, 0.45, 0.7, 1]
          }
        }
      }}
      className="w-full relative"
    >
      {/* Optional: Add a brief cyan/magenta pseudo-element flash if you want true RGB split later, 
          but for now the harsh X/Y transform stutters handle the aggressive glitch feel perfectly. */}
      {children}
    </motion.div>
  );
};
