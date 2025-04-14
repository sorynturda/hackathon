import React from "react";
import Hero from "./sections/Hero";
import About1 from "./sections/About1";
import About2 from "./sections/About2";
import About3 from "./sections/About3";
import Words from "./sections/Words";
import ParallaxZoom from "./sections/ParallaxZoom";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <About1 />
      <About2 />
      <About3 />
      <Words />
      <ParallaxZoom />
    </div>
  );
}
