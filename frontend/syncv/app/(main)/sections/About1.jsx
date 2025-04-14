"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Layout from "../../../components/layout/Layout";
import React, { useRef } from "react";

const About1 = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.65, 0.8],
    [0, 1, 1, 30]
  );
  const x = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.65, 0.8],
    ["-5vw", "0vw", "0vw", "50vw"] // Using vw units
  );
  const opacity = useTransform(
    scrollYProgress,
    [0.35, 0.4, 0.65, 0.7],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [0.35, 0.4, 0.65, 0.7],
    [50, 0, 0, -50]
  );

  return (
    <div className="w-full h-[200vh] relative mt-20">
      <Layout>
        <div
          ref={containerRef}
          className="col-start-2 col-span-4 w-full h-[150vh] /border-2 border-red relative pointer-events-none"
        >
          <motion.svg
            style={{ scale: scale, x: x }}
            className="w-[7vw] h-[7vw] border-blue-500 /border-2 sticky top-[23vh] -ml-[3vw]  z-[-1]"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle cx="50" cy="50" r="40" fill="#EC6B2D" />
          </motion.svg>
          <motion.div
            style={{
              opacity: opacity,
              y: y,
            }}
            className="w-full h-fit /border-2 border-green sticky top-[30vh]"
          >
            {/* Title */}
            <div className="h2 text-black">
              Our AI does the hard job for you
            </div>
            {/* Description */}
            <div className="body-small pt-[20px] w-[calc((4/5)*100%)]">
              It identifies critical skills and experiences that directly impact
              job fit and success rate for each position.
            </div>
          </motion.div>
        </div>
      </Layout>
    </div>
  );
};

export default About1;
