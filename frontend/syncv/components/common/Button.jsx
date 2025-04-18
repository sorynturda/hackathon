"use client";
import React, { useState } from "react";
import Arrow from "./Arrow";
import Link from "next/link";
import { motion } from "framer-motion";

const Button = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={"/signup"}
      className="relative flex justify-start items-center pr-6 py-1 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background layer with color shift */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ backgroundColor: "#181818" }}
        animate={{
          backgroundColor: isHovered ? "#EC6B2D" : "#181818",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Arrow with slight movement */}
      <div className="relative z-10">
        <Arrow width={30} />
      </div>

      {/* Text reveal effect */}
      <div className="relative overflow-hidden pl-1 z-10">
        <motion.div
          className="text-white body"
          initial={{ y: 0 }}
          animate={{
            y: isHovered ? -30 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          GET STARTED
        </motion.div>

        <motion.div
          className="text-black body absolute top-0 left-0 pl-1"
          initial={{ y: 30 }}
          animate={{
            y: isHovered ? 0 : 30,
          }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          GET STARTED
        </motion.div>
      </div>
    </Link>
  );
};

export default Button;
