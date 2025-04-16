import React from "react";
import Logo from "../common/Logo";
import Button from "../common/Button";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-[20px] flex justify-between items-center h-[10vh] fixed z-[9999]">
      {/* LOGO */}
      <div className="w-24 sm:w-28 md:w-32 lg:w-40">
        <Logo width="100%" height="auto" />
      </div>

      {/* BUTTONS */}
      <div className="flex items-center gap-3 sm:gap-5 md:gap-[40px]">
        <Link
          href={"/about"}
          className="text-black body flex items-center justify-center"
        >
          ABOUT
        </Link>
        <div>
          <Button />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
