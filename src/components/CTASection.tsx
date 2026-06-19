// "use client";

import { useRef, useMemo, useEffect, useState } from "react";
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

// ── OLD CTA Section (Commented out as requested - renamed to avoid collision) ───────────────────
export function CTASectionOld() {
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
          className="inline-flex items-center justify-center gap-4 mb-10 border border-[#FF0000]/30 bg-[#FF0000]/[0.02] px-4 py-1 backdrop-blur-sm pointer-events-auto"
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
// End of OLD CTA Section

// ============================================================================
// ── OLD CTA Section Landscape ───────────────────
// ============================================================================
export function CTASectionLandscape() {
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(
      new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    );
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-24 px-4 md:px-12 bg-[#050505] flex justify-center items-center font-mono overflow-hidden">
      {/* Landscape HUD Frame */}
      <div className="relative w-full max-w-[1200px] min-h-[500px] md:min-h-[550px] bg-[#0d0000] border-2 border-[#FF0000] shadow-[0_0_50px_rgba(255,0,0,0.2),inset_0_0_30px_rgba(255,0,0,0.2)] overflow-hidden flex flex-col md:flex-row group">
        {/* HUD Grid Background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#FF0000 1px, transparent 1px), linear-gradient(90deg, #FF0000 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.05] mix-blend-overlay bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#FF0000_2px,#FF0000_4px)]"></div>

        {/* 3D Hologram Area (Right Side on Desktop, Top on Mobile) */}
        <div className="absolute top-0 right-0 w-full md:w-[65%] h-[350px] md:h-full pointer-events-none opacity-100 mix-blend-screen overflow-hidden flex items-center justify-center">
          {/* Vignette to fade out edges into the red background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0d0000_60%)] z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] scale-125 md:scale-100 opacity-80">
            <GsapWebGLCanvas />
          </div>
        </div>

        {/* Content Overlay (Left Side) */}
        <div className="relative z-20 w-full md:w-[50%] h-full flex flex-col justify-between p-6 md:p-14 pt-[300px] md:pt-14 bg-gradient-to-t md:bg-gradient-to-r from-[#0d0000] via-[#0d0000]/90 to-transparent">
          {/* Top HUD Info */}
          <div className="flex justify-between text-[#FF0000] text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-8">
            <div className="flex flex-col gap-1">
              <span className="text-white font-bold bg-[#FF0000] px-2 py-0.5 text-black inline-block w-max">
                SYS_STATUS: ONLINE
              </span>
              <span>{time || "00:00:00"}</span>
              <span>TGT_LOCK: ACTIVE</span>
            </div>
            <div className="flex flex-col gap-1 text-right md:hidden lg:flex">
              <span>SECTOR // 7G</span>
              <span className="text-white font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
                ACCESS: GRANTED
              </span>
            </div>
          </div>

          {/* Title Section */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[2px] bg-white"></div>
              <span className="text-white text-xs tracking-[0.4em] font-bold">
                DATABASE ACCESS
              </span>
            </div>
            <h2
              className="text-[#FF0000] font-bold text-6xl sm:text-7xl md:text-8xl lg:text-[100px] tracking-tighter leading-[0.8] mb-6 drop-shadow-[0_0_20px_rgba(255,0,0,0.6)]"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              PORT
              <br />
              FOLIO
            </h2>
            <p className="text-[#ff6666] text-xs sm:text-sm tracking-widest max-w-md uppercase leading-relaxed font-medium">
              Explore the complete archive of systems, dapps, and architectures.
              High-level clearance required.
            </p>
          </div>

          {/* Action Area */}
          <div className="mt-auto relative w-max">
            <button
              onClick={() => (window.location.href = "/portfolio")}
              className="group relative flex items-center justify-between gap-8 px-8 py-5 bg-[#1a0000] border-2 border-[#FF0000] hover:border-white transition-all duration-300 overflow-hidden z-50 pointer-events-auto cursor-pointer shadow-[0_0_15px_rgba(255,0,0,0.5)]"
            >
              <div className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-in-out group-hover:w-full z-0"></div>
              <span className="relative z-10 text-[#FF0000] group-hover:text-black font-bold text-sm sm:text-base tracking-[0.3em] font-mono whitespace-nowrap">
                INITIATE_VIEW
              </span>
              <span className="relative z-10 text-white group-hover:text-[#FF0000] font-bold text-xl">
                &#8594;
              </span>
            </button>

            {/* Decorative target box around button */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-white pointer-events-none transition-all duration-300 group-hover:border-[#FF0000]"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-white pointer-events-none transition-all duration-300 group-hover:border-[#FF0000]"></div>
          </div>
        </div>

        {/* HUD Decorative Elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white m-4 pointer-events-none opacity-80"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#FF0000] m-4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#FF0000] m-4 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white m-4 pointer-events-none opacity-80"></div>

        {/* Vertical Data Bar Right */}
        <div className="hidden md:flex absolute top-20 right-6 bottom-20 w-16 flex-col justify-between items-center opacity-80 z-20">
          <div className="text-white text-[10px] tracking-[0.3em] font-bold rotate-90 whitespace-nowrap origin-center mt-12">
            COORD_DATA
          </div>
          <div className="w-full h-1/2 flex flex-col gap-1.5 mt-auto mb-12 justify-center items-end">
            <div className="w-[80%] h-[2px] bg-[#FF0000]"></div>
            <div className="w-[100%] h-[3px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
            <div className="w-[60%] h-[5px] bg-[#FF0000]"></div>
            <div className="w-[40%] h-[2px] bg-[#FF0000]"></div>
            <div className="w-[90%] h-[12px] bg-[#FF0000]"></div>
            <div className="w-[70%] h-[3px] bg-white"></div>
            <div className="w-[100%] h-[16px] bg-[#FF0000]"></div>
            <div className="w-[50%] h-[2px] bg-white"></div>
          </div>
          <div className="text-white text-[12px] font-bold bg-[#FF0000] px-2 py-1 text-black">
            100%
          </div>
        </div>

        {/* Bottom Bar Info */}
        <div className="absolute bottom-0 left-8 right-8 h-8 border-t-2 border-[#FF0000] flex items-center justify-between text-[#FF0000] text-[8px] sm:text-[10px] tracking-[0.2em] px-4 bg-[#1a0000]/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 font-bold">
              <div className="w-2 h-2 bg-white animate-pulse shadow-[0_0_5px_rgba(255,255,255,1)]"></div>{" "}
              UPLINK STABLE
            </span>
            <span className="hidden sm:inline text-[#FF0000]/50">|</span>
            <span className="hidden sm:inline font-bold">
              DATA_STREAM: ENCRYPTED
            </span>
            <span className="hidden lg:inline text-[#FF0000]/50">|</span>
            <span className="hidden lg:inline text-white">PROXY_NODE_0X8F</span>
          </div>
          <div className="text-white font-bold tracking-[0.4em]">
            SYS_V2.4_ACTV
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ── OLD CTA Section Chip ───────────────────
// ============================================================================
export function CTASectionChip() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      window.location.href = "/portfolio";
    }, 1500);
  };

  return (
    <section className="relative w-full py-24 px-4 md:px-12 bg-[#050505] flex justify-center items-center font-mono overflow-hidden min-h-[800px]">
      {/* Circuit Board Background Grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#110000 2px, transparent 2px), linear-gradient(90deg, #110000 2px, transparent 2px)",
          backgroundSize: "100px 100px",
        }}
      ></div>

      {/* Hologram integrated into the circuit board */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen flex items-center justify-center">
        <div className="w-[800px] h-[800px] scale-150">
          <GsapWebGLCanvas />
        </div>
      </div>

      {/* Circuit Traces SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="neonRed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff0000" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff4444" stopOpacity="1" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base Traces (Dark Red) */}
        {/* Left Side */}
        <path
          d="M 0 20% L 20% 20% L 30% 35% L 50% 35%"
          stroke="#330000"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M 0 50% L 25% 50% L 30% 60% L 50% 60%"
          stroke="#330000"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M 0 80% L 20% 80% L 30% 70% L 50% 70%"
          stroke="#330000"
          strokeWidth="4"
          fill="none"
        />

        {/* Right Side */}
        <path
          d="M 100% 15% L 80% 15% L 70% 30% L 50% 30%"
          stroke="#330000"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M 100% 45% L 75% 45% L 65% 55% L 50% 55%"
          stroke="#330000"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M 100% 85% L 80% 85% L 70% 65% L 50% 65%"
          stroke="#330000"
          strokeWidth="4"
          fill="none"
        />

        {/* Animated Traces (Bright Neon Red) */}
        {/* When isConnecting is true, we transition stroke-dashoffset to 0 */}
        {/* To make it responsive, we use relative coordinates inside SVG where possible, but since paths are complex, we'll use CSS scale tricks or absolute paths. For simplicity, we animate simple paths that overlay the base paths. */}
        <path
          d="M 0 20% L 20% 20% L 30% 35% L 50% 35%"
          stroke="url(#neonRed)"
          strokeWidth="8"
          fill="none"
          filter="url(#glow)"
          strokeDasharray="2000"
          strokeDashoffset={isConnecting ? "0" : "2000"}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 0 80% L 20% 80% L 30% 70% L 50% 70%"
          stroke="url(#neonRed)"
          strokeWidth="8"
          fill="none"
          filter="url(#glow)"
          strokeDasharray="2000"
          strokeDashoffset={isConnecting ? "0" : "2000"}
          style={{ transition: "stroke-dashoffset 1.5s ease-out 0.2s" }}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 100% 15% L 80% 15% L 70% 30% L 50% 30%"
          stroke="url(#neonRed)"
          strokeWidth="8"
          fill="none"
          filter="url(#glow)"
          strokeDasharray="2000"
          strokeDashoffset={isConnecting ? "0" : "2000"}
          style={{ transition: "stroke-dashoffset 1.5s ease-out 0.1s" }}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 100% 85% L 80% 85% L 70% 65% L 50% 65%"
          stroke="url(#neonRed)"
          strokeWidth="8"
          fill="none"
          filter="url(#glow)"
          strokeDasharray="2000"
          strokeDashoffset={isConnecting ? "0" : "2000"}
          style={{ transition: "stroke-dashoffset 1.5s ease-out 0.3s" }}
          vectorEffect="non-scaling-stroke"
        />

        {/* Center connection blast (triggers at end of animation) */}
        <circle
          cx="50%"
          cy="50%"
          r={isConnecting ? "600" : "0"}
          fill="none"
          stroke="#FF0000"
          strokeWidth={isConnecting ? "0" : "20"}
          style={{
            transition: "all 1s ease-out 0.5s",
            opacity: isConnecting ? 0 : 1,
          }}
          filter="url(#glow)"
        />
      </svg>

      {/* Central CPU Microchip */}
      <div
        className={`relative z-20 w-full max-w-[500px] bg-[#0a0000] border-4 ${isConnecting ? "border-[#FF0000] shadow-[0_0_80px_rgba(255,0,0,0.9)] scale-105" : "border-[#440000] shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:border-[#880000]"} transition-all duration-700 flex flex-col items-center p-8 md:p-12 backdrop-blur-md`}
      >
        {/* Chip Pins (Top & Bottom) */}
        <div className="absolute -top-4 left-4 right-4 flex justify-between px-4 z-[-1]">
          {[...Array(8)].map((_, i) => (
            <div
              key={`top-${i}`}
              className={`w-4 h-6 ${isConnecting ? "bg-[#FF0000] shadow-[0_0_15px_#FF0000]" : "bg-[#440000]"} rounded-t-sm transition-colors duration-300 delay-${i * 100}`}
            ></div>
          ))}
        </div>
        <div className="absolute -bottom-4 left-4 right-4 flex justify-between px-4 z-[-1]">
          {[...Array(8)].map((_, i) => (
            <div
              key={`bot-${i}`}
              className={`w-4 h-6 ${isConnecting ? "bg-[#FF0000] shadow-[0_0_15px_#FF0000]" : "bg-[#440000]"} rounded-b-sm transition-colors duration-300 delay-${i * 100}`}
            ></div>
          ))}
        </div>
        {/* Chip Pins (Left & Right) */}
        <div className="absolute top-4 bottom-4 -left-4 flex flex-col justify-between py-4 z-[-1]">
          {[...Array(6)].map((_, i) => (
            <div
              key={`left-${i}`}
              className={`h-4 w-6 ${isConnecting ? "bg-[#FF0000] shadow-[0_0_15px_#FF0000]" : "bg-[#440000]"} rounded-l-sm transition-colors duration-300 delay-${i * 100}`}
            ></div>
          ))}
        </div>
        <div className="absolute top-4 bottom-4 -right-4 flex flex-col justify-between py-4 z-[-1]">
          {[...Array(6)].map((_, i) => (
            <div
              key={`right-${i}`}
              className={`h-4 w-6 ${isConnecting ? "bg-[#FF0000] shadow-[0_0_15px_#FF0000]" : "bg-[#440000]"} rounded-r-sm transition-colors duration-300 delay-${i * 100}`}
            ></div>
          ))}
        </div>

        {/* Inner Chip Content */}
        <div className="w-full text-center mb-8 border-b-2 border-[#FF0000]/30 pb-6 relative">
          {/* Spinning core element */}
          <div className="absolute top-0 right-0 w-8 h-8">
            <div
              className={`w-full h-full border-2 border-[#FF0000] border-t-transparent rounded-full ${isConnecting ? "animate-spin" : ""}`}
              style={{ animationDuration: "0.2s" }}
            ></div>
            <div
              className={`absolute inset-[6px] ${isConnecting ? "bg-[#FF0000] shadow-[0_0_15px_#FF0000]" : "bg-[#440000]"} rounded-full transition-colors duration-500`}
            ></div>
          </div>

          <h2
            className={`text-[#FF0000] font-bold text-4xl sm:text-5xl tracking-tighter leading-none mb-2 transition-all duration-500 ${isConnecting ? "drop-shadow-[0_0_20px_rgba(255,0,0,1)] text-white" : "drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]"}`}
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            BALA_SYS
          </h2>
          <div className="text-white text-xs tracking-[0.4em] font-bold uppercase">
            Micro_Architecture
          </div>
        </div>

        {/* Stats / Info */}
        <div className="w-full grid grid-cols-2 gap-4 mb-10 text-left">
          <div className="bg-[#1a0000] p-3 border border-[#330000] relative overflow-hidden">
            <div
              className={`absolute inset-0 bg-[#FF0000]/20 transition-transform duration-500 ${isConnecting ? "translate-x-0" : "-translate-x-full"}`}
            ></div>
            <div className="text-[#FF0000] text-[8px] tracking-[0.2em] mb-1 relative z-10">
              STATUS
            </div>
            <div
              className={`text-xs font-bold relative z-10 transition-colors duration-300 ${isConnecting ? "text-white drop-shadow-[0_0_5px_#fff] animate-pulse" : "text-[#888]"}`}
            >
              {isConnecting ? "ROUTING_DATA..." : "STANDBY"}
            </div>
          </div>
          <div className="bg-[#1a0000] p-3 border border-[#330000] relative overflow-hidden">
            <div
              className={`absolute inset-0 bg-[#FF0000]/20 transition-transform duration-500 delay-100 ${isConnecting ? "translate-x-0" : "-translate-x-full"}`}
            ></div>
            <div className="text-[#FF0000] text-[8px] tracking-[0.2em] mb-1 relative z-10">
              NODE
            </div>
            <div
              className={`text-xs font-bold relative z-10 ${isConnecting ? "text-white" : "text-[#888]"}`}
            >
              ALPHA_7X
            </div>
          </div>
          <div className="bg-[#1a0000] p-3 border border-[#330000] relative overflow-hidden">
            <div
              className={`absolute inset-0 bg-[#FF0000]/20 transition-transform duration-500 delay-200 ${isConnecting ? "translate-x-0" : "-translate-x-full"}`}
            ></div>
            <div className="text-[#FF0000] text-[8px] tracking-[0.2em] mb-1 relative z-10">
              SEC_LEVEL
            </div>
            <div
              className={`text-xs font-bold relative z-10 ${isConnecting ? "text-white" : "text-[#888]"}`}
            >
              OMEGA
            </div>
          </div>
          <div className="bg-[#1a0000] p-3 border border-[#330000] relative overflow-hidden">
            <div
              className={`absolute inset-0 bg-[#FF0000]/20 transition-transform duration-500 delay-300 ${isConnecting ? "translate-x-0" : "-translate-x-full"}`}
            ></div>
            <div className="text-[#FF0000] text-[8px] tracking-[0.2em] mb-1 relative z-10">
              UPLINK
            </div>
            <div
              className={`text-xs font-bold relative z-10 ${isConnecting ? "text-white" : "text-[#888]"}`}
            >
              ENCRYPTED
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className={`group relative w-full py-5 bg-transparent border-2 ${isConnecting ? "border-white bg-[#FF0000] shadow-[0_0_40px_rgba(255,0,0,1)]" : "border-[#FF0000] hover:bg-[#FF0000]/20 hover:shadow-[0_0_25px_rgba(255,0,0,0.8)] hover:scale-[1.02]"} transition-all duration-300 overflow-hidden cursor-pointer disabled:cursor-not-allowed`}
        >
          {/* Scanline hover effect */}
          <div className="absolute inset-0 w-full h-full bg-[linear-gradient(transparent_50%,rgba(255,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 pointer-events-none"></div>

          {/* Button Text */}
          <div className="relative z-10 flex items-center justify-center gap-4">
            <div
              className={`w-2 h-2 ${isConnecting ? "bg-white shadow-[0_0_15px_#fff] animate-ping" : "bg-[#FF0000]"} rounded-full transition-colors duration-300`}
            ></div>
            <span
              className={`font-bold text-sm md:text-base tracking-[0.3em] font-mono transition-colors duration-300 ${isConnecting ? "text-white drop-shadow-[0_0_8px_#fff]" : "text-[#FF0000] group-hover:text-white"}`}
            >
              {isConnecting ? "ESTABLISHING_LINK..." : "ACCESS_PORTFOLIO"}
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}

// ============================================================================
// NEW DESIGN COMPONENT (GEOMETRIC SCI-FI HUD)
// ============================================================================
export function CTASection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      window.location.href = "/portfolio";
    }, 1500);
  };

  // Translate X tightened to 130 to frame the button more closely without being too tight
  const Quadrant = ({ transform }: { transform: string }) => (
    <g transform={transform}>
      {/* Cyber-Clamp Accent on the main arm (Replacing the old L brackets) */}
      <g className="transition-all duration-300 opacity-70 group-hover:opacity-100">
        {/* Clamp rails perfectly hugging the main arm (Y=40) */}
        <path
          d="M 20 38 L 40 38"
          stroke="#FF0000"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 20 42 L 40 42"
          stroke="#FF0000"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Vertical mechanical grill lines */}
        <path
          d="M 24 35 L 24 45 M 28 35 L 28 45 M 32 35 L 32 45 M 36 35 L 36 45"
          stroke="#FF0000"
          strokeWidth="0.5"
          fill="none"
          opacity="0.6"
        />

        {/* Angled data line branching upwards from the clamp */}
        <path
          d="M 40 38 L 48 30 L 65 30"
          stroke="#FF0000"
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        <circle
          cx="65"
          cy="30"
          r="1.5"
          fill="#FF0000"
          className="animate-pulse shadow-[0_0_5px_#FF0000]"
        />

        {/* Tiny tech nodes resting on the branch */}
        <rect x="48" y="26" width="4" height="2" fill="#FF0000" opacity="0.7" />
        <rect x="54" y="26" width="2" height="2" fill="#FF0000" opacity="0.7" />
      </g>
      {/* Diagonal Main Arm - HORIZONTAL ENTRY TO CIRCLE CORE */}
      <path
        d="M -90 0 L -60 0 L -20 40 L 80 40 L 100 40 L 150 90 L 450 390 L 480 390"
        stroke="#FF0000"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />

      {/* Node Connector */}
      <circle
        cx="-90"
        cy="0"
        r="4"
        fill="#FF0000"
        className="animate-pulse shadow-[0_0_10px_#FF0000]"
      />
      <circle
        cx="-90"
        cy="0"
        r="8"
        stroke="#FF0000"
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />
      <rect
        x="-93"
        y="-3"
        width="6"
        height="6"
        fill="none"
        stroke="#FF0000"
        strokeWidth="1"
        opacity="0.5"
        transform="rotate(45 -90 0)"
      />

      {/* Diagonal Secondary Arm */}
      <path
        d="M 70 60 L 90 60 L 140 110 L 380 350"
        stroke="#FF0000"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 90 80 L 110 80 L 160 130 L 360 330"
        stroke="#FF0000"
        strokeWidth="1"
        strokeDasharray="5 5"
        fill="none"
        opacity="0.5"
      />

      {/* Inner Tech Details */}
      <path
        d="M 90 20 L 120 20 L 160 60"
        stroke="#FF0000"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 180 40 L 250 40"
        stroke="#FF0000"
        strokeWidth="2"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M 180 55 L 230 55"
        stroke="#FF0000"
        strokeWidth="1"
        strokeDasharray="4 4"
        fill="none"
        opacity="0.7"
      />

      {/* Vertical Block Accents */}
      <path
        d="M -10 90 L -10 250"
        stroke="#FF0000"
        strokeWidth="1.5"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M 10 110 L 10 210"
        stroke="#FF0000"
        strokeWidth="1"
        strokeDasharray="4 4"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M 25 120 L 25 150"
        stroke="#FF0000"
        strokeWidth="3"
        fill="none"
        opacity="0.5"
      />
      <circle cx="-10" cy="70" r="3" fill="#FF0000" />
      <circle cx="-10" cy="270" r="3" fill="#FF0000" />

      {/* Outer framing corners */}
      <path
        d="M 480 360 L 480 390 L 450 390"
        stroke="#FF0000"
        strokeWidth="3"
        fill="none"
        opacity="0.7"
      />

      {/* Dot Grid Accents */}
      <g fill="#FF0000" opacity="0.4">
        <circle cx="200" cy="150" r="1.5" />
        <circle cx="215" cy="150" r="1.5" />
        <circle cx="230" cy="150" r="1.5" />
        <circle cx="245" cy="150" r="1.5" />

        <circle cx="200" cy="165" r="1.5" />
        <circle cx="215" cy="165" r="1.5" />
        <circle cx="230" cy="165" r="1.5" />
        <circle cx="245" cy="165" r="1.5" />
      </g>

      {/* Animated Flowing Line - FLOWS HORIZONTALLY INTO CIRCLE CORE */}
      <path
        d="M 480 390 L 450 390 L 150 90 L 100 40 L 80 40 L -20 40 L -60 0 L -90 0"
        stroke="#FF0000"
        fill="none"
        className={`flowing-line ${isConnecting ? "electric-surge" : ""} ${isHovered ? "speed-surge" : ""}`}
      />
    </g>
  );

  return (
    <section className="w-full py-16 md:py-24 px-4 bg-transparent flex flex-col justify-center items-center">
      {/* Section Title */}
      <div className="mt-16 md:mt-24 mb-4 md:mb-6 flex flex-col items-center justify-center w-full z-50 px-4">
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 w-full">
          <div className="w-8 md:w-16 h-[1px] bg-[#FF0000] shrink-0" />
          <span className="text-[#FF0000] font-mono text-[10px] md:text-sm tracking-[0.15em] md:tracking-[0.4em] font-bold uppercase drop-shadow-[0_0_8px_rgba(255,0,0,0.6)] text-center">
            B4L4
          </span>
          <div className="w-8 md:w-16 h-[1px] bg-[#FF0000] shrink-0" />
        </div>
        <h2
          className="text-white text-3xl sm:text-4xl md:text-7xl font-black uppercase tracking-wide text-center drop-shadow-[0_0_15px_rgba(255,0,0,0.3)]"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          PORT<span className="text-[#FF0000]">FOLIO</span>
        </h2>
      </div>

      {/* Hacker HUD Outer Container */}
      <div className="relative w-full max-w-[1200px] min-h-[700px] md:min-h-[850px] bg-[#020000] flex justify-center items-center font-mono overflow-hidden group">
        <style>{`
             .flowing-line {
               stroke-dasharray: 80 1000;
               stroke-dashoffset: 1080;
               stroke-width: 1.5;
               animation: flowAnim 3s linear infinite;
               /* Reverted to old normal brightness */
               
             }
             .speed-surge {
               animation: flowAnim 1.5s linear infinite !important;
               stroke-dasharray: 100 600;
               stroke-width: 2;
               stroke: #FF0000;
               filter: drop-shadow(0 0 2px #FF0000);
             }
             @keyframes flowAnim {
               to { stroke-dashoffset: 0; }
             }

             /* Electric Surge Animation on Click (SUPER BRIGHT PURE RED remains) */
             .electric-surge {
               stroke: #FF0000 !important;
               stroke-width: 4 !important;
               stroke-dasharray: 400 400 !important;
               
               animation: surgeShoot 0.8s ease-out forwards, flicker 0.1s infinite alternate !important;
             }
             @keyframes surgeShoot {
               0% { stroke-dashoffset: 1000; }
               100% { stroke-dashoffset: 0; }
             }
             @keyframes flicker {
               0% { opacity: 0.7; stroke-width: 2; }
               100% { opacity: 1; stroke-width: 5; }
             }

             .hud-pulse {
               animation: slowPulse 4s ease-in-out infinite;
             }
             @keyframes slowPulse {
               /* Reverted to old normal brightness */
               0%, 100% { opacity: 0.9;  }
               50% { opacity: 1;  }
             }

             .bg-microgrid {
               background-image: radial-gradient(rgba(255, 0, 0, 0.2) 1px, transparent 1px);
               background-size: 30px 30px;
             }
           `}</style>

        {/* Very Subtle Microgrid Background (like the reference image) */}
        <div className="absolute inset-0 bg-microgrid pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020000_70%)] pointer-events-none"></div>

        {/* Full Geometric SVG HUD */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none p-4 md:p-8">
          {/* Keep viewBox large to handle translation */}
          <svg
            viewBox="-700 -450 1400 900"
            className="w-full h-full max-w-[1200px] hud-pulse"
          >
            <defs>
              <filter id="hudGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g filter="url(#hudGlow)">
              {/* Tightened translate to 130 for a better UI proportion (not too wide) */}
              <Quadrant transform="scale(1, 1) translate(130, 0)" />
              <Quadrant transform="scale(-1, 1) translate(130, 0)" />
              <Quadrant transform="scale(1, -1) translate(130, 0)" />
              <Quadrant transform="scale(-1, -1) translate(130, 0)" />

              {/* Central Wide Rectangle Framing - adjusted width to match translate(130) */}
              <path
                d="M -150 -70 L 150 -70"
                stroke="#FF0000"
                strokeWidth="1"
                opacity="0.4"
                fill="none"
              />
              <path
                d="M -150 70 L 150 70"
                stroke="#FF0000"
                strokeWidth="1"
                opacity="0.4"
                fill="none"
              />
              <path
                d="M -80 -85 L 80 -85"
                stroke="#FF0000"
                strokeWidth="3"
                fill="none"
                opacity="0.8"
              />
              <path
                d="M -80 85 L 80 85"
                stroke="#FF0000"
                strokeWidth="3"
                fill="none"
                opacity="0.8"
              />

              {/* Central Crosshairs (Removed as requested) */}
            </g>
          </svg>
        </div>

        {/* Interactive Center Button perfectly aligned within the SVG brackets */}
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <button
            onClick={handleConnect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isConnecting}
            className={`group relative flex flex-col items-center justify-center transition-all duration-300 cursor-pointer disabled:cursor-not-allowed ${isConnecting ? "scale-110" : "hover:scale-105"}`}
          >
            {/* Cyberpunk Core (Matches X Design) */}
            <div className="relative w-[180px] h-[180px] flex items-center justify-center">
              {/* Dragon Logo */}
              <img
                src="/dragon.svg"
                className={`relative z-10 w-[62px] h-[62px] object-contain filter drop-shadow(0 0 4px #FF0000) transition-all duration-300 ${isConnecting ? "opacity-100 brightness-150 scale-110 drop-shadow(0 0 20px #FF0000)" : "opacity-70 brightness-100 group-hover:opacity-100 group-hover:brightness-125 group-hover:scale-105 group-hover:drop-shadow(0 0 12px #FF0000)"}`}
                alt="Dragon Core"
              />

              {/* Invisible hit area for button to ensure it's easily clickable */}
              <div className="absolute inset-0 rounded-full bg-transparent" />
            </div>

            {/* High-Tech Circular Flash Overlay */}
            {isConnecting && (
              <>
                <div className="absolute inset-0 bg-[#FF0000]/20 animate-ping rounded-full pointer-events-none shadow-[0_0_30px_#FF0000]"></div>
                <div
                  className="absolute inset-4 border border-[#FF0000]/60 animate-ping rounded-full pointer-events-none"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
