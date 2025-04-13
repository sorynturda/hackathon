import React from "react";
import Layout from "../../../components/layout/Layout";
import Button from "../../../components/common/ButtonAccent";

const Hero = () => {
  return (
    <div className="w-full h-screen relative">
      <Layout>
        {/* MAIN TITLE */}
        <div className="col-start-2 col-span-10 h1 text-black mt-[20vh]">
          AI-Powered
          <br /> <div className="italic">Precision</div>
        </div>
      </Layout>

      {/* CONNECTING TALENT*/}
      <div className="absolute bottom-[20px] left-[calc(2/12*100%-20px)] transform -rotate-90 origin-bottom-left whitespace-nowrap body-small">
        CONNECTING TALENT
      </div>
      <div className="absolute bottom-[35vh] left-[calc(2/12*100%)] w-[calc((100%-260px)/12)] transform origin-bottom-left body-small border-t pt-2 border-black">
        Every job has its perfect match. We find yours.
      </div>
      <div className="absolute bottom-[35vh] right-[calc(2/12*100%)] w-[calc((100%-260px)/12)] transform origin-bottom-left body-small text-right border-b pb-2 border-black">
        Matching The Right Talent To The Right Opportunity.
      </div>
      <div className="absolute bottom-[20px] right-[20px] h-[calc((100%)/12)] origin-top-right rotate-90 translate-y-full">
        <Button />
      </div>
    </div>
  );
};

export default Hero;
