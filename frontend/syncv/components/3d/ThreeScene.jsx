"use client";
import React, { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, Environment } from "@react-three/drei";
import ScrollAnimationController from "./ScrollAnimationController";
import SimpleLoaderAnimation from "../common/LoaderAnimation";

const responsiveValue = (
  minWidth,
  maxWidth,
  minValue,
  maxValue,
  currentWidth
) => {
  if (currentWidth <= minWidth) return minValue;
  if (currentWidth >= maxWidth) return maxValue;

  let percentage = (currentWidth - minWidth) / (maxWidth - minWidth);
  percentage = Math.pow(percentage, 0.7);

  return minValue + percentage * (maxValue - minValue);
};

function Model({ modelPath, viewportWidth, onLoaded }) {
  const modelRef = useRef();
  const gltf = useLoader(GLTFLoader, modelPath);

  useEffect(() => {
    if (gltf && onLoaded) {
      setTimeout(() => {
        onLoaded();
      }, 300);
    }
  }, [gltf, onLoaded]);

  const baseKeyframes = [
    { scrollY: 0, rotation: [0.02, 0, 0] },
    { scrollY: 0.05, rotation: [0.02, 0, 0] },
    { scrollY: 1, rotation: [-0.3, -0.4, 0] },
    { scrollY: 1.7, rotation: [-0.3, -0.6, 0] },
    { scrollY: 2, rotation: [-0.3, 0.2, 0] },
    { scrollY: 2.5, rotation: [-0.3, 0.4, 0.1] },
    { scrollY: 4, rotation: [0.02, 0, 0] },
    { scrollY: 4.45, rotation: [0.02, 0, 0] },
    { scrollY: 4.55, rotation: [0.02, 0, 0] },
  ];

  const responsiveKeyframes = baseKeyframes.map((keyframe) => {
    const configs = {
      0: {
        position: [
          0,
          responsiveValue(375, 1920, -15, 0, viewportWidth),
          responsiveValue(375, 1920, 20, 62, viewportWidth),
        ],
        scale: responsiveValue(375, 1920, 0.3, 1.6, viewportWidth),
      },
      0.05: {
        position: [
          0,
          responsiveValue(375, 1920, -15, 0, viewportWidth),
          responsiveValue(375, 1920, 35, 65, viewportWidth),
        ],
        scale: responsiveValue(375, 1920, 0.3, 1.6, viewportWidth),
      },
      1: {
        position: [responsiveValue(375, 1920, 20, 25, viewportWidth), 0, 0],
        scale: responsiveValue(375, 1920, 0.5, 1.0, viewportWidth),
      },
      1.7: {
        position: [responsiveValue(375, 1920, 20, 25, viewportWidth), 0, 0],
        scale: responsiveValue(375, 1920, 0.5, 0.9, viewportWidth),
      },
      2: {
        position: [responsiveValue(375, 1920, -20, -25, viewportWidth), 0, 0],
        scale: responsiveValue(375, 1920, 0.5, 1.0, viewportWidth),
      },
      2.5: {
        position: [responsiveValue(375, 1920, -20, -25, viewportWidth), 0, 0],
        scale: responsiveValue(375, 1920, 0.45, 0.9, viewportWidth),
      },
      4: {
        position: [0, 0, responsiveValue(375, 1920, -20, -60, viewportWidth)],
        scale: responsiveValue(375, 1920, 0.6, 1.6, viewportWidth),
      },
      4.45: {
        position: [0, 0, responsiveValue(375, 1920, -20, -60, viewportWidth)],
        scale: responsiveValue(375, 1920, 0.6, 1.6, viewportWidth),
      },
      4.55: {
        position: [0, 0, responsiveValue(375, 1920, -30, -80, viewportWidth)],
        scale: responsiveValue(375, 1920, 0.6, 1.6, viewportWidth),
      },
    };

    return {
      scrollY: keyframe.scrollY,
      position: configs[keyframe.scrollY]?.position || [0, 0, 0],
      rotation: keyframe.rotation,
      scale: configs[keyframe.scrollY]?.scale || 1.0,
    };
  });

  return (
    <>
      <primitive
        ref={modelRef}
        object={gltf.scene}
        scale={1}
        position={[0, 0, 0]}
      />
      <ScrollAnimationController
        target={modelRef}
        keyframes={responsiveKeyframes}
      />
    </>
  );
}

export default function ThreeScene({ modelPath = "/models/cv.glb" }) {
  const [isLoading, setIsLoading] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );

  useEffect(() => {
    const updateScreenWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);
    return () => window.removeEventListener("resize", updateScreenWidth);
  }, []);

  const cameraPosition = responsiveValue(375, 1920, 20, 50, viewportWidth);
  const cameraFov = responsiveValue(375, 1920, 80, 60, viewportWidth);

  const cameraProps = {
    position: [0, cameraPosition, 5],
    fov: cameraFov,
  };

  const handleModelLoaded = () => {
    console.log("3D model loaded successfully");
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <SimpleLoaderAnimation onLoadingComplete={handleLoadingComplete} />
      )}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <Canvas camera={cameraProps} style={{ pointerEvents: "none" }}>
          <ambientLight intensity={0.01} />
          <directionalLight position={[10, 10, 5]} intensity={0.01} />

          <Suspense fallback={null}>
            <Model
              modelPath={modelPath}
              viewportWidth={viewportWidth}
              onLoaded={handleModelLoaded}
            />
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
