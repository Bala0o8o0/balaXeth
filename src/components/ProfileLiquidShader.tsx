"use client";

import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

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
    
    // Remove the fuzzy anti-aliased edge where the white halo lives
    // by tightening the alpha channel threshold. 
    // Anything below 0.6 alpha becomes completely transparent.
    texColor.a = smoothstep(0.6, 0.8, texColor.a);
    if(texColor.a <= 0.0) discard;

    // Discard any residual pure white pixels near the edge
    if(texColor.r > 0.8 && texColor.g > 0.8 && texColor.b > 0.8 && texColor.a < 0.9) {
        discard;
    }
    vec3 redTint = vec3(1.0, 0.0, 0.0);
    float gradientStrength = (1.0 - vUv.y) * 0.7;
    texColor.rgb = mix(texColor.rgb, texColor.rgb * redTint, gradientStrength);

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

function DissolveImage({ url, scale = 1.0, isAnimationEnabled = true }: { url: string; scale?: number; isAnimationEnabled?: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const texture = useTexture(url);
    const { viewport } = useThree();

    const img = texture.image as HTMLImageElement | undefined;
    const aspect = img ? img.width / img.height : 1;

    // Use scale=1.0 to fit perfectly in the viewport without any clipping.
    // If you want the head to be bigger, increase the CSS height of the container in page.tsx!
    const height = viewport.height * scale;
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

export default function ProfileLiquidShader({
    desktopScale = 1.0, 
    mobileScale = 1.0,
    isAnimationEnabled = true
}: {
    desktopScale?: number;
    mobileScale?: number;
    isAnimationEnabled?: boolean;
}) {
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const currentScale = isDesktop ? desktopScale : mobileScale;

    return (
        <div className="w-full h-full relative z-40 pointer-events-auto cursor-crosshair">
            <Canvas camera={{ position: [0, 0, 5], fov: 52 }}>
                <ambientLight intensity={1} />
                <Suspense fallback={null}>
                    <DissolveImage url="/assets/bala 1.png" scale={currentScale} isAnimationEnabled={isAnimationEnabled} />
                </Suspense>
            </Canvas>
        </div>
    );
}
