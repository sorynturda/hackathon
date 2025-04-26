"use client";
import Layout from "@/components/layout/Layout";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const OurMission = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const textRef1 = useRef(null);
  const textRef2 = useRef(null);

  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });
  const isText1InView = useInView(textRef1, { once: true, amount: 0.5 });
  const isText2InView = useInView(textRef2, { once: true, amount: 0.5 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["end 80%", "end start"],
  });
  const signX = useTransform(scrollYProgress, [0, 1], ["0px", "150px"]);

  return (
    <div className="h-[80vh]">
      <div className="w-full mt-[30vh] relative">
        <motion.div
          className="absolute right-[20px] h2 text-black text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Our
          <br />
          Approach
        </motion.div>
        <Layout>
          <motion.div
            ref={titleRef}
            className="col-start-3 col-span-6 h3 text-black mt-[25vh] leading-[0.8]"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isTitleInView ? 1 : 0,
              y: isTitleInView ? 0 : 20,
            }}
            transition={{ duration: 0.6 }}
          >
            ANALYZE: Deep understanding of job requirements{" "}
          </motion.div>
          <motion.div
            ref={textRef1}
            className="col-start-3 col-span-4 body-small text-black mt-[40px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isText1InView ? 1 : 0,
              y: isText1InView ? 0 : 20,
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our technology goes beyond traditional keyword matching. We analyze
            the relationships between skills, experiences, and job requirements,
            uncovering connections that might otherwise be missed.
          </motion.div>
          <motion.div
            ref={textRef2}
            className="col-start-7 col-span-2 body-small text-black mt-[120px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isText2InView ? 1 : 0,
              y: isText2InView ? 0 : 20,
            }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            The result is a scoring system that provides recruiters with
            insights that matter, helping them make better decisions faster
            while ensuring every candidate gets fair consideration based on
            their true potential.
          </motion.div>
        </Layout>
        <motion.div
          ref={containerRef}
          style={{ x: signX }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="h1 text-black absolute bottom-0 left-[20px]"
        >
          &gt;
        </motion.div>
      </div>
    </div>
  );
};

export default OurMission;
