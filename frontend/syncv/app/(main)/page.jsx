import React from "react";
import Words from "./sections/Words";
import ParallaxZoom from "./sections/ParallaxZoom";
import Footer from "./sections/Footer";
import CVSection from "./sections/CVSection";

export default function Home() {
  return (
    <div className="">
      <CVSection />
      <Words />
      <ParallaxZoom />
      <Footer />
    </div>
  );
}
