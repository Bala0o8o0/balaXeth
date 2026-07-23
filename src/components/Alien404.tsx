"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { Settings, X } from "lucide-react"; // Using lucide-react for icons

// --- SHADERS FOR 3D DMT/DRAGON CYBER ENTITY ---
const vertexShader = `
uniform float uTime;
uniform vec2 uHandPos;
uniform float uPinchDist;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normal;
  
  vec3 pos = position;
  
  // Complex displacement to look like a breathing, morphing DMT entity (dragon-like scales/spikes)
  float noise = sin(pos.x * 5.0 + uTime * 2.0) * sin(pos.y * 5.0 + uTime * 1.5) * sin(pos.z * 5.0 - uTime * 1.0);
  
  // Hand interaction displacement
  vec3 hand3D = vec3(uHandPos.x * 5.0, uHandPos.y * 5.0, 0.0);
  float distToHand = distance(pos, hand3D);
  float reaction = exp(-distToHand * 0.5) * uPinchDist * 2.0; 
  
  pos += normal * (noise * 0.2 + reaction);
  pos.x += sin(uTime * 50.0 + pos.y * 10.0) * 0.05 * uPinchDist;

  vPosition = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform float uPinchDist;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // Red / Crimson Metallic styling
    vec3 baseColor = vec3(0.08, 0.0, 0.0);   // Very dark red/black metallic
    vec3 glowColor = vec3(1.0, 0.05, 0.05);  // Bright Red glow
    vec3 dangerColor = vec3(1.0, 0.8, 0.0);  // Orange/Yellow glitch

    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
    
    vec2 grid = fract(vUv * 40.0);
    float line = smoothstep(0.0, 0.1, grid.x) * smoothstep(0.0, 0.1, grid.y);
    line = 1.0 - line; 
    
    vec3 color = mix(baseColor, glowColor, line * 0.5 + fresnel * 0.8);
    
    float pulse = (sin(uTime * 3.0 - vPosition.y * 5.0) + 1.0) * 0.5;
    color += glowColor * pulse * 0.2;
    
    float glitchNoise = fract(sin(dot(vUv, vec2(12.9898, 78.233)) + uTime) * 43758.5453);
    color = mix(color, dangerColor * glitchNoise, uPinchDist * 0.8);

    gl_FragColor = vec4(color, 1.0);
}
`;

const DmtEntity = ({
  handPos,
  pinchDist,
}: {
  handPos: THREE.Vector2;
  pinchDist: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHandPos: { value: new THREE.Vector2(0, 0) },
      uPinchDist: { value: 0.0 },
    }),
    [],
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uHandPos.value.lerp(handPos, 0.1);
      material.uniforms.uPinchDist.value +=
        (pinchDist - material.uniforms.uPinchDist.value) * 0.2;

      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.002;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={1.5}>
      <torusKnotGeometry args={[1, 0.3, 200, 32, 3, 4]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={true}
      />
    </mesh>
  );
};

// --- AUDIO SYNTHESIS FOR LIQUID TRIPPY FOREST ---
class CyberSynth {
  ctx: AudioContext;
  masterGain: GainNode;

  // Drone
  droneOsc: OscillatorNode;
  droneGain: GainNode;

  // Liquid Trippy
  liquidOsc: OscillatorNode;
  liquidMod: OscillatorNode;
  liquidFilter: BiquadFilterNode;
  liquidGain: GainNode;

  // Effects
  delay1: DelayNode;
  delay2: DelayNode;
  feedback: GainNode;

  constructor() {
    this.ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();

    // Master
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.5;
    this.masterGain.connect(this.ctx.destination);

    // Delays for Trippy Forest Space
    this.delay1 = this.ctx.createDelay(2.0);
    this.delay1.delayTime.value = 0.4;
    this.delay2 = this.ctx.createDelay(2.0);
    this.delay2.delayTime.value = 0.6;

    this.feedback = this.ctx.createGain();
    this.feedback.gain.value = 0.5;

    this.delay1.connect(this.delay2);
    this.delay2.connect(this.feedback);
    this.feedback.connect(this.delay1);

    this.delay1.connect(this.masterGain);
    this.delay2.connect(this.masterGain);

    // Drone (Forest Floor)
    this.droneOsc = this.ctx.createOscillator();
    this.droneOsc.type = "sine";
    this.droneOsc.frequency.value = 50;
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.value = 0.6;
    this.droneOsc.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    // Liquid Trippy Layer
    this.liquidOsc = this.ctx.createOscillator();
    this.liquidOsc.type = "triangle";
    this.liquidOsc.frequency.value = 400;

    this.liquidMod = this.ctx.createOscillator();
    this.liquidMod.type = "sine";
    this.liquidMod.frequency.value = 5; // Slow LFO for liquid feel

    const modDepth = this.ctx.createGain();
    modDepth.gain.value = 100;
    this.liquidMod.connect(modDepth);
    modDepth.connect(this.liquidOsc.frequency);

    this.liquidFilter = this.ctx.createBiquadFilter();
    this.liquidFilter.type = "bandpass";
    this.liquidFilter.frequency.value = 1000;
    this.liquidFilter.Q.value = 5; // Resonant watery sound

    this.liquidGain = this.ctx.createGain();
    this.liquidGain.gain.value = 0.0;

    this.liquidOsc.connect(this.liquidFilter);
    this.liquidFilter.connect(this.liquidGain);
    this.liquidGain.connect(this.masterGain);
    this.liquidGain.connect(this.delay1); // Send to echo space

    this.droneOsc.start();
    this.liquidOsc.start();
    this.liquidMod.start();
  }

  update(
    handActive: boolean,
    pinchDist: number,
    x: number,
    y: number,
    time: number,
    isMuted: boolean,
  ) {
    if (this.ctx.state === "suspended") this.ctx.resume();
    if (isMuted) {
      this.masterGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.1);
      return;
    } else {
      this.masterGain.gain.setTargetAtTime(0.5, this.ctx.currentTime, 0.1);
    }

    if (handActive) {
      // Modulate drone subtly
      const targetDroneFreq = 40 + (1.0 - y) * 20;
      this.droneOsc.frequency.setTargetAtTime(
        targetDroneFreq,
        this.ctx.currentTime,
        0.5,
      );

      if (pinchDist > 0.05) {
        // Bring in the liquid trippy sound
        const liquidVol = Math.min(pinchDist * 2.0, 0.6);
        this.liquidGain.gain.setTargetAtTime(
          liquidVol,
          this.ctx.currentTime,
          0.1,
        );

        // Trippy frequency sweeps based on hand movement
        const baseFreq = 200 + x * 1000;
        this.liquidOsc.frequency.setTargetAtTime(
          baseFreq,
          this.ctx.currentTime,
          0.1,
        );

        // Modulator speeds up when pinched more
        const modFreq = 2 + pinchDist * 20;
        this.liquidMod.frequency.setTargetAtTime(
          modFreq,
          this.ctx.currentTime,
          0.1,
        );

        // Filter sweeps (Wah / Phaser effect)
        const filterFreq = 500 + y * 2000 + Math.sin(time * 5) * 500;
        this.liquidFilter.frequency.setTargetAtTime(
          filterFreq,
          this.ctx.currentTime,
          0.05,
        );
      } else {
        this.liquidGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.5);
      }
    } else {
      this.droneOsc.frequency.setTargetAtTime(50, this.ctx.currentTime, 1.0);
      this.liquidGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.5);
    }
  }

  stop() {
    this.droneOsc.stop();
    this.liquidOsc.stop();
    this.liquidMod.stop();
    this.ctx.close();
  }
}

// --- MAIN COMPONENT ---
export default function Alien404() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null);
  const [handPos, setHandPos] = useState(new THREE.Vector2(0, 0));
  const [pinchDist, setPinchDist] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const synthRef = useRef<CyberSynth | null>(null);

  useEffect(() => {
    let handLandmarker: HandLandmarker;
    let animationFrameId: number;
    let lastVideoTime = -1;
    let isComponentMounted = true;
    let time = 0;

    const initializeMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });

        if (!isComponentMounted) return;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (videoRef.current && isComponentMounted) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setHasCameraAccess(true);
        }
      } catch (err) {
        console.error("Camera access denied or MediaPipe failed to load", err);
        if (isComponentMounted) setHasCameraAccess(false);
      }
    };

    initializeMediaPipe();

    const handleInteraction = () => {
      if (!synthRef.current) {
        synthRef.current = new CyberSynth();
      }
    };
    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    const predictWebcam = () => {
      if (!isComponentMounted) return;
      time += 0.05;

      if (
        videoRef.current &&
        videoRef.current.currentTime !== lastVideoTime &&
        handLandmarker
      ) {
        lastVideoTime = videoRef.current.currentTime;
        const startTimeMs = performance.now();
        const results = handLandmarker.detectForVideo(
          videoRef.current,
          startTimeMs,
        );

        // Draw skeleton
        if (canvasRef.current && videoRef.current) {
          const canvasCtx = canvasRef.current.getContext("2d");
          if (canvasCtx) {
            // Match canvas dimensions to video
            if (canvasRef.current.width !== videoRef.current.videoWidth) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }

            canvasCtx.save();
            canvasCtx.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height,
            );

            if (results.landmarks && results.landmarks.length > 0) {
              const drawingUtils = new DrawingUtils(canvasCtx);
              for (const marks of results.landmarks) {
                drawingUtils.drawConnectors(
                  marks,
                  HandLandmarker.HAND_CONNECTIONS,
                  {
                    color: "#ffd400",
                    lineWidth: 5,
                  },
                );
                drawingUtils.drawLandmarks(marks, {
                  color: "#ffd400",
                  lineWidth: 2,
                  radius: 3,
                });
              }
            }
            canvasCtx.restore();
          }
        }

        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];

          const indexTip = landmarks[8];
          const thumbTip = landmarks[4];

          const nx = -(indexTip.x * 2.0) + 1.0;
          const ny = -(indexTip.y * 2.0) + 1.0;
          setHandPos(new THREE.Vector2(nx, ny));

          const dx = indexTip.x - thumbTip.x;
          const dy = indexTip.y - thumbTip.y;
          const dz = indexTip.z - thumbTip.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          const pinchEffect = Math.max(0, 1.0 - dist * 10.0);
          setPinchDist(pinchEffect);

          if (synthRef.current) {
            // Need to pass a stable ref to isMuted or handle it inside synth update better
            synthRef.current.update(
              true,
              pinchEffect,
              indexTip.x,
              indexTip.y,
              time,
              false,
            ); // Will handle mute via effect below
          }
        } else {
          setPinchDist(0);
          if (synthRef.current) {
            synthRef.current.update(false, 0, 0, 0, time, false);
          }
        }
      }
      animationFrameId = requestAnimationFrame(predictWebcam);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", predictWebcam);
    }

    return () => {
      isComponentMounted = false;
      cancelAnimationFrame(animationFrameId);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      if (synthRef.current) {
        synthRef.current.stop();
      }
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  // Handle Mute State
  useEffect(() => {
    if (synthRef.current) {
      if (isMuted) {
        synthRef.current.masterGain.gain.setTargetAtTime(
          0.0,
          synthRef.current.ctx.currentTime,
          0.1,
        );
      } else {
        // Restore base volume, the update loop will take over
        synthRef.current.masterGain.gain.setTargetAtTime(
          0.2,
          synthRef.current.ctx.currentTime,
          0.1,
        );
      }
    }
  }, [isMuted]);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050000] overflow-hidden text-white font-mono">
      {/* HUD: Return to Base */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-50 p-2 bg-red-900/50 border border-red-500 rounded text-red-500 hover:bg-red-800/80 transition-colors shadow-[0_0_15px_rgba(255, 212, 0,0.5)] flex items-center justify-center"
        onClick={() => {
          if (synthRef.current) synthRef.current.stop();
        }}
      >
        <X size={24} />
      </Link>

      {/* HUD: Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-4 right-4 z-50 p-2 bg-red-900/50 border border-red-500 rounded text-red-500 hover:bg-red-800/80 transition-colors shadow-[0_0_15px_rgba(255, 212, 0,0.5)]"
      >
        <Settings size={24} />
      </button>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#110000] p-8 rounded border-2 border-red-500 text-red-500 max-w-md w-full shadow-[0_0_30px_rgba(255, 212, 0,0.5)] relative">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-300"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold tracking-widest mb-6">
              PAGE NOT FOUND
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-red-900 pb-4">
                <span className="tracking-widest text-sm">AUDIO CORTEX</span>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-4 py-1 border ${isMuted ? "border-red-900 text-red-900" : "border-red-500 text-red-500 shadow-[0_0_10px_rgba(255, 212, 0,0.3)]"}`}
                >
                  {isMuted ? "MUTED" : "ACTIVE"}
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-red-900 pb-4">
                <span className="tracking-widest text-sm">
                  GESTURE SENSITIVITY
                </span>
                <span className="text-red-900">AUTO-CALIBRATED</span>
              </div>

              <div className="pt-4 text-xs text-red-900 text-center tracking-[0.2em]">
                WARNING: ENTITY IS UNSTABLE
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Warning */}
      {!hasCameraAccess && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-black/90 p-8 rounded border border-red-500 text-center max-w-md shadow-[0_0_30px_rgba(255, 212, 0,0.4)]">
            <h2 className="text-2xl text-red-500 mb-2 font-bold tracking-widest animate-pulse">
              ENTITY DORMANT
            </h2>
            <p className="text-sm text-red-300 opacity-80 mb-4">
              Grant (Camera) access and click to awaken.
            </p>
          </div>
        </div>
      )}

      {/* Cyberpunk HUD overlay text */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-8">
        {/* <div className="text-red-500/40 text-xs tracking-[0.3em] mt-12">404 // PAGE NOT FOUND</div> */}
        <div className="text-red-500/40 text-xs tracking-[0.3em] self-end mb-[150px]">
          RESONANCE: {Math.floor(pinchDist * 100)}%
        </div>
      </div>

      {/* Camera Popup at the bottom right */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col items-end">
        <div className="text-red-500/70 text-[10px] tracking-[0.2em] mb-1">
          VISUAL FEED // LOCAL
        </div>
        <div className="w-48 h-36 border-2 border-red-500 rounded overflow-hidden shadow-[0_0_20px_rgba(255, 212, 0,0.3)] bg-black relative">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" // mirror video horizontally for natural mirror effect
            playsInline
            muted
          />
          {/* Canvas for Hand Skeleton Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" // mirror to match video
          />
          {/* Scanline overlay for camera */}
          <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LCAwLCAwLCAwLjIpIi8+PC9zdmc+')] opacity-50" />
        </div>
      </div>

      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={60} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />

        {/* Environment lighting for metallic reflection */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#ffd400" />
        <directionalLight
          position={[-5, -5, -5]}
          intensity={1}
          color="#ff8800"
        />

        <DmtEntity handPos={handPos} pinchDist={pinchDist} />
      </Canvas>
    </div>
  );
}
