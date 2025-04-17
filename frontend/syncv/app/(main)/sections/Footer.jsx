"use client";
import React, { useState } from "react";
import Layout from "../../../components/layout/Layout";
import Logo from "../../../components/common/Logo";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  const [isGetStartedHovered, setIsGetStartedHovered] = useState(false);
  const [isAboutHovered, setIsAboutHovered] = useState(false);

  return (
    <div className="w-full h-screen relative bg-white">
      <Layout>
        <div className="col-start-2 col-span-10 rounded-sm  mt-[20%]">
          <div className="flex max-lg:flex-col">
            {/* Left side */}
            <div className="h2 text-white bg-black p-[40px] min-w-[60%]">
              Transform
              <br />
              your
              <br />
              recruitment
              <br />
              process today
              <span className="text-accent">.</span>
            </div>
            {/* Right side */}
            <div className="bg-white border-2 border-black max-lg:min-h-[30vh] w-full relative">
              <div className="absolute bottom-0 h1   max-lg:-mb-[8%] max-md:-mb-[9%] max-lg:-ml-[2vw] -mb-[9%] -ml-[1vw] ">
                <Logo width={650} />
              </div>
              <div className="absolute top-0 right-0  w-[40%] h-[50%]">
                <div className="flex flex-col gap-[20px] py-[40px]">
                  {/* Get Started Button with animation */}
                  <Link
                    href="/get-started"
                    className="relative overflow-hidden bg-black px-6 py-2 rounded-sm"
                    onMouseEnter={() => setIsGetStartedHovered(true)}
                    onMouseLeave={() => setIsGetStartedHovered(false)}
                  >
                    <motion.div
                      className="absolute inset-0 bg-accent z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isGetStartedHovered ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="body flex justify-center relative z-10 overflow-hidden">
                      <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: isGetStartedHovered ? -30 : 0 }}
                        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                        className="text-white"
                      >
                        GET STARTED
                      </motion.div>
                      <motion.div
                        className="text-black absolute top-0 left-0 w-full text-center"
                        initial={{ y: 30 }}
                        animate={{ y: isGetStartedHovered ? 0 : 30 }}
                        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                      >
                        GET STARTED
                      </motion.div>
                    </div>
                  </Link>

                  {/* About Button with animation */}
                  <Link
                    href="/about"
                    className="relative overflow-hidden bg-black px-6 py-2 rounded-sm"
                    onMouseEnter={() => setIsAboutHovered(true)}
                    onMouseLeave={() => setIsAboutHovered(false)}
                  >
                    <motion.div
                      className="absolute inset-0 bg-accent z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isAboutHovered ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="body flex justify-center relative z-10 overflow-hidden">
                      <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: isAboutHovered ? -30 : 0 }}
                        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                        className="text-white"
                      >
                        ABOUT
                      </motion.div>
                      <motion.div
                        className="text-black absolute top-0 left-0 w-full text-center"
                        initial={{ y: 30 }}
                        animate={{ y: isAboutHovered ? 0 : 30 }}
                        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                      >
                        ABOUT
                      </motion.div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      {/* Copyright text */}
      <div className="absolute bottom-[10px] right-[20px]">
        <div className="body-small text-black">All rights reserved ©2025</div>
      </div>
    </div>
  );
};

export default Footer;
