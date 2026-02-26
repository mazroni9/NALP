"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import type { Group } from "three";

function PlaceholderModel() {
  return (
    <mesh>
      <boxGeometry args={[50, 20, 80]} />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  );
}

function GlbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={(scene as unknown as Group).clone()} />;
}

function Scene({ glbUrl }: { glbUrl: string | null }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[50, 100, 50]} intensity={1} />
      <OrbitControls />
      <Grid
        args={[200, 200]}
        cellSize={10}
        cellThickness={0.5}
        sectionSize={50}
        sectionThickness={1}
        fadeDistance={200}
        fadeStrength={0.5}
        infiniteGrid
      />
      <Suspense fallback={null}>
        {glbUrl ? (
          <GlbModel url={glbUrl} />
        ) : (
          <PlaceholderModel />
        )}
      </Suspense>
    </>
  );
}

export function CanvasViewer({ glbUrl }: { glbUrl: string | null }) {
  return (
    <Canvas camera={{ position: [120, 80, 120], fov: 45 }}>
      <Scene glbUrl={glbUrl} />
    </Canvas>
  );
}
