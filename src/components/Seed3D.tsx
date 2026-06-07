"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function MakhanaSeed() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={0.5} // XYZ rotation intensity
      floatIntensity={2} // Up/down float intensity
    >
      <mesh ref={meshRef} scale={2}>
        {/* Icosahedron gives a slightly irregular, low-poly-smooth look suitable for displacement */}
        <icosahedronGeometry args={[1, 16]} />
        <meshPhysicalMaterial
          color="#FEFBF5" // Very warm white / cream
          roughness={0.8}
          metalness={0.1}
          clearcoat={0.1}
          clearcoatRoughness={0.3}
          bumpScale={0.05}
          // We can use a simple noise for bumpiness if we had a texture, 
          // but we will rely on lighting and shape here.
        />
        {/* Add some brown specks (the shell remnants) */}
        <mesh position={[0.7, 0.5, 0.4]} scale={0.15}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#5C4033" roughness={0.9} />
        </mesh>
        <mesh position={[-0.8, -0.3, 0.2]} scale={0.12}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#3E2723" roughness={0.9} />
        </mesh>
      </mesh>
    </Float>
  );
}

export default function Seed3D() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10 pointer-events-none flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFF8E7" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#111111" />
        <MakhanaSeed />
        <Environment preset="studio" />
        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
          color="#111111"
        />
      </Canvas>
    </div>
  );
}
