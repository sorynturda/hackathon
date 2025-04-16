import React from "react";
import About1 from "./About1";
import About2 from "./About2";
import About3 from "./About3";
import Hero from "./Hero";
import CVModel from "../../../components/3d/ThreeScene";

const CVSection = () => {
  return (
    <div>
      <CVModel modelPath="/models/cv.glb" />
      <div className="relative z-0">
        <Hero />
        <About1 />
        <About2 />
        <About3 />
      </div>
    </div>
  );
};

export default CVSection;
