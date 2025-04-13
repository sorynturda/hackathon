import Image from "next/image";
import Link from "next/link";
import ArrowSVG from "../../public/svgs/arrow.svg";

function Logo({ className = "", width = 120, height = 40 }) {
  return (
    <div href="/" className={`block ${className}`}>
      <Image
        src={ArrowSVG}
        alt="Arrow"
        width={width}
        height={height}
        priority
      />
    </div>
  );
}

export default Logo;
