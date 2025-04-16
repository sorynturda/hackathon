import Image from "next/image";
import Link from "next/link";
import LogoSVG from "../../public/logo/logo.svg";

function Logo({ className = "", width = 120, height = 40 }) {
  return (
    <Link href="/" className={`block ${className}`}>
      <Image src={LogoSVG} alt="Logo" width={width} height={height} priority />
    </Link>
  );
}

export default Logo;
