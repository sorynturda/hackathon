"use client";
import Layout from "@/components/layout/Layout";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const OurMission = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const text1RefDesktop = useRef(null);
  const text1RefMobile = useRef(null);
  const text2RefDesktop = useRef(null);
  const text2RefMobile = useRef(null);

  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });
  const isSubtitleInView = useInView(subtitleRef, { once: true, amount: 0.5 });
  const isText1DesktopInView = useInView(text1RefDesktop, {
    once: true,
    amount: 0.5,
  });
  const isText1MobileInView = useInView(text1RefMobile, {
    once: true,
    amount: 0.5,
  });
  const isText2DesktopInView = useInView(text2RefDesktop, {
    once: true,
    amount: 0.5,
  });
  const isText2MobileInView = useInView(text2RefMobile, {
    once: true,
    amount: 0.5,
  });

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
          className="col-start-3 col-span-6 max-md:col-start-3 max-md:col-span-10 h3 text-black mt-[25vh] leading-[0.8]"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isSubtitleInView ? 1 : 0,
            y: isSubtitleInView ? 0 : 20,
          }}
          transition={{ duration: 0.6 }}
        >
          Redefining recruitment through technology
        </motion.div>

        {/* Desktop version of text1 */}
        <motion.div
          ref={text1RefDesktop}
          className="col-start-3 col-span-4 max-md:col-span-5 body-small text-black mt-[40px] max-md:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isText1DesktopInView ? 1 : 0,
            y: isText1DesktopInView ? 0 : 20,
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          At SynCV, we're transforming how talent connects with opportunity. Our
          platform uses advanced technology to create precise matches between
          CVs and job descriptions, eliminating the inefficiencies of
          traditional recruitment processes.{" "}
        </motion.div>

        {/* Mobile version of text1 */}
        <motion.div
          ref={text1RefMobile}
          className="col-start-3 col-span-4 max-md:col-start-3 max-md:col-span-5 body-small text-black mt-[40px] md:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isText1MobileInView ? 1 : 0,
            y: isText1MobileInView ? 0 : 20,
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          SynCV transforms talent matching using advanced tech for precise
          CV-to-job matches, eliminating traditional recruitment inefficiencies.
        </motion.div>

        {/* Desktop version of text2 */}
        <motion.div
          ref={text2RefDesktop}
          className="col-start-7 col-span-2 max-md:col-span-5 body-small text-black mt-[120px] max-md:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isText2DesktopInView ? 1 : 0,
            y: isText2DesktopInView ? 0 : 20,
          }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          We believe that behind every CV is a person with unique skills and
          potential, and behind every job description is a team looking for the
          right addition. Our mission is to bridge this gap with precision and
          speed.
        </motion.div>

        {/* Mobile version of text2 */}
        <motion.div
          ref={text2RefMobile}
          className="col-start-7 col-span-2 max-md:col-start-8 max-md:col-span-5 body-small text-black mt-[120px] md:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isText2MobileInView ? 1 : 0,
            y: isText2MobileInView ? 0 : 20,
          }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          We connect unique talent with the right teams through precision
          matching and speed.
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
