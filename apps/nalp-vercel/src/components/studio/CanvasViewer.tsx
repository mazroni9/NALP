"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF, useTexture } from "@react-three/drei";
import { Suspense } from "react";
import type { Group } from "three";

/** عرض الشارع المستقبلي بالمتر (شرق–غرب) — حصة الشارع لتقابل شارع الجيران */
const STREET_WIDTH_M = 12.5;

interface LandBounds {
  lengthX: number;
  depthY: number;
}

interface ZonePercents {
  a: number;
  b: number;
  c: number;
  d: number;
}

/** ألوان المناطق الأربع: أ المزاد، ب إيواء، ج سكن، د استثمارية */
const ZONE_COLORS = {
  a: "#6366f1", // indigo - منطقة المزاد
  b: "#10b981", // emerald - إيواء المركبات
  c: "#f59e0b", // amber - سكن الموظفين
  d: "#8b5cf6", // violet - استثمارية على الشارع
};

/** رصيف/شارع ملاصق للحافة الجنوبية */
function StreetPlane({ landBounds }: { landBounds: LandBounds }) {
  const len = landBounds.lengthX;
  const w = STREET_WIDTH_M;
  return (
    <mesh
      position={[len / 2, 0.02, w / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={1}
    >
      <planeGeometry args={[len, w]} />
      <meshStandardMaterial
        color="#374151"
        roughness={0.95}
        metalness={0.05}
      />
    </mesh>
  );
}

/**
 * استكتش الأرض مطابق للرسوم المرجعي 520×65
 * يقسم الأرض إلى أربع مناطق مع احتساب خصم حصة الشارع
 */
function LandPlanSketch({
  landBounds,
  streetEnabled,
  zonePercents,
}: {
  landBounds: LandBounds;
  streetEnabled: boolean;
  zonePercents: ZonePercents;
}) {
  const len = landBounds.lengthX;
  const depth = landBounds.depthY;
  const streetDepth = streetEnabled ? STREET_WIDTH_M : 0;
  const netDepth = Math.max(0, depth - streetDepth);

  const { a: pA, b: pB, c: pC, d: pD } = zonePercents;
  const totalP = pA + pB + pC + pD || 1;

  const meshes: JSX.Element[] = [];

  if (streetEnabled && netDepth > 0) {
    const dRatio = pD / totalP;
    const dDepth = netDepth * dRatio;
    const abcDepth = netDepth - dDepth;

    const abcTotal = pA + pB + pC;
    const aRatio = abcTotal > 0 ? pA / abcTotal : 1 / 3;
    const bRatio = abcTotal > 0 ? pB / abcTotal : 1 / 3;
    const cRatio = abcTotal > 0 ? pC / abcTotal : 1 / 3;

    let xA = 0;
    const wA = len * aRatio;
    const wB = len * bRatio;
    const wC = len * cRatio;

    if (dDepth > 0) {
      meshes.push(
        <mesh
          key="zone-d"
          position={[len / 2, 0.01, streetDepth + dDepth / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[len, dDepth]} />
          <meshStandardMaterial color={ZONE_COLORS.d} transparent opacity={0.85} />
        </mesh>
      );
    }

    if (abcDepth > 0) {
      meshes.push(
        <mesh
          key="zone-a"
          position={[xA + wA / 2, 0.01, streetDepth + dDepth + abcDepth / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[wA, abcDepth]} />
          <meshStandardMaterial color={ZONE_COLORS.a} transparent opacity={0.85} />
        </mesh>
      );
      xA += wA;
      meshes.push(
        <mesh
          key="zone-b"
          position={[xA + wB / 2, 0.01, streetDepth + dDepth + abcDepth / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[wB, abcDepth]} />
          <meshStandardMaterial color={ZONE_COLORS.b} transparent opacity={0.85} />
        </mesh>
      );
      xA += wB;
      meshes.push(
        <mesh
          key="zone-c"
          position={[xA + wC / 2, 0.01, streetDepth + dDepth + abcDepth / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[wC, abcDepth]} />
          <meshStandardMaterial color={ZONE_COLORS.c} transparent opacity={0.85} />
        </mesh>
      );
    }
  } else {
    const wA = len * (pA / totalP);
    const wB = len * (pB / totalP);
    const wC = len * (pC / totalP);
    const wD = len * (pD / totalP);
    let x = 0;

    [
      { key: "a", w: wA, c: ZONE_COLORS.a },
      { key: "b", w: wB, c: ZONE_COLORS.b },
      { key: "c", w: wC, c: ZONE_COLORS.c },
      { key: "d", w: wD, c: ZONE_COLORS.d },
    ].forEach(({ key, w, c }) => {
      if (w > 0.1 && depth > 0.1) {
        meshes.push(
          <mesh
            key={`zone-${key}`}
            position={[x + w / 2, 0.01, depth / 2]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[w, depth]} />
            <meshStandardMaterial color={c} transparent opacity={0.85} />
          </mesh>
        );
      }
      x += w;
    });
  }

  return (
    <group>
      <Suspense fallback={null}>
        <SketchBasePlane len={len} depth={depth} />
      </Suspense>
      {meshes}
    </group>
  );
}

function SketchBasePlane({ len, depth }: { len: number; depth: number }) {
  const sketchMap = useTexture("/nalp-land-sketch-map.png");
  return (
    <mesh position={[len / 2, 0, depth / 2]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-2}>
      <planeGeometry args={[len, depth]} />
      <meshStandardMaterial
        map={sketchMap}
        roughness={0.9}
        metalness={0}
        transparent
        opacity={0.7}
      />
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
  zonePercents: ZonePercents;
}

function Scene({ glbUrl, streetEnabled, landBounds, zonePercents }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[260, 150, 100]} intensity={1.2} />
      <OrbitControls />
      <Grid
        args={[600, 600]}
        cellSize={10}
        cellThickness={0.4}
        sectionSize={50}
        sectionThickness={0.8}
        fadeDistance={400}
        fadeStrength={0.5}
        infiniteGrid
      />
      {streetEnabled && <StreetPlane landBounds={landBounds} />}
      <LandPlanSketch
        landBounds={landBounds}
        streetEnabled={streetEnabled}
        zonePercents={zonePercents}
      />
      {glbUrl && (
        <Suspense fallback={null}>
          <GlbModel url={glbUrl} />
        </Suspense>
      )}
    </>
  );
}

interface CanvasViewerProps {
  glbUrl: string | null;
  streetEnabled?: boolean;
  landBounds?: LandBounds;
  zonePercents?: ZonePercents;
}

export function CanvasViewer({
  glbUrl,
  streetEnabled = false,
  landBounds = { lengthX: 520, depthY: 65 },
  zonePercents = { a: 20, b: 25, c: 40, d: 15 },
}: CanvasViewerProps) {
  return (
    <Canvas camera={{ position: [320, 120, 200], fov: 50 }}>
      <Scene
        glbUrl={glbUrl}
        streetEnabled={streetEnabled}
        landBounds={landBounds}
        zonePercents={zonePercents}
      />
    </Canvas>
  );
}
