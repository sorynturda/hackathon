"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../common/Logo";

const SimpleLoaderAnimation = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Simulate loading progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setCompleted(true);

          // Trigger the fade out animation after a delay
          setTimeout(() => {
            // Dispatch custom event when loader is complete
            window.modelLoaded = true;
            window.dispatchEvent(new Event("loaderComplete"));

            if (onLoadingComplete) onLoadingComplete();
          }, 1200);

          return 100;
        }
        const increment = Math.random() * 5 + 3;
        return Math.min(prevProgress + increment, 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50"
      >
        {/* Logo with scale animation */}
        <motion.div
          className="mb-12 w-32 sm:w-40 md:w-48"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{
            scale: [0.8, 1.05, 1],
            opacity: 1,
            transition: {
              duration: 1.8,
              ease: [0.19, 1, 0.22, 1],
              times: [0, 0.6, 1],
            },
          }}
        >
          <Logo width="100%" height="auto" />
        </motion.div>

        {/* Minimal progress bar without counter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-40 sm:w-48 md:w-64 h-[2px] bg-black bg-opacity-10 relative overflow-hidden"
        >
          <motion.div
            className="h-full bg-accent origin-left"
            style={{ scaleX: progress / 100 }}
            transition={{ duration: 0.3 }}
          />

          {/* Small dot that follows progress */}
          <motion.div
            className="absolute top-0 -mt-[3px] w-[8px] h-[8px] rounded-full bg-accent"
            style={{
              left: `calc(${progress}% - 4px)`,
              opacity: progress < 5 ? 0 : 1,
            }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>

        {/* Fade-out overlay */}
        {completed && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SimpleLoaderAnimation;
