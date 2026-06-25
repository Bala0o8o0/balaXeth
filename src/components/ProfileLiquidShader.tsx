"use client";

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

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
    vec4 texColor = texture2D(uTexture, vUv);
    
    // Tighten alpha to remove white halo/fringe around the image edges
    texColor.a = smoothstep(0.6, 0.8, texColor.a);
    if(texColor.a <= 0.0) discard;

    // Discard residual pure-white pixels near the edge
    if(texColor.r > 0.8 && texColor.g > 0.8 && texColor.b > 0.8 && texColor.a < 0.9) {
        discard;
    }

    // Red gradient tint from bottom to top
    vec3 redTint = vec3(1.0, 0.0, 0.0);
    float gradientStrength = (1.0 - vUv.y) * 0.7;
    texColor.rgb = mix(texColor.rgb, texColor.rgb * redTint, gradientStrength);

    // Electric red dissolve edge effect
    vec2 center = vec2(0.5, 0.5);
    vec2 offset = vUv - center;
    float angle = (atan(offset.y, offset.x) / 6.28318) + 0.5; 
    vec2 st = vUv * 20.0;
    float noiseVal = fbm(st - vec2(uTime * 1.5, uTime * 2.5));
    float wave = fract(angle - uTime * 0.4 + noiseVal * 0.5);
    float electricEdge = smoothstep(0.95, 0.98, wave);
    float core = smoothstep(0.98, 1.0, wave);
    vec3 electricColor = (uEdgeColor * electricEdge * 5.0 + uEdgeColor * core * 10.0) * uEnableAnimation;

    gl_FragColor = vec4(texColor.rgb + electricColor, texColor.a);
  }
`;

// ─────────────────────────────────────────────────────────────────
//  INTERNAL: Renders the image as a Three.js plane that fills the canvas.
//  The canvas fills 100% of its parent container — so resize the
//  container in page.tsx, not this file.
// ─────────────────────────────────────────────────────────────────
function DissolveImage({ isAnimationEnabled }: { isAnimationEnabled: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const texture = useTexture("/assets/bala 1.png");
    const { viewport } = useThree();

    const img = texture.image as HTMLImageElement | undefined;
    const aspect = img ? img.width / img.height : 1;

    // Fills the canvas exactly — no clipping, no extra padding.
    const height = viewport.height;
    const width = height * aspect;

    const uniforms = useMemo(() => ({
        uTexture: { value: texture },
        uTime: { value: 0 },
        uEdgeColor: { value: new THREE.Color("#FF0000") },
        uEnableAnimation: { value: isAnimationEnabled ? 1.0 : 0.0 }
    }), [texture, isAnimationEnabled]);

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;
            material.uniforms.uEnableAnimation.value = isAnimationEnabled ? 1.0 : 0.0;
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
//
//  ⚠️  To change the image size, go to page.tsx and find the
//      "PROFILE IMAGE — Change size here" comment block.
//      Edit the `height` value in the style prop there.
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
