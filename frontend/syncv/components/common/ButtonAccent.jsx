import React from "react";
import Arrow from "./Arrow";
import Link from "next/link";

const Button = () => {
  return (
    <Link
      href={"/signup"}
      className="flex justify-start items-center pr-6 py-1 bg-accent text-black w-full h-full"
    >
      <div>
        <Arrow width={40} />
      </div>
      <div className="text-black h3 pl-1">GET STARTED</div>
    </Link>
  );
};

export default Button;
