"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [hoveredButton, setHoveredButton] = useState(null);
  const [prevPath, setPrevPath] = useState(pathname);
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const perspectiveDirection = scrollY > 50 ? "up" : "down";

  useEffect(() => {
    setPrevPath(pathname);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isActive = (path) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    if (path !== "/dashboard" && pathname.includes(path)) {
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const buttons = [
    {
      id: "dashboard",
      path: "/dashboard",
      href: "/dashboard",
      icon: "/svgs/dashboard.svg",
      label: "Dashboard",
    },
    {
      id: "jd",
      path: "/dashboard/jd",
      href: "/dashboard/jd",
      icon: "/svgs/jd.svg",
      label: "JD Manager",
    },
    {
      id: "cv",
      path: "/dashboard/cv",
      href: "/dashboard/cv",
      icon: "/svgs/cv.svg",
      label: "CV Manager",
    },
    {
      id: "logout",
      path: null,
      icon: "/svgs/logout.svg",
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const maxLabelWidth = 120;

  const perspectiveVariants = {
    initial: {
      opacity: 0,
      rotateX: perspectiveDirection === "up" ? -5 : 5,
      scale: 0.96,
      y: perspectiveDirection === "up" ? 20 : -20,
      transformPerspective: 1000,
      transformOrigin: "center center",
    },
    animate: {
      opacity: 1,
      rotateX: 0,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1],
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      rotateX: perspectiveDirection === "up" ? 5 : -5,
      scale: 0.98,
      y: perspectiveDirection === "up" ? -20 : 20,
      transition: {
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  const elementVariants = {
    initial: {
      opacity: 0,
      y: 15,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const mobileMenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  return (
    <div className="w-full min-h-screen">
      <div className="bg-black h-screen fixed left-0 w-[calc(((100%-260px)/12)+20px)] md:block hidden"></div>

      <div className="md:hidden fixed top-4 left-4 z-[1001]">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-black p-3 rounded-md"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path
              d={
                isMobileMenuOpen
                  ? "M18 6L6 18M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="fixed top-0 left-0 w-[70%] h-full bg-black z-[1000] md:hidden flex flex-col justify-center items-center"
          >
            {buttons.map((button) => {
              const active = button.path ? isActive(button.path) : false;
              const ButtonComponent = button.onClick ? "div" : Link;
              const buttonProps = button.onClick
                ? {
                    onClick: () => {
                      setIsMobileMenuOpen(false);
                      button.onClick();
                    },
                  }
                : {
                    href: button.href,
                    onClick: () => setIsMobileMenuOpen(false),
                  };

              return (
                <ButtonComponent
                  key={button.id}
                  {...buttonProps}
                  className={`w-full py-4 px-6 flex items-center gap-4 ${
                    active ? "bg-accent text-black" : "text-white"
                  }`}
                >
                  <img
                    src={button.icon}
                    alt={button.label}
                    className={`w-6 h-6 ${
                      active ? "filter-none" : "filter invert"
                    }`}
                  />
                  <span className="body-small">{button.label}</span>
                </ButtonComponent>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-[999] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="md:ml-[calc(((100%-260px)/12)+20px+24px+20px)] pt-[5vh] px-4 md:px-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={perspectiveDirection}>
          <motion.div
            key={pathname}
            custom={perspectiveDirection}
            variants={perspectiveVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full transform-gpu"
          >
            <motion.div variants={elementVariants}>{children}</motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop*/}
      <div className="bg-accent h-[40%] top-[32%] fixed left-[calc((((100%-260px)/12)+20px)/1.45)] w-24 rounded-sm flex-col items-center justify-around z-[1000] hidden md:flex">
        {buttons.map((button) => {
          const active = button.path ? isActive(button.path) : false;
          const isHovered = hoveredButton === button.id;

          const ButtonComponent = button.onClick ? "div" : Link;
          const buttonProps = button.onClick
            ? { onClick: button.onClick }
            : { href: button.href };

          return (
            <div key={button.id} className="relative">
              <AnimatePresence>
                {isHovered && !active && (
                  <motion.div
                    className="absolute left-0 top-0 bg-accent h-12 rounded-md overflow-hidden flex pointer-events-none"
                    initial={{ width: 48 }}
                    animate={{ width: 48 + maxLabelWidth }}
                    exit={{ width: 48 }}
                    transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                    style={{ zIndex: -1 }}
                  >
                    <div className="w-12 flex-shrink-0"></div>

                    <motion.div
                      className="flex items-center pr-4 h-full justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, delay: 0.05 }}
                    >
                      <span className="whitespace-nowrap text-black body-small">
                        {button.label}
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <ButtonComponent
                {...buttonProps}
                className={`w-12 h-12 flex items-center justify-center rounded-md z-10 relative ${
                  active
                    ? "bg-black shadow-md transform scale-110"
                    : "hover:bg-black/10"
                } transition-all duration-300`}
                onMouseEnter={() => setHoveredButton(button.id)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <img
                  src={button.icon}
                  alt={button.label}
                  className={`w-6 h-6 transition-transform ${
                    active ? "scale-110 filter invert brightness-200" : ""
                  }`}
                />
              </ButtonComponent>
            </div>
          );
        })}
      </div>
    </div>
  );
}
