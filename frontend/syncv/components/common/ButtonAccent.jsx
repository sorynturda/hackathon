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
      className="relative flex justify-start items-center pr-6 py-1 overflow-hidden w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background layer with color shift - inverted from accent to black */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ backgroundColor: "#EC6B2D" }}
        animate={{
          backgroundColor: isHovered ? "#181818" : "#EC6B2D",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Arrow with slight movement */}
      <div className="relative z-10">
        <Arrow width={40} />
      </div>

      {/* Text reveal effect */}
      <div className="relative overflow-hidden pl-1 z-10">
        <motion.div
          className="text-black h3"
          initial={{ y: 0 }}
          animate={{
            y: isHovered ? -100 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          GET STARTED
        </motion.div>

        <motion.div
          className="text-white h3 absolute top-0 left-0 pl-1"
          initial={{ y: 40 }}
          animate={{
            y: isHovered ? 0 : 100,
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
