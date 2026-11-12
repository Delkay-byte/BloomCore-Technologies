"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { STAGE_PRODUCTS, type StageProduct } from "@/lib/product-stage";
import { drawProductPanel } from "@/components/stage/draw-product-panel";

type CarouselProps = {
  index: number;
  onIndexChange: (index: number) => void;
  reducedMotion: boolean;
  compact?: boolean;
};

const PANEL_W = 3.5;
const PANEL_H = 2.25;

function usePanelTexture(product: StageProduct) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 870;
    const ctx = canvas.getContext("2d");
    if (ctx) drawProductPanel(ctx, product, canvas.width, canvas.height);
    const next = new THREE.CanvasTexture(canvas);
    next.colorSpace = THREE.SRGBColorSpace;
    next.anisotropy = 8;
    next.minFilter = THREE.LinearMipmapLinearFilter;
    next.needsUpdate = true;
    return next;
  }, [product]);

  useEffect(() => {
    const canvas = texture.image as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const paint = () => {
      drawProductPanel(ctx, product, canvas.width, canvas.height);
      texture.needsUpdate = true;
    };
    document.fonts?.ready.then(paint).catch(() => {});
    return () => texture.dispose();
  }, [product, texture]);

  return texture;
}

function Panel({
  product,
  index,
  getOffset,
  active,
}: {
  product: StageProduct;
  index: number;
  getOffset: (index: number) => number;
  active: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const texture = usePanelTexture(product);
  const target = useRef({ x: 0, z: 0, ry: 0, scale: 1 });

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    const offset = getOffset(index);
    target.current.x = offset * 2.3;
    target.current.z = -Math.abs(offset) * 1.58;
    target.current.ry = -offset * 0.62;
    target.current.scale = 1 - Math.min(Math.abs(offset), 1) * 0.15;

    const lambda = 10;
    node.position.x = THREE.MathUtils.damp(node.position.x, target.current.x, lambda, delta);
    node.position.z = THREE.MathUtils.damp(node.position.z, target.current.z, lambda, delta);
    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, target.current.ry, lambda, delta);
    const scale = THREE.MathUtils.damp(node.scale.x, target.current.scale, lambda, delta);
    node.scale.setScalar(scale);
  });

  return (
    <group ref={group} position={[index === 0 ? 0 : index === 1 ? 2.42 : -2.42, 0, 0]}>
      <RoundedBox
        args={[PANEL_W + 0.12, PANEL_H + 0.12, 0.1]}
        radius={0.055}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={active ? "#171717" : "#0b0b0b"}
          roughness={0.42}
          metalness={0.22}
        />
      </RoundedBox>

      <mesh position={[0, 0, 0.085]}>
        <planeGeometry args={[PANEL_W, PANEL_H]} />
        {texture ? (
          <meshBasicMaterial
            map={texture}
            color={active ? "#ffffff" : "#8f8f8f"}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        ) : (
          <meshBasicMaterial color="#141414" toneMapped={false} side={THREE.DoubleSide} />
        )}
      </mesh>

      <mesh position={[0, -PANEL_H / 2 - 0.04, 0.085]}>
        <planeGeometry args={[PANEL_W - 0.3, 0.018]} />
        <meshBasicMaterial color={active ? "#d4d4d4" : "#4a4a4a"} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Rig({
  index,
  dragRef,
  reducedMotion,
}: {
  index: number;
  dragRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const current = useRef(index);

  useFrame((_, delta) => {
    const target = index - dragRef.current / 190;
    current.current = reducedMotion
      ? target
      : THREE.MathUtils.damp(current.current, target, 7, delta);
  });

  const getOffset = (panelIndex: number) => {
    const raw = panelIndex - current.current;
    return ((((raw + 1.5) % 3) + 3) % 3) - 1.5;
  };

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 2, -2]} intensity={0.35} color="#d4d4d4" />
      <pointLight position={[0, -2, 4]} intensity={0.3} color="#ffffff" />

      <group position={[0, 0.1, 0]}>
        {STAGE_PRODUCTS.map((product, panelIndex) => (
          <Panel
            key={product.slug}
            product={product}
            index={panelIndex}
            getOffset={getOffset}
            active={(((index % 3) + 3) % 3) === panelIndex}
          />
        ))}
      </group>
    </>
  );
}

export default function ProductCarousel3D({
  index,
  onIndexChange,
  reducedMotion,
  compact = false,
}: CarouselProps) {
  const drag = useRef(0);
  const startX = useRef<number | null>(null);
  const [inView, setInView] = useState(true);
  const [hidden, setHidden] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setHidden(document.visibilityState === "hidden");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const settle = () => {
    if (startX.current === null) return;
    const delta = drag.current;
    startX.current = null;
    drag.current = 0;
    if (Math.abs(delta) > 24) {
      onIndexChange(index - Math.round(delta / 190));
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startX.current = event.clientX;
    (event.currentTarget as HTMLDivElement).setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    drag.current = event.clientX - startX.current;
  };

  const onPointerUp = () => settle();
  const onPointerCancel = () => settle();

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      aria-hidden="true"
    >
      <Canvas
        key={compact ? "compact" : "wide"}
        shadows
        dpr={[1, 1.65]}
        frameloop={inView && !hidden ? "always" : "never"}
        camera={{ position: [0, 0.3, compact ? 5.9 : 5.3], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense fallback={null}>
          <Rig index={index} dragRef={drag} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
