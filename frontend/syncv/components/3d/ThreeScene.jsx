// components/3d/ThreeScene.jsx
"use client";
import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, Environment } from "@react-three/drei";
import ScrollAnimationController from "./ScrollAnimationController";

// The CV Model is defined within the same file
// Inside your ThreeCV.jsx file, update the Model component:

function Model({ modelPath }) {
  const modelRef = useRef();
  const gltf = useLoader(GLTFLoader, modelPath);

  // Define keyframes based on vh units
  const keyframes = [
    // Hero section
    {
      scrollY: 0, // Start of page
      position: [0, 0, 80],
      rotation: [0.02, 0, 0],
      scale: 2.05,
    },
    {
      scrollY: 0.05, // Start of page
      position: [0, 0, 80],
      rotation: [0.02, 0, 0],
      scale: 2.05,
    },
    // About1 section
    {
      scrollY: 1, // 1 viewport down
      position: [30, 0, 0],
      rotation: [-0.3, -0.4, 0],
      scale: 1.2,
    },
    {
      scrollY: 1.7, // 1 viewport down
      position: [30, 0, 0],
      rotation: [-0.3, -0.6, 0],
      scale: 1.2,
    },
    {
      scrollY: 2, // 2 viewports down
      position: [-30, 0, 0],
      rotation: [-0.3, 0.2, 0],
      scale: 1.2,
    },
    {
      scrollY: 2.5, // 2 viewports down
      position: [-30, 0, 0],
      rotation: [-0.3, 0.4, 0.1],
      scale: 1.2,
    },
    {
      scrollY: 4, // 2 viewports down
      position: [0, 0, -70],
      rotation: [0.02, 0, 0],
      scale: 2.05,
    },
    {
      scrollY: 4.4, // 2 viewports down
      position: [0, 0, -70],
      rotation: [0.02, 0, 0],
      scale: 2.05,
    },
    {
      scrollY: 4.5, // 2 viewports down
      position: [0, 0, -100],
      rotation: [0.02, 0, 0],
      scale: 2.05,
    },
  ];

  return (
    <>
      <primitive
        ref={modelRef}
        object={gltf.scene}
        scale={1}
        position={[0, 0, 0]}
      />
      <ScrollAnimationController target={modelRef} keyframes={keyframes} />
    </>
  );
}

// Loading component
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20">
      <div className="text-black body">Loading 3D Model...</div>
    </div>
  );
}

// Main component that exports
export default function ThreeScene({ modelPath = "/models/cv.glb" }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Loader />}
      <div className="fixed inset-0 z-10 pointer-events-none ">
        <Canvas
          camera={{ position: [0, 70, 5], fov: 60 }}
          onCreated={() => setIsLoading(false)}
        >
          <ambientLight intensity={0.01} />
          <directionalLight position={[10, 10, 5]} intensity={0.01} />

          <Suspense fallback={null}>
            <Model modelPath={modelPath} />
            <Environment preset="city" />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
            makeDefault
          />
        </Canvas>
      </div>
    </>
  );
}
