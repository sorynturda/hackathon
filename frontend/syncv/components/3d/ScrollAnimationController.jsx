"use client";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Euler } from "three";

// Helper to interpolate between two values
const lerp = (start, end, t) => {
  return start * (1 - t) + end * t;
};

export default function ScrollAnimationController({ target, keyframes }) {
  const modelRef = useRef();
  const scrollY = useRef(0);

  // Current state values
  const currentPosition = useRef(new Vector3(0, 0, 0));
  const currentRotation = useRef(new Euler(0, 0, 0));
  const currentScale = useRef(1);

  // Set up scroll listener and model reference
  useEffect(() => {
    if (target && target.current) {
      modelRef.current = target.current;

      // Initialize with starting position
      const initialKeyframe = keyframes[0];
      currentPosition.current.set(...initialKeyframe.position);
      currentRotation.current.set(...initialKeyframe.rotation);
      currentScale.current = initialKeyframe.scale;

      if (modelRef.current) {
        modelRef.current.position.copy(currentPosition.current);
        modelRef.current.rotation.copy(currentRotation.current);
        modelRef.current.scale.set(
          currentScale.current,
          currentScale.current,
          currentScale.current
        );
      }
    }

    // Scroll handler
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [target, keyframes]);

  // Animation loop
  useFrame(() => {
    if (!modelRef.current) return;

    // Convert scroll to vh units
    const vh = window.innerHeight;
    const scrollInVh = scrollY.current / vh;

    // Find the two keyframes we're between
    let startKeyframe = keyframes[0];
    let endKeyframe = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (
        scrollInVh >= keyframes[i].scrollY &&
        scrollInVh < keyframes[i + 1].scrollY
      ) {
        startKeyframe = keyframes[i];
        endKeyframe = keyframes[i + 1];
        break;
      }
    }

    // Calculate progress between keyframes
    const progress =
      (scrollInVh - startKeyframe.scrollY) /
      (endKeyframe.scrollY - startKeyframe.scrollY);

    // Apply smooth transitions with damping
    const damping = 0.05;

    // Position
    currentPosition.current.x +=
      (lerp(startKeyframe.position[0], endKeyframe.position[0], progress) -
        currentPosition.current.x) *
      damping;
    currentPosition.current.y +=
      (lerp(startKeyframe.position[1], endKeyframe.position[1], progress) -
        currentPosition.current.y) *
      damping;
    currentPosition.current.z +=
      (lerp(startKeyframe.position[2], endKeyframe.position[2], progress) -
        currentPosition.current.z) *
      damping;

    // Rotation
    currentRotation.current.x +=
      (lerp(startKeyframe.rotation[0], endKeyframe.rotation[0], progress) -
        currentRotation.current.x) *
      damping;
    currentRotation.current.y +=
      (lerp(startKeyframe.rotation[1], endKeyframe.rotation[1], progress) -
        currentRotation.current.y) *
      damping;
    currentRotation.current.z +=
      (lerp(startKeyframe.rotation[2], endKeyframe.rotation[2], progress) -
        currentRotation.current.z) *
      damping;

    // Scale
    currentScale.current +=
      (lerp(startKeyframe.scale, endKeyframe.scale, progress) -
        currentScale.current) *
      damping;

    // Apply to model
    modelRef.current.position.copy(currentPosition.current);
    modelRef.current.rotation.x = currentRotation.current.x;
    modelRef.current.rotation.y = currentRotation.current.y;
    modelRef.current.rotation.z = currentRotation.current.z;
    modelRef.current.scale.set(
      currentScale.current,
      currentScale.current,
      currentScale.current
    );
  });

  return null;
}
