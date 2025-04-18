"use client";
import Layout from "@/components/layout/Layout";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const OurMission = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });
  const isSubtitleInView = useInView(subtitleRef, { once: true, amount: 0.5 });
  const isText1InView = useInView(text1Ref, { once: true, amount: 0.5 });
  const isText2InView = useInView(text2Ref, { once: true, amount: 0.5 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["end 80%", "end start"],
  });
  const signX = useTransform(scrollYProgress, [0, 1], ["0px", "200px"]);

  return (
    <div className="w-full mt-56 relative">
      <motion.div
        ref={titleRef}
        className="absolute right-[20px] h2 text-black text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: isTitleInView ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        Our
        <br />
        Mission
      </motion.div>
      <Layout>
        <motion.div
          ref={subtitleRef}
          className="col-start-3 col-span-6 h3 text-black mt-[25vh] leading-[0.8]"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isSubtitleInView ? 1 : 0,
            y: isSubtitleInView ? 0 : 20,
          }}
          transition={{ duration: 0.6 }}
        >
          Redefining recruitment through technology
        </motion.div>
        <motion.div
          ref={text1Ref}
          className="col-start-3 col-span-4 body-small text-black mt-[40px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isText1InView ? 1 : 0,
            y: isText1InView ? 0 : 20,
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          At SynCV, we're transforming how talent connects with opportunity. Our
          platform uses advanced technology to create precise matches between
          CVs and job descriptions, eliminating the inefficiencies of
          traditional recruitment processes.{" "}
        </motion.div>
        <motion.div
          ref={text2Ref}
          className="col-start-7 col-span-2 body-small text-black mt-[120px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isText2InView ? 1 : 0,
            y: isText2InView ? 0 : 20,
          }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          At SynCV, we're transforming how talent connects with opportunity. Our
          platform uses advanced technology to create precise matches between
          CVs and job descriptions, eliminating the inefficiencies of
          traditional recruitment processes.{" "}
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
  );
};

export default OurMission;
