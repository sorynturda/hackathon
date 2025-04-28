"use client";
import React from "react";
import { motion } from "framer-motion";

function StatsCard({ title, count }) {
  return (
    <motion.div
      className="bg-white rounded-lg border-2 border-black flex flex-col items-center justify-center
       p-3 sm:p-4 md:p-6 w-full h-full
       min-h-[100px] sm:min-h-[120px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="body-small mb-1 sm:mb-2 md:mb-4 text-center">{title}</h3>
      <div className="text-xl sm:text-2xl md:h3 flex items-center justify-center">
        {count}
        <span className="ml-1 sm:ml-2 text-xs sm:text-sm">↑</span>
      </div>
      <span className="text-xs sm:body-small text-black/50 text-center mt-1 sm:mt-2">
        Count
      </span>
    </motion.div>
  );
}

export default StatsCard;
