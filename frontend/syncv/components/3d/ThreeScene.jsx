// components/3d/ThreeScene.jsx
"use client";
import React, { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, Environment } from "@react-three/drei";
import ScrollAnimationController from "./ScrollAnimationController";

// Helper function to interpolate values with a more aggressive curve for small screens
// Uses a modified power curve to scale down more aggressively on smaller devices
const responsiveValue = (
  minWidth,
  maxWidth,
  minValue,
  maxValue,
  currentWidth
) => {
  // If smaller than min width, return min value (even smaller now)
  if (currentWidth <= minWidth) return minValue;
  // If larger than max width, cap at a reasonable maximum
  if (currentWidth >= maxWidth) return maxValue;

  // Calculate the percentage between min and max width
  let percentage = (currentWidth - minWidth) / (maxWidth - minWidth);

  // Apply a power curve to make scaling more aggressive on smaller screens
  // Using a power of 0.7 makes the curve steeper at the beginning (small screens)
  // This ensures more aggressive scaling for smaller devices
  percentage = Math.pow(percentage, 0.7);

  // Interpolate between min and max values
  return minValue + percentage * (maxValue - minValue);
};

// The CV Model is defined within the same file
function Model({ modelPath, viewportWidth }) {
  const modelRef = useRef();
  const gltf = useLoader(GLTFLoader, modelPath);

  // Base keyframe templates
  const baseKeyframes = [
    // Hero section
    {
      scrollY: 0,
      rotation: [0.02, 0, 0],
    },
    {
      scrollY: 0.05,
      rotation: [0.02, 0, 0],
    },
    // About1 section
    {
      scrollY: 1,
      rotation: [-0.3, -0.4, 0],
    },
    {
      scrollY: 1.7,
      rotation: [-0.3, -0.6, 0],
    },
    {
      scrollY: 2,
      rotation: [-0.3, 0.2, 0],
    },
    {
      scrollY: 2.5,
      rotation: [-0.3, 0.4, 0.1],
    },
    {
      scrollY: 4,
      rotation: [0.02, 0, 0],
    },
    {
      scrollY: 4.45,
      rotation: [0.02, 0, 0],
    },
    {
      scrollY: 4.55,
      rotation: [0.02, 0, 0],
    },
  ];

  // Generate responsive keyframes based on screen width
  const responsiveKeyframes = baseKeyframes.map((keyframe) => {
    // Define min and max values for different properties
    const configs = {
      // First hero position
      0: {
        position: [
          0, // x remains 0
          responsiveValue(375, 1920, -15, 0, viewportWidth),
          responsiveValue(375, 1920, 20, 62, viewportWidth), // z: reduced from 40 to 20 on mobile
        ],
        scale: responsiveValue(375, 1920, 0.3, 1.6, viewportWidth), // reduced from 1.0 to 0.6 on mobile, capped at 1.6 max
      },
      // Second hero position (same as first for this section)
      0.05: {
        position: [
          0, // x remains 0
          responsiveValue(375, 1920, -15, 0, viewportWidth),
          responsiveValue(375, 1920, 35, 65, viewportWidth), // z: reduced from 40 to 20 on mobile
        ],
        scale: responsiveValue(375, 1920, 0.3, 1.6, viewportWidth), // reduced from 1.0 to 0.6 on mobile, capped at 1.6 max
      },
      // First about section - left side
      1: {
        position: [
          responsiveValue(375, 1920, 20, 25, viewportWidth), // x: reduced from 15 to 10 on mobile
          0,
          0,
        ],
        scale: responsiveValue(375, 1920, 0.5, 1.0, viewportWidth), // reduced from 0.8 to 0.5 on mobile
      },
      // Continue first about section
      1.7: {
        position: [responsiveValue(375, 1920, 20, 25, viewportWidth), 0, 0],
        scale: responsiveValue(375, 1920, 0.5, 0.9, viewportWidth), // reduced from 0.8 to 0.5 on mobile
      },
      // Second about section - right side
      2: {
        position: [
          responsiveValue(375, 1920, -20, -25, viewportWidth), // x: reduced offset magnitude
          0,
          0,
        ],
        scale: responsiveValue(375, 1920, 0.5, 1.0, viewportWidth), // reduced from 0.8 to 0.5 on mobile
      },
      // Continue second about section
      2.5: {
        position: [responsiveValue(375, 1920, -20, -25, viewportWidth), 0, 0],
        scale: responsiveValue(375, 1920, 0.45, 0.9, viewportWidth), // reduced from 0.7 to 0.45 on mobile
      },
      // Third section
      4: {
        position: [
          0,
          0,
          responsiveValue(375, 1920, -20, -60, viewportWidth), // z: reduced depth for mobile
        ],
        scale: responsiveValue(375, 1920, 0.6, 1.6, viewportWidth), // reduced scale on both ends
      },
      // Continue third section
      4.45: {
        position: [0, 0, responsiveValue(375, 1920, -20, -60, viewportWidth)],
        scale: responsiveValue(375, 1920, 0.6, 1.6, viewportWidth),
      },
      // Final position
      4.55: {
        position: [
          0,
          0,
          responsiveValue(375, 1920, -30, -80, viewportWidth), // z: reduced depth for mobile
        ],
        scale: responsiveValue(375, 1920, 0.6, 1.6, viewportWidth),
      },
    };

    // Apply responsive values for the current keyframe scroll position
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
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920
  ); // Default to desktop width

  // Track screen width for responsive adjustments
  useEffect(() => {
    const updateScreenWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    // Set initial width
    updateScreenWidth();

    // Add resize listener
    window.addEventListener("resize", updateScreenWidth);

    // Cleanup
    return () => window.removeEventListener("resize", updateScreenWidth);
  }, []);

  // Create responsive camera properties - adjusted for more aggressive scaling
  const cameraPosition = responsiveValue(375, 1920, 20, 50, viewportWidth); // Reduced from 35 to 20 for mobile
  const cameraFov = responsiveValue(375, 1920, 80, 60, viewportWidth); // Increased FOV for mobile to show more

  const cameraProps = {
    position: [0, cameraPosition, 5],
    fov: cameraFov,
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <Canvas
          camera={cameraProps}
          onCreated={() => setIsLoading(false)}
          style={{ pointerEvents: "none" }}
        >
          <ambientLight intensity={0.01} />
          <directionalLight position={[10, 10, 5]} intensity={0.01} />

          <Suspense fallback={null}>
            <Model modelPath={modelPath} viewportWidth={viewportWidth} />
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
