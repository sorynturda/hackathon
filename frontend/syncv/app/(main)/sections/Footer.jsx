"use client";
import Layout from "../../../components/layout/Layout";
import Logo from "../../../components/common/Logo";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full h-screen relative bg-white">
      <Layout>
        <div className="col-start-2 col-span-10 rounded-sm  mt-[20%]">
          <div className="flex">
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
            <div className="bg-white border-2 border-black w-full relative">
              <div className="absolute bottom-0 h1  -mb-[9%] -ml-[1vw]">
                <Logo width={650} />
              </div>
              <div className="absolute top-0 right-0  w-[40%] h-[50%]">
                <div className="flex flex-col gap-[20px] py-[40px]">
                  <Link
                    href="/get-started"
                    className="bg-black text-white px-6 py-2 rounded-sm"
                  >
                    <div className="body flex justify-center">GET STARTED</div>
                  </Link>
                  <Link
                    href="/about"
                    className="bg-black text-white px-6 py-2 rounded-sm"
                  >
                    <div className="body flex justify-center">ABOUT</div>
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
