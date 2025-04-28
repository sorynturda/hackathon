"use client";
import React from "react";
import Layout from "../../../../components/layout/Layout";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero = () => {
  const { scrollYProgress } = useScroll();

  // Move the ball to the right as we scroll
  const ballX = useTransform(scrollYProgress, [0, 1], ["8%", "50%"]);

  // Animation variants
  const titleVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const statsVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: 0.3 + index * 0.15 },
    }),
  };

  const shapesVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { duration: 0.8, delay: 1.2 } },
  };

  return (
    <div className="w-full h-screen">
      <Layout>
        {/* Big Title */}
        <motion.div
          className="h1 text-black col-start-2 col-span-10 mt-[20vh] max-sm:leading-none"
          initial="initial"
          animate="animate"
          variants={titleVariants}
        >
          About us
        </motion.div>

        {/* Stats */}
        <div className="col-start-2 col-span-3 mt-[15vh] flex">
          <div className="flex flex-col">
            <motion.div
              className="self-end body-small text-accent"
              initial="initial"
              animate="animate"
              custom={0}
              variants={statsVariants}
            >
              33%
            </motion.div>

            <motion.div
              className="border-t border-black text-justify pt-[20px] body-small max-md:hidden"
              initial="initial"
              animate="animate"
              custom={0}
              variants={statsVariants}
            >
              Reduction in recruitment time compared to traditional CV screening
              methods. Our AI-powered system analyzes and matches candidates in
              seconds, not days.
            </motion.div>
            <motion.div
              className="border-t border-black text-justify pt-[20px] body-small md:hidden"
              initial="initial"
              animate="animate"
              custom={0}
              variants={statsVariants}
            >
              AI-powered matching reduces recruitment from days to seconds.
            </motion.div>
          </div>
        </div>

        <div className="col-start-6 col-span-3 mt-[15vh] flex">
          <div className="flex flex-col">
            <motion.div
              className="self-end body-small text-accent"
              initial="initial"
              animate="animate"
              custom={1}
              variants={statsVariants}
            >
              66%
            </motion.div>
            <motion.div
              className="border-t border-black text-justify pt-[20px] body-small max-md:hidden"
              initial="initial"
              animate="animate"
              custom={1}
              variants={statsVariants}
            >
              Higher accuracy in candidate-job matching compared to manual
              screening. Our technology identifies critical skills and
              experiences that directly impact job success rates.
            </motion.div>
            <motion.div
              className="border-t border-black text-justify pt-[20px] body-small md:hidden"
              initial="initial"
              animate="animate"
              custom={1}
              variants={statsVariants}
            >
              Higher accuracy than manual screening, identifying skills that
              drive job success.
            </motion.div>
          </div>
        </div>

        <div className="col-start-10 col-span-3 mt-[15vh] flex">
          <div className="flex flex-col">
            <motion.div
              className="self-end body-small text-accent"
              initial="initial"
              animate="animate"
              custom={2}
              variants={statsVariants}
            >
              99%
            </motion.div>
            <motion.div
              className="border-t border-black text-justify pt-[20px] body-small max-md:hidden"
              initial="initial"
              animate="animate"
              custom={2}
              variants={statsVariants}
            >
              Client satisfaction with our talent matching platform. SynCV
              transforms recruitment by providing clear, actionable results you
              can trust immediately.
            </motion.div>
            <motion.div
              className="border-t border-black text-justify pt-[20px] body-small md:hidden"
              initial="initial"
              animate="animate"
              custom={2}
              variants={statsVariants}
            >
              Client satisfaction guaranteed with clear, actionable results you
              can trust.
            </motion.div>
          </div>
        </div>
      </Layout>

      <motion.div
        className="absolute right-[20px] max-md:right-[0px] top-[15%] origin-bottom-right -rotate-90 body-small"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1 }}
      >
        Every job has its match. We find yours.
      </motion.div>

      <motion.div
        className="absolute bottom-[20px] left-[20px] w-[10%] h-[25%] bg-black"
        initial="initial"
        animate="animate"
        variants={shapesVariants}
      />

      <motion.div
        className="absolute bottom-[20px] w-[7%] aspect-square bg-accent rounded-full"
        initial="initial"
        animate="animate"
        style={{ left: ballX }}
        variants={{
          ...shapesVariants,
          animate: {
            ...shapesVariants.animate,
            transition: { duration: 0.8, delay: 1.4 },
          },
        }}
      />
    </div>
  );
};

export default Hero;
