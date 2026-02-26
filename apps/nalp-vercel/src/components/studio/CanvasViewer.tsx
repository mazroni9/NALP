"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import type { Group } from "three";

/** عرض الشارع المستقبلي بالمتر (شرق–غرب) */
const STREET_WIDTH_M = 12.5;

interface LandBounds {
  lengthX: number;
  depthY: number;
}

function StreetPlane({ landBounds }: { landBounds: LandBounds }) {
  const len = landBounds.lengthX;
  const width = STREET_WIDTH_M;
  return (
    <mesh
      position={[len / 2, -0.05, width / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={-1}
    >
      <planeGeometry args={[len, width]} />
      <meshStandardMaterial
        color="#374151"
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}

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

interface SceneProps {
  glbUrl: string | null;
  streetEnabled: boolean;
  landBounds: LandBounds;
}

function Scene({ glbUrl, streetEnabled, landBounds }: SceneProps) {
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
      {streetEnabled && <StreetPlane landBounds={landBounds} />}
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

interface CanvasViewerProps {
  glbUrl: string | null;
  streetEnabled?: boolean;
  landBounds?: LandBounds;
}

export function CanvasViewer({
  glbUrl,
  streetEnabled = false,
  landBounds = { lengthX: 520, depthY: 65 },
}: CanvasViewerProps) {
  return (
    <Canvas camera={{ position: [120, 80, 120], fov: 45 }}>
      <Scene
        glbUrl={glbUrl}
        streetEnabled={streetEnabled}
        landBounds={landBounds}
      />
    </Canvas>
  );
}
