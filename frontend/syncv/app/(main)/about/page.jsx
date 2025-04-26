import React from "react";

import Hero from "./sections/Hero";
import OurMission from "./sections/OurMission";
import OurApproach from "./sections/OurApproach";
import Team from "./sections/Team";
import Footer from "../sections/Footer";

const page = () => {
  return (
    <div>
      <Hero />
      <OurMission />
      <OurApproach />
      <Team />
      <Footer />
    </div>
  );
};

export default page;
