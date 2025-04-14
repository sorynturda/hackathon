"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

const RotatingText = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Rotații
  const uploadRotate = useTransform(
    scrollYProgress,
    [0.2, 0.3, 0.4],
    [90, 0, -90]
  );

  const matchRotate = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.5],
    [90, 0, -90]
  );

  const discoverRotate = useTransform(
    scrollYProgress,
    [0.4, 0.5, 0.6],
    [90, 0, -90]
  );

  // Mișcări pe Y
  const uploadY = useTransform(
    scrollYProgress,
    [0.2, 0.3, 0.4],
    ["0vh", "0vh", "-15vh"]
  );

  const matchY = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.5],
    ["15vh", "0vh", "-15vh"]
  );

  const discoverY = useTransform(
    scrollYProgress,
    [0.4, 0.5, 0.6],
    ["15vh", "0vh", "-15vh"]
  );

  return (
    <div ref={containerRef} className="w-full h-[200vh] -mt-[30vh] relative">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden ">
        <div className="perspective-[1000px] transform-gpu relative flex flex-col items-center justify-center">
          <motion.div
            className="h1 text-black absolute"
            style={{
              rotateX: uploadRotate,
              y: uploadY,
              transformOrigin: "50% 50%",
              backfaceVisibility: "hidden",
              x: "-50%",
              left: "50%",
            }}
          >
            Upload.
          </motion.div>

          <motion.div
            className="h1 text-black absolute"
            style={{
              rotateX: matchRotate,
              y: matchY,
              transformOrigin: "50% 50%",
              backfaceVisibility: "hidden",
              x: "-50%",
              left: "50%",
            }}
          >
            Match.
          </motion.div>

          <motion.div
            className="h1 text-black absolute"
            style={{
              rotateX: discoverRotate,
              y: discoverY,
              transformOrigin: "50% 50%",
              backfaceVisibility: "hidden",
              x: "-50%",
              left: "50%",
            }}
          >
            Discover.
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RotatingText;
