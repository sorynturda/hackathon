"use client";
import React, { useState, useEffect } from "react";
import Logo from "../common/Logo";
import Button from "../common/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hideNavButtons, setHideNavButtons] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const shouldHideNavbar =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/terms") ||
      pathname.startsWith("/privacy-policy") ||
      pathname.startsWith("/matches");

    const shouldHideNavButtons =
      pathname.startsWith("/signup") || pathname.startsWith("/login");

    setIsVisible(!shouldHideNavbar);
    setHideNavButtons(shouldHideNavButtons);
  }, [pathname]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-[20px] flex justify-between items-center h-[10vh] fixed z-[9999]">
      <div className="w-24 sm:w-28 md:w-32 lg:w-40">
        <Logo width="100%" height="auto" />
      </div>

      {!hideNavButtons && (
        <div className="flex items-center gap-3 sm:gap-5 md:gap-[40px]">
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsAboutHovered(true)}
            onMouseLeave={() => setIsAboutHovered(false)}
          >
            <Link
              href={"/about"}
              className="text-black body flex items-center justify-center"
            >
              <div className="relative overflow-hidden">
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: isAboutHovered ? -30 : 0 }}
                  transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                >
                  ABOUT
                </motion.div>

                <motion.div
                  className="absolute top-0 left-0 text-accent"
                  initial={{ y: 30 }}
                  animate={{ y: isAboutHovered ? 0 : 30 }}
                  transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                >
                  ABOUT
                </motion.div>
              </div>
            </Link>
          </div>
          <div>
            <Button />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
