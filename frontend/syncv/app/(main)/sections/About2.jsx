"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Layout from "../../../components/layout/Layout";
import React, { useRef } from "react";

const About2 = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.65, 0.8],
    [0, 1, 1, 70]
  );
  const x = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.65, 0.8],
    ["-5vw", "0vw", "0vw", "-20vw"]
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
    <div className="w-full h-[150vh] relative bg-accent border-pink-600 /border-4 ">
      <Layout>
        <div
          ref={containerRef}
          className="col-start-8 col-span-4 max-sm:col-start-4 max-sm:col-span-8 w-full h-[150vh] /border-2 border-red relative pointer-events-none -mt-[70vh]"
        >
          <motion.svg
            style={{ scale: scale, x: x }}
            className="w-[7vw] h-[7vw] border-blue-500 /border-2 sticky top-[23vh] ml-[4vw]  z-[0]"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle cx="50" cy="50" r="40" fill="#F0F0F0" />
          </motion.svg>
          <motion.div
            style={{
              opacity: opacity,
              y: y,
            }}
            className="w-full h-fit /border-2 border-green sticky top-[30vh] flex flex-col"
          >
            {/* Title */}
            <div className="h2 text-black text-right">
              Smart Matching in Seconds
            </div>
            {/* Description */}
            <div className="body-small pt-[20px] w-[calc((4/5)*100%)] self-end">
              Our technology transforms recruitment by instantly analyzing both
              CVs and job descriptions, providing detailed compatibility scores
              that save hours of manual screening time.
            </div>
          </motion.div>
        </div>
      </Layout>
    </div>
  );
};

export default About2;
