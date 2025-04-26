"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "../../../components/layout/Layout";
import Button from "../../../components/common/ButtonAccent";

const Hero = () => {
  // Track if page has fully loaded including 3D model
  const [animationsReady, setAnimationsReady] = useState(false);

  useEffect(() => {
    // Listen for a custom event that the loader will dispatch when done
    const handleLoaderComplete = () => {
      // Delay slightly to ensure smooth transition
      setTimeout(() => {
        setAnimationsReady(true);
      }, 300);
    };

    // Listen for custom event from ThreeScene/Loader
    window.addEventListener("loaderComplete", handleLoaderComplete);

    // Check if loader already completed (if component mounts after loading)
    if (window.modelLoaded) {
      handleLoaderComplete();
    }

    return () => {
      window.removeEventListener("loaderComplete", handleLoaderComplete);
    };
  }, []);

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.7, delay: 0.5 },
    },
  };

  return (
    <div className="w-full h-screen relative">
      <Layout>
        {/* MAIN TITLE */}
        <div className="col-start-2 col-span-10 h1 max-sm:leading-none text-black mt-[20vh]">
          <motion.div
            initial="hidden"
            animate={animationsReady ? "visible" : "hidden"}
            variants={titleVariants}
          >
            AI-Powered
          </motion.div>
          <motion.div
            className="italic"
            initial="hidden"
            animate={animationsReady ? "visible" : "hidden"}
            variants={subtitleVariants}
          >
            Precision
          </motion.div>
        </div>
      </Layout>

      {/* CONNECTING TALENT*/}
      <motion.div
        initial="hidden"
        animate={animationsReady ? "visible" : "hidden"}
        variants={textVariants}
        className="absolute bottom-[20px] left-[calc(2/12*100%-20px)] transform -rotate-90 origin-bottom-left whitespace-nowrap body-small"
      >
        CONNECTING TALENT
      </motion.div>

      <motion.div
        initial="hidden"
        animate={animationsReady ? "visible" : "hidden"}
        variants={textVariants}
        className="absolute bottom-[35vh] left-[calc(2/12*100%)] xl:w-[calc((100%-260px)/12)] max-xl:w-[calc((100%-260px)/6)] max-md:w-[calc((100%-260px)/3)] max-sm:w-[calc((100%-260px)/1.5)] transform origin-bottom-left body-small border-t pt-2 border-black"
      >
        Every job has its perfect match. We find yours.
      </motion.div>

      <motion.div
        initial="hidden"
        animate={animationsReady ? "visible" : "hidden"}
        variants={textVariants}
        className="absolute bottom-[35vh] right-[calc(2/12*100%)] xl:w-[calc((100%-260px)/12)] max-xl:w-[calc((100%-260px)/6)] max-md:w-[calc((100%-260px)/3)] max-sm:w-[calc((100%-260px)/1.5)] transform origin-bottom-left body-small text-right border-b pb-2 border-black"
      >
        Matching The Right Talent To The Right Opportunity.
      </motion.div>

      <div className="absolute bottom-[20px] right-[20px] h-[calc((100%)/12)] origin-top-right rotate-90 translate-y-full max-md:hidden">
        <motion.div
          initial="hidden"
          animate={animationsReady ? "visible" : "hidden"}
          variants={textVariants}
        >
          <Button />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
