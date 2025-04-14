"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ParallaxZoom = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  const { scrollYProgress: textProgress } = useScroll({
    target: textRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: containerProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Animații pentru primul text
  const smallTextY = useTransform(textProgress, [0.1, 0.25], [50, 0]);

  const smallTextOpacity = useTransform(textProgress, [0.1, 0.25], [0, 1]);

  // Animații pentru textul principal
  const mainTextY = useTransform(textProgress, [0.2, 0.35], [100, 0]);

  const mainTextOpacity = useTransform(textProgress, [0.2, 0.35], [0, 1]);

  const mainTextScale = useTransform(textProgress, [0.2, 0.35], [0.9, 1]);

  // Animații pentru CV-uri
  const containerScale = useTransform(
    containerProgress,
    [0, 0.3, 0.6],
    [0.7, 0.9, 1.1]
  );

  const cv1Scale = useTransform(
    containerProgress,
    [0, 0.3, 0.6],
    [0.9, 1.1, 1.2]
  );
  const cv2Scale = useTransform(
    containerProgress,
    [0, 0.3, 0.6],
    [0.9, 1.2, 1.4]
  );
  const cv3Scale = useTransform(
    containerProgress,
    [0, 0.3, 0.6],
    [0.9, 1.5, 2]
  );
  const cv4Scale = useTransform(
    containerProgress,
    [0, 0.3, 0.6],
    [0.9, 1.2, 1.4]
  );
  const cv5Scale = useTransform(
    containerProgress,
    [0, 0.3, 0.6],
    [0.9, 1.1, 1.2]
  );

  const borderProgress = useTransform(containerProgress, [0.2, 0.5], [0, 400]);

  return (
    <div className="relative -mt-[40vh]">
      <div ref={containerRef} className="min-h-[120vh]">
        <motion.div
          style={{ scale: containerScale }}
          className="top-0 h-screen flex items-center justify-center overflow-hidden"
        >
          <div className="grid grid-cols-5 gap-8 w-full px-24">
            <motion.div
              style={{ scale: cv1Scale }}
              className="col-span-1 origin-center z-[1]"
            >
              <img
                src="/images/cv2.png"
                alt=""
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div
              style={{ scale: cv2Scale }}
              className="col-span-1 origin-center z-[2]"
            >
              <img
                src="/images/cv1.png"
                alt=""
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div
              style={{ scale: cv3Scale }}
              className="col-span-1 origin-center z-[3] relative"
            >
              <img
                src="/images/cv3.png"
                alt=""
                className="w-full h-full object-contain relative"
              />
              {/* Border container */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, #EC6B2D 100%, #EC6B2D 100%) top left no-repeat,
                             linear-gradient(0deg, #EC6B2D 100%, #EC6B2D 100%) top right no-repeat,
                             linear-gradient(-90deg, #EC6B2D 100%, #EC6B2D 100%) bottom right no-repeat,
                             linear-gradient(180deg, #EC6B2D 100%, #EC6B2D 100%) bottom left no-repeat`,
                  backgroundSize: useTransform(borderProgress, (value) => {
                    const percent = (value / 400) * 100;
                    const side = Math.min(percent, 100);
                    return `${side}% 2px, 2px ${side}%, ${side}% 2px, 2px ${side}%`;
                  }),
                }}
              />
            </motion.div>
            <motion.div
              style={{ scale: cv4Scale }}
              className="col-span-1 origin-center z-[2]"
            >
              <img
                src="/images/cv4.png"
                alt=""
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div
              style={{ scale: cv5Scale }}
              className="col-span-1 origin-center z-[1]"
            >
              <img
                src="/images/cv5.png"
                alt=""
                className="w-full h-full object-contain"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div
        ref={textRef}
        className="h-[60vh] w-full flex flex-col justify-start items-center pt-[10vh] overflow-hidden"
      >
        <motion.div
          style={{
            y: smallTextY,
            opacity: smallTextOpacity,
          }}
          className="body-small text-black"
        >
          and just like that
        </motion.div>

        <motion.div
          style={{
            y: mainTextY,
            opacity: mainTextOpacity,
            scale: mainTextScale,
          }}
          className="h1 text-center w-[80%] pt-[40px]"
        >
          You found the right one
        </motion.div>
      </div>
    </div>
  );
};

export default ParallaxZoom;
