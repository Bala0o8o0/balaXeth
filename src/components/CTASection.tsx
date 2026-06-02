"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import {
  EffectComposer,
  Bloom,
  Glitch,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { GlitchMode, BlendFunction } from "postprocessing";
import { OrbitControls } from "@react-three/drei";

/* ── GSAP WebGL Morphing Matrix ───────────────────────────────────── */
function MorphingMatrix() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 4000;

  // Abstract targets to morph between: Sphere, Cube block, Torus
  const { positions, target1, target2, target3 } = useMemo(() => {
    const _positions = new Float32Array(count * 3);
    const _target1 = new Float32Array(count * 3); // Chaotic Sphere/Target
    const _target2 = new Float32Array(count * 3); // Cube
    const _target3 = new Float32Array(count * 3); // Math Knot

    for (let i = 0; i < count; i++) {
      // Initial chaotic start
      _positions[i * 3] = (Math.random() - 0.5) * 8;
      _positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      _positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      // Target 1: A noisy sphere
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 3 + Math.random() * 0.5; // little bit of cyber noise
      _target1[i * 3] = r * Math.cos(theta) * Math.sin(phi);
      _target1[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      _target1[i * 3 + 2] = r * Math.cos(phi);

      // Target 2: Dense sharp Cube grid
      const size = 5;
      _target2[i * 3] = (Math.random() - 0.5) * size;
      _target2[i * 3 + 1] = (Math.random() - 0.5) * size;
      _target2[i * 3 + 2] = (Math.random() - 0.5) * size;
      // Snap points to edges of cube
      const axis = Math.floor(Math.random() * 3);
      _target2[i * 3 + axis] = Math.sign(Math.random() - 0.5) * (size / 2);

      // Target 3: Abstract Torus Ring
      const p = 3,
        q = 4;
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const radius = 2.5;
      const tube = 1.0;
      const x = (radius + tube * Math.cos(v)) * Math.cos(p * u);
      const y = (radius + tube * Math.cos(v)) * Math.sin(p * u);
      const z = tube * Math.sin(v) + Math.sin(q * u) * 1.5;
      _target3[i * 3] = x;
      _target3[i * 3 + 1] = y;
      _target3[i * 3 + 2] = z;
    }

    return {
      positions: _positions,
      target1: _target1,
      target2: _target2,
      target3: _target3,
    };
  }, [count]);

  useEffect(() => {
    if (!pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    const positionAttr = geometry.attributes.position;
    const startPositions = new Float32Array(count * 3);
    const tempArray = new Float32Array(count * 3);
    const targets = [target1, target2, target3];
    let currentTarget = 0;

    const proxy = { progress: 0 };
    let activeTween: gsap.core.Tween | null = null;
    let timeout: NodeJS.Timeout | null = null;

    const morphToNext = () => {
      const nextTarget = (currentTarget + 1) % targets.length;
      const endPositions = targets[nextTarget];

      // Capture exact current positions before animating to avoid popping
      const currentPosArray = positionAttr.array as Float32Array;
      for (let i = 0; i < count * 3; i++) {
        startPositions[i] = currentPosArray[i];
      }

      proxy.progress = 0;
      activeTween = gsap.to(proxy, {
        progress: 1,
        duration: 2.5,
        ease: "expo.inOut",
        onUpdate: () => {
          for (let i = 0; i < count * 3; i++) {
            tempArray[i] = THREE.MathUtils.lerp(
              startPositions[i],
              endPositions[i],
              proxy.progress,
            );
          }
          positionAttr.array.set(tempArray);
          positionAttr.needsUpdate = true;
        },
        onComplete: () => {
          currentTarget = nextTarget;
          timeout = setTimeout(morphToNext, 2000); // 2 sec hold
        },
      });
    };

    timeout = setTimeout(morphToNext, 500);

    return () => {
      if (activeTween) activeTween.kill();
      if (timeout) clearTimeout(timeout);
    };
  }, [target1, target2, target3, count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.3;
      pointsRef.current.rotation.x += delta * 0.15;
      pointsRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      {/* Extremely bright red for aggressive Bloom effect */}
      <pointsMaterial
        size={0.06}
        color="#FF0000"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

const GsapWebGLCanvas = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center opacity-30 cursor-move mask-radial-fade">
      <div className="w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px]">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 55 }}
          gl={{ antialias: false, alpha: true }}
        >
          <OrbitControls enableZoom={false} enablePan={false} />
          <MorphingMatrix />

          {/* Intense Postprocessing Pipeline */}
          <EffectComposer>
            <Bloom
              intensity={2.5}
              luminanceThreshold={0.01}
              luminanceSmoothing={0.9}
              blendFunction={BlendFunction.SCREEN}
            />
            <ChromaticAberration offset={new THREE.Vector2(0.005, 0.005)} />
            <Glitch
              delay={new THREE.Vector2(2.5, 5.0)}
              duration={new THREE.Vector2(0.1, 0.3)}
              strength={new THREE.Vector2(0.2, 0.8)}
              mode={GlitchMode.SPORADIC}
              active
              ratio={0.8}
            />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
};

/* ── Horizontal Scanline ────────────────────────────────────────────── */
function HUDScanline() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{ y: ["-100%", "300%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-full h-[1px] bg-[#FF0000]/30 shadow-[0_0_15px_rgba(255,0,0,0.8),0_0_30px_rgba(255,0,0,0.5)]"
      />
      {/* Dark banding overlay */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #000, #000 2px, transparent 2px, transparent 4px)",
        }}
      />
    </div>
  );
}

/* ── CTA Section ────────────────────────────────────────────────────── */
export function CTASection() {
  return (
    <section className="relative w-full py-28 md:py-40 px-6 md:px-12 lg:px-20 bg-black overflow-hidden group">
      {/* Outer space bounds */}
      <div className="absolute inset-0 bg-black z-0" />

      {/* Glowing core behind DNA - REMOVED for clean black background */}

      {/* Moving scanline - Removed as requested */}

      {/* True WebGL Hologram CyberHUD Canvas */}
      <GsapWebGLCanvas />

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center pointer-events-none">
        {/* Cyberpunk Terminal Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center gap-4 mb-10 border border-[#FF0000]/30 bg-[#FF0000]/[0.02] px-6 py-2 backdrop-blur-sm pointer-events-auto"
          style={{
            clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
          }}
        >
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-[#FF0000] animate-[pulse_0.5s_infinite]" />
            <div className="w-1 h-3 bg-[#FF0000]/40" />
            <div className="w-1 h-3 bg-[#FF0000]/20" />
          </div>
          <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] font-bold">
            <span className="text-white">TERMINAL //</span>{" "}
            <span className="text-[#FF0000]">ACCESS_GRANTED</span>
          </span>
        </motion.div>

        {/* Big heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl min-[400px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.1] sm:leading-[0.9] text-center tracking-normal mb-6 sm:mb-8 pointer-events-auto px-2 sm:px-0"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          <span className="text-[#ffb3b3] relative inline-block mt-2 sm:mt-3 tracking-widest sm:tracking-[0.1em] md:tracking-[0.15em]">
            EXPLORE MY
          </span>
          <span className="text-[#FF0000] relative inline-block mt-2 sm:mt-3 tracking-widest sm:tracking-[0.1em] md:tracking-[0.15em]">
            Portfolio
          </span>
        </motion.h2>

        {/* Data readout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-mono text-[10px] sm:text-xs text-[#FF0000]/60 max-w-xl mx-auto mb-6 sm:mb-8 relative z-20 pointer-events-auto"
        >
          <p className="text-white/40 leading-relaxed font-sans text-sm sm:text-base tracking-wide text-center px-2">
            Dive into a curated archive of systems and applications — every node
            designed and deployed by me.
          </p>
        </motion.div>

        {/* Hacker Button - HUD Sci-Fi Style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="pointer-events-auto relative"
        >
          <div className="flex justify-center scale-[0.85] sm:scale-100">
            <button
              onClick={() => {
                const audio = new Audio(
                  "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
                );
                audio.volume = 0.4;
                audio.play().catch((e) => console.log("Audio play blocked", e));
                window.location.href = "/portfolio";
              }}
              className="group relative flex items-center justify-center w-[300px] h-[64px] transition-transform active:scale-95 outline-none"
            >
              <div className="absolute inset-0 pointer-events-none">
                {/* Fixed size SVG to guarantee perfect stroke alignment from the reference image */}
                <svg
                  width="300"
                  height="64"
                  viewBox="0 0 300 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="btn-fill"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#1a0000" />
                      <stop offset="50%" stopColor="#3a0000" />
                      <stop offset="100%" stopColor="#1a0000" />
                    </linearGradient>
                  </defs>

                  {/* Base Hexagon Background */}
                  <path
                    d="M26 6 L274 6 L294 32 L274 58 L26 58 L6 32 Z"
                    fill="url(#btn-fill)"
                    stroke="#FF0000"
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                    className="transition-colors duration-300 group-hover:fill-[#2a0000]"
                  />

                  {/* Outer Drop Shadow Group for Neon glow effects */}
                  <g className="drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(255,0,0,1)] transition-all duration-300">
                    {/* Top Glowing Rail */}
                    <path
                      d="M40 2 L260 2"
                      stroke="#FF0000"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="group-hover:stroke-[#FF0000] transition-colors duration-300"
                    />

                    {/* Bottom Glowing Rail */}
                    <path
                      d="M40 62 L260 62"
                      stroke="#FF0000"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="group-hover:stroke-[#FF0000] transition-colors duration-300"
                    />

                    {/* Left Arrow Bracket */}
                    <path
                      d="M18 11 L3 32 L18 53"
                      stroke="#FF0000"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover:stroke-[#FF0000] transition-colors duration-300"
                    />

                    {/* Right Arrow Bracket */}
                    <path
                      d="M282 11 L297 32 L282 53"
                      stroke="#FF0000"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover:stroke-[#FF0000] transition-colors duration-300"
                    />
                  </g>
                </svg>
              </div>

              {/* Text */}
              <span
                className="relative z-10 text-[#FF0000] text-[16px] font-bold tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(255,0,0,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(255,0,0,1)] transition-all duration-300 mt-[2px]"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                VIEW PROJECTS
              </span>
            </button>
          </div>

          {/* Access Text */}
          <div className="mt-8 text-[8px] tracking-[0.5em] text-[#FF0000]/40 uppercase text-center font-mono">
            // SECURE_LINK_FOUND.EXE //
          </div>
        </motion.div>

        {/* Terminal Footprint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.2 }}
          className="mt-20 border-t border-[#FF0000]/30 pt-4 flex gap-8 font-mono text-[8px] sm:text-[10px] text-[#FF0000]/40 tracking-widest uppercase justify-center w-full max-w-sm pointer-events-auto mx-auto text-center"
        >
          <div className="flex flex-col gap-1 items-center">
            <span>CONNECTION // SECURE</span>
            <span>LATENCY // 12ms</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span>NODE // ALPHA-7</span>
            <span>AUTH // GUEST_BYPASS</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
