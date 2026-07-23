"use client";

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────
//  ZOOM CONFIGURATION
// ─────────────────────────────────────────────────────────────────
const DRAGON_X = 0.5; // Centered horizontally
const DRAGON_Y = 0.35; // 35% from the bottom of the image (corresponds to the dragon logo on the hoodie)
const MAX_ZOOM_SCALE = 18.0; // Target zoom scale at 100% scroll progress

// ─────────────────────────────────────────────────────────────────
//  SHADER CODE  (don't touch unless you know GLSL)
// ─────────────────────────────────────────────────────────────────
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime; 
  uniform float uScrollProgress;
  uniform vec3 uEdgeColor;
  uniform float uEnableAnimation;

  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 5; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
      }
      return value;
  }

  void main() {
    // Add digital glitch/liquid distortion that grows with scroll progress
    vec2 distortedUv = vUv;
    if (uScrollProgress > 0.05) {
        float strength = (uScrollProgress - 0.05) * 0.12; 
        vec2 st = vUv * 15.0;
        float nX = noise(st + vec2(uTime * 3.0, uTime * 2.0));
        float nY = noise(st - vec2(uTime * 2.0, uTime * 3.0));
        distortedUv.x += (nX - 0.5) * strength;
        distortedUv.y += (nY - 0.5) * strength;
    }

    vec4 texColor = texture2D(uTexture, distortedUv);
    
    // Tighten alpha to remove white halo/fringe around the image edges
    texColor.a = smoothstep(0.6, 0.8, texColor.a);
    if(texColor.a <= 0.0) discard;

    // Discard residual pure-white pixels near the edge
    if(texColor.r > 0.8 && texColor.g > 0.8 && texColor.b > 0.8 && texColor.a < 0.9) {
        discard;
    }

    // Electric red dissolve edge effect
    vec2 center = vec2(0.5, 0.5);
    vec2 offset = distortedUv - center;
    float angle = (atan(offset.y, offset.x) / 6.28318) + 0.5; 
    vec2 stEdge = distortedUv * 20.0;
    float noiseVal = fbm(stEdge - vec2(uTime * 1.5, uTime * 2.5));
    float wave = fract(angle - uTime * 0.4 + noiseVal * 0.5);
    float electricEdge = smoothstep(0.95, 0.98, wave);
    float core = smoothstep(0.98, 1.0, wave);
    vec3 electricColor = (uEdgeColor * electricEdge * 5.0 + uEdgeColor * core * 10.0) * uEnableAnimation;

    // Add extra red glow/bloom based on scroll progress
    vec3 glowColor = uEdgeColor * uScrollProgress * 0.8;

    gl_FragColor = vec4(texColor.rgb + electricColor + glowColor, texColor.a);
  }
`;

// ─────────────────────────────────────────────────────────────────
//  INTERNAL: Renders the image as a Three.js plane that fills the canvas.
// ─────────────────────────────────────────────────────────────────
function DissolveImage({
  isAnimationEnabled,
}: {
  isAnimationEnabled: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture("/assets/bala-.png");
  const { viewport } = useThree();

  const img = texture.image as HTMLImageElement | undefined;
  const aspect = img ? img.width / img.height : 1;

  // Fills the canvas exactly — no clipping, no extra padding.
  const height = viewport.height;
  const width = height * aspect;

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uEdgeColor: { value: new THREE.Color("#ffd400") },
      uEnableAnimation: { value: isAnimationEnabled ? 1.0 : 0.0 },
    }),
    [texture, isAnimationEnabled],
  );

  useFrame((state) => {
    if (meshRef.current && typeof window !== "undefined") {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uEnableAnimation.value = isAnimationEnabled ? 1.0 : 0.0;

      // Calculate scroll progress (0.0 to 1.0) based on GSAP pin duration
      const pinDistance = window.innerHeight * 1.5;
      const scrollProgress = Math.min(
        Math.max(window.scrollY / pinDistance, 0),
        1,
      );

      // Pass scroll progress to shader uniform
      material.uniforms.uScrollProgress.value = scrollProgress;

      // Calculate initialScale so the mesh height is exactly 590px on desktop on load
      const targetHeightPx = 590;
      const initialScale =
        typeof window !== "undefined"
          ? targetHeightPx / window.innerHeight
          : 0.7;

      // Scale factor goes from initialScale to MAX_ZOOM_SCALE
      const scale =
        initialScale + scrollProgress * (MAX_ZOOM_SCALE - initialScale);
      meshRef.current.scale.set(scale, scale, 1);

      // Compute local offset of the dragon relative to the center of the mesh
      const offsetX = (DRAGON_X - 0.5) * width;
      const offsetY = (DRAGON_Y - 0.5) * height;

      // Initial Y position to align the bottom of the mesh with the bottom of the viewport at scrollProgress = 0
      const initialY = (-viewport.height / 2) * (1.0 - initialScale);

      // Start position (scrollProgress = 0)
      const startX = 0;
      const startY = initialY;

      // End position (scrollProgress = 1) where dragon coordinates are translated exactly to (0, 0)
      const endX = -offsetX * MAX_ZOOM_SCALE;
      const endY = -offsetY * MAX_ZOOM_SCALE;

      // Interpolate position smoothly based on scroll progress
      meshRef.current.position.x = startX + scrollProgress * (endX - startX);
      meshRef.current.position.y = startY + scrollProgress * (endY - startY);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[width, height, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────
//  EXPORTED COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function ProfileLiquidShader({
  isAnimationEnabled = true,
}: {
  isAnimationEnabled?: boolean;
}) {
  return (
    <div className="w-full h-full relative z-40 pointer-events-auto cursor-crosshair">
      <Canvas camera={{ position: [0, 0, 5], fov: 52 }}>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <DissolveImage isAnimationEnabled={isAnimationEnabled} />
        </Suspense>
      </Canvas>
    </div>
  );
}
