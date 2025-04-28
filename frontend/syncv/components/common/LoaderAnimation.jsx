"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../common/Logo";

const SleekModernLoader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setCompleted(true);

          setTimeout(() => {
            window.modelLoaded = true;
            window.dispatchEvent(new Event("loaderComplete"));

            if (onLoadingComplete) onLoadingComplete();
          }, 1500);

          return 100;
        }

        // Simple, linear progression
        const increment = Math.random() * 3 + 1;
        return Math.min(prevProgress + increment, 100);
      });
    }, 70);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
          }}
          className="fixed inset-0 bg-white flex flex-col items-center justify-center"
        >
          <motion.div
            className="w-64 sm:w-96 md:w-[500px]"
            initial={{
              opacity: 0,
              y: -40,
              rotateX: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: {
                duration: 1.2,
                ease: [0.19, 1, 0.22, 1],
              },
            }}
          >
            <Logo width="100%" height="auto" />
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-accent"
            style={{
              width: `${progress}%`,
            }}
            transition={{
              ease: "easeOut",
              duration: 0.5,
            }}
          />

          <motion.div
            className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 font-bold h1 text-black"
            style={{
              fontFamily: "sans-serif",
              opacity: 0.12,
              lineHeight: 0.8,
            }}
          >
            {Math.floor(progress)}
          </motion.div>

          {/* Final completion animation */}
          {completed && (
            <>
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />

              <motion.div
                className="absolute bottom-0 left-0 w-full h-1 bg-accent"
                initial={{ scaleX: 1 }}
                animate={{
                  scaleX: 0,
                  transition: {
                    duration: 0.7,
                    delay: 0.3,
                    ease: [0.19, 1, 0.22, 1],
                  },
                }}
                style={{ transformOrigin: "right" }}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SleekModernLoader;
