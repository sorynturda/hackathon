"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Layout from "../../../components/layout/Layout";
import React, { useRef } from "react";

const About3 = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
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
    <div className="w-full h-[150vh] /border-8 relative border-green -mt-[50vh]">
      <div
        ref={containerRef}
        className=" w-full h-[150vh] /border-2 border-red relative pointer-events-none -mt-[70vh]"
      >
        <motion.div
          style={{
            opacity: opacity,
            y: y,
          }}
          className="w-full h-fit /border-2 border-green sticky top-[70vh] flex flex-col  items-center"
        >
          {/* Title */}
          <div className="h2 w-[50vw] max-md:w-[70vw] max-sm:w-[80vw] text-black text-center /border-2 border-red flex justify-center">
            Clear Results You Can Trust
          </div>
          {/* Description */}
          <div className="body-small pt-[20px]  w-[30vw] max-md:w-[50vw] max-sm:w-[70vw] ">
            Just upload documents and let the system do the rest - it compares
            key requirements with candidate skills, ranks matches based on
            relevance, and presents clear results you can act on immediately.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About3;
