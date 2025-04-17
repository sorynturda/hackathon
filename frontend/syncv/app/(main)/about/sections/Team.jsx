"use client";
import Layout from "@/components/layout/Layout";
import React, { useRef } from "react";
import { motion } from "framer-motion";

const OurMission = () => {
  const departmentRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const container = {
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="w-full h-[50vh] relative mt-56 border-2 border-red border-opacity-0">
      <motion.div
        className="absolute top-0 right-[20px] h2 text-black text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Team
      </motion.div>
      <div className="flex justify-center mt-[25vh]">
        <motion.div
          className="flex justify-between w-[80vw]"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* UX/UI */}
          <motion.div
            className="flex flex-col items-center gap-2"
            variants={item}
          >
            <div className="h3 text-black pb-5">UX/UI</div>
            <div className="text-black body-small">Paul Oprisor</div>
            <div className="text-black body-small">Robert Magalau</div>
          </motion.div>

          {/* Frontend */}
          <motion.div
            className="flex flex-col items-center gap-2"
            variants={item}
          >
            <div className="h3 text-black pb-5">Frontend</div>
            <div className="text-black body-small">Paul Oprisor</div>
            <div className="text-black body-small">Robert Magalau</div>
          </motion.div>

          {/* Backend */}
          <motion.div
            className="flex flex-col items-center gap-2"
            variants={item}
          >
            <div className="h3 text-black pb-5">Backend</div>
            <div className="text-black body-small">Sorin Turda</div>
            <div className="text-black body-small">Mihnea Bostina</div>
          </motion.div>

          {/* ML */}
          <motion.div
            className="flex flex-col items-center gap-2"
            variants={item}
          >
            <div className="h3 text-black pb-5">ML</div>
            <div className="text-black body-small">Mihnea Bostina</div>
            <div className="text-black body-small">Andrei Pintilie</div>
            <div className="text-black body-small">Tudor Bartha</div>
            <div className="text-black body-small">Razvan Bobos</div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OurMission;
