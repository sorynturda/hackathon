import React from "react";
import Arrow from "./Arrow";
import Link from "next/link";

const Button = () => {
  return (
    <Link
      href={"/signup"}
      className="flex justify-start items-center pr-6 py-1 bg-black"
    >
      <div>
        <Arrow width={30} />
      </div>
      <div className="text-white body pl-1">GET STARTED</div>
    </Link>
  );
};

export default Button;
